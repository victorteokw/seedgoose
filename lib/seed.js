const fs = require('fs');
const path = require('path');
const loadFile = require('load-any-file');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const eachAsync = require('series-async-each');
const set = require('lodash/set');
const get = require('lodash/get');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const fill = require('lodash/fill');
const cloneDeep = require('lodash/cloneDeep');
const getUniqId = require('./getUniqId');
const stringIsObjectId = require('./stringIsObjectId');

const getCollections = (mongoose) => {
  return Object.values(mongoose.models).map((model) => model.collection.name);
};

const availableCollections = (allCollections, dataDir) => {
  const files = fs.readdirSync(dataDir);
  const available = files.map((f) => path.parse(f).name);
  return Object.values(allCollections).filter((c) => available.includes(c));
};

const seed = async ({ report, args, options, command }) => {
  const allCollections = args.length ? args : getCollections(mongoose);
  const collections = availableCollections(allCollections, options.data);
  for (const collection of collections) {
    const data = loadFile(path.join(options.data, collection));
    const model = Object.values(mongoose.models)
      .find((m) => m.collection.name === collection);
    await seedCollection({
      mongoose, model, collection, data, report, options, command
    });
  }
};

const replaceRefsOnRecord = async (
  record, treeSchema, collectionName, models, savedPath, mappingTable
) => {
  await eachAsync(treeSchema, async (schemaItem, key) => {
    // Ignore _id field
    if (key === '_id') return;
    // Ignore virtual types
    if (schemaItem instanceof mongoose.VirtualType) return;
    // ignore mongoose Schema primitive types
    if (schemaItem.schemaName) return;
    // subschema
    if (schemaItem instanceof mongoose.Schema) {
      await replaceRefsOnRecord(
        record,
        schemaItem.tree,
        collectionName,
        models,
        [...savedPath, key],
        mappingTable
      );
    } else if (isPlainObject(schemaItem)) {
      if ((schemaItem.type === mongoose.Schema.Types.ObjectId) ||
        (schemaItem.type === mongoose.Types.ObjectId)) {

        // Direct ref definition
        let refCollectionName = mongoose.model(schemaItem.ref).collection.name;

        const refPath = schemaItem.refPath;
        if (refPath) {
          refCollectionName =
            mongoose.model(get(record, refPath)).collection.name;
        }
        if (refCollectionName) {
          const value = get(record, [...savedPath, key]);
          if (value && !stringIsObjectId(value)) {
            set(record, [...savedPath, key],
              await getUniqId(refCollectionName, value, mappingTable));
          }
          if (value && stringIsObjectId(value)) {
            set(record, [...savedPath, key], ObjectId(value));
          }
        }
      } else {
        // Nested objects
        await replaceRefsOnRecord(
          record,
          schemaItem,
          collectionName,
          models,
          [...savedPath, key],
          mappingTable
        );
      }
    // array
    } else if (isArray(schemaItem)) {
      const valueOfArray = get(record, [...savedPath, key]);
      if (valueOfArray && isArray(valueOfArray)) {
        await eachAsync(valueOfArray, async () => {
          await replaceRefsOnRecord(
            record,
            fill(Array(valueOfArray.length), schemaItem[0]),
            collectionName,
            models,
            [...savedPath, key],
            mappingTable
          );
        });
      }
    }
    // Ignore primitive types
  });
};

const seedCollection = async ({
  model, collection, data, report, options, command
}) => {
  if (!Array.isArray(data)) {
    data = Object.keys(data).map((key) => {
      return {
        _id: key,
        ...data[key]
      };
    });
  }
  for (const record of data) {
    const smartId = record._id || record.id;
    if (!smartId) {
      throw new Error(`Invalid record without id '${JSON.stringify(record)}'.`);
    }
    const nativeId = ObjectId(stringIsObjectId(smartId) ?
      smartId :
      await getUniqId(collection, smartId, options.mappingTable));
    const db = mongoose.connection.db;
    const dbCollection = db.collection(collection);
    if (command === 'unseed') {
      const result = await dbCollection.deleteOne({ _id: nativeId });
      report({
        action: result.result.n === 0 ? 'unexist' : 'delete',
        collection,
        id: smartId,
        color: !options.noColorOutput,
        record: {},
        verbose: options.verbose,
        silent: options.silent
      });
      continue;
    }
    // Looping schema to find references to other tables
    // We should handle simple ref, array ref, nested object ref and dynamic
    // refs(refPath).
    const treeSchema = model.schema.tree;
    const convertedRecord = cloneDeep(record);
    delete convertedRecord['_id'];
    delete convertedRecord['id'];
    await replaceRefsOnRecord(
      convertedRecord,
      treeSchema,
      collection,
      mongoose.models,
      [],
      options.mappingTable
    );

    if (command === 'reseed') {
      const result = await dbCollection.findOneAndUpdate(
        { _id: nativeId },
        { $set: convertedRecord },
        { upsert: true, returnOriginal: false }
      );
      const update = result.lastErrorObject.updatedExisting;
      report({
        action: update ? 'update' : 'create',
        collection,
        id: smartId,
        color: !options.noColorOutput,
        record: convertedRecord,
        verbose: options.verbose,
        silent: options.silent
      });
    }
    if (command === 'seed') {
      const result = await dbCollection.findOne({ _id: nativeId });
      if (!result) {
        const insertResult = await dbCollection.insertOne(Object.assign(
          { _id: nativeId },
          convertedRecord)
        );
        const record = insertResult['ops'][0];
        delete record['_id'];
        delete record['id'];
        report({
          action: 'create',
          collection,
          id: smartId,
          color: !options.noColorOutput,
          record,
          verbose: options.verbose,
          silent: options.silent
        });
      } else {
        const record = result;
        delete record['id'];
        delete record['_id'];
        report({
          action: 'untouch',
          collection,
          id: smartId,
          color: !options.noColorOutput,
          record,
          verbose: options.verbose,
          silent: options.silent
        });
      }
    }
  }
};

module.exports = seed;
