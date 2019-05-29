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
let savedMongoose;
let mappingTable = 'seedgoosemap';
exports.idMapSetMongoose = (mongoose) => {
    savedMongoose = mongoose;
};
exports.idMapSetMappingTable = (table) => {
    mappingTable = table;
};
exports.getUniqId = (collectionName, readableId) => __awaiter(this, void 0, void 0, function* () {
    const db = savedMongoose.connection.db;
    const collection = db.collection(mappingTable);
    const result = yield collection.findOne({ collectionName, readableId });
    if (result) {
        return result._id;
    }
    else {
        const newRecord = yield collection.insertOne({ collectionName, readableId });
        return newRecord.ops[0]._id;
    }
});
