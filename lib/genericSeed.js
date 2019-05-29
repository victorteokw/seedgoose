"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Types;
const series_async_each_1 = require("series-async-each");
const idMap_1 = require("./idMap");
const SeedingCommand_1 = require("./SeedingCommand");
const stringIsObjectId_1 = require("./stringIsObjectId");
const shouldIgnoreItem = (item, key, mongoose) => {
    if (key === '_id')
        return true;
    if (key === 'id')
        return true;
    if (item instanceof mongoose.VirtualType)
        return true;
};
const transformRecord = (record, schema, mongoose) => __awaiter(this, void 0, void 0, function* () {
    if (record === undefined)
        record = null;
    // this is a primitive type declared with mongoose primitive types
    if (schema.schemaName) {
        // ignore mongoose Schema primitive types for now
        // TODO: handle date casting here
        return record;
    }
    // schema object type
    if (schema instanceof mongoose.Schema) {
        const retval = {};
        yield series_async_each_1.default(schema.tree, (item, key) => {
            if (record && record[key]) {
                if (!shouldIgnoreItem(item, key, mongoose)) {
                    retval[key] = transformRecord(record[key], item, mongoose);
                }
            }
        });
        return retval;
    }
    // Array type
    if (Array.isArray(schema)) {
        if (record) {
            const retval = [];
            yield series_async_each_1.default(record, (recordItem) => __awaiter(this, void 0, void 0, function* () {
                retval.push(yield transformRecord(recordItem, schema[0], mongoose));
            }));
            return retval;
        }
        else {
            return [];
        }
    }
});
const genericSeed = function (collectionName, records, mongoose, reporter, command) {
    return __awaiter(this, void 0, void 0, function* () {
        reporter.startSeedCollection(collectionName);
        const model = Object.values(mongoose.models).find((m) => m.collection.name === collectionName);
        yield series_async_each_1.default(records, (record, index) => __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(records) && !record._id && !record.id) {
                throw new Error(`id not found for a record of \`${collectionName}'.`);
            }
            if (Array.isArray(records)) {
                record._id = record.id;
            }
            else {
                record._id = index;
            }
            const nativeId = ObjectId(stringIsObjectId_1.default(record._id) ? record._id : yield idMap_1.getUniqId(collectionName, record._id));
            const db = mongoose.connection.db;
            const dbCollection = db.collection(collectionName);
            if (command === SeedingCommand_1.SeedingCommandType.UNSEED) {
                const result = yield dbCollection.deleteOne({ _id: nativeId });
                reporter.didHandleRecord(result.result.n === 0 ? 'unexist' : 'delete', collectionName, record._id);
                return;
            }
            const transformedRecord = yield transformRecord(record, model.schema, model.base);
            if (command === SeedingCommand_1.SeedingCommandType.RESEED) {
                const result = yield dbCollection.findOneAndUpdate({ _id: nativeId }, { $set: transformedRecord }, { upsert: true, returnOriginal: false });
                const update = result.lastErrorObject.updatedExisting;
                reporter.didHandleRecord(update ? 'update' : 'create', collectionName, record._id);
                return;
            }
            if (command === SeedingCommand_1.SeedingCommandType.SEED) {
                const exist = yield dbCollection.findOne({ _id: nativeId });
                if (exist) {
                    reporter.didHandleRecord('untouch', collectionName, record._id);
                }
                else {
                    const insertResult = (yield dbCollection.insertOne(Object.assign({ _id: nativeId }, transformedRecord))).ops[0];
                    reporter.didHandleRecord('create', collectionName, record._id);
                    return;
                }
            }
        }));
        reporter.endSeedCollection(collectionName);
    });
};
exports.default = genericSeed;
