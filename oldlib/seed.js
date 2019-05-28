const eachAsync = require('series-async-each');
const set = require('lodash/set');
const get = require('lodash/get');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const fill = require('lodash/fill');
const cloneDeep = require('lodash/cloneDeep');
const getUniqId = require('./getUniqId');
const stringIsObjectId = require('./stringIsObjectId');

const replaceRefsOnRecord = async (
  record, treeSchema, collectionName, models, savedPath, mappingTable, mongoose
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
        mappingTable,
        mongoose
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
              await getUniqId(
                refCollectionName, value, mappingTable, mongoose
              )
            );
          }
          if (value && stringIsObjectId(value)) {
            set(record, [...savedPath, key], mongoose.Types.ObjectId(value));
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
          mappingTable,
          mongoose
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
            mappingTable,
            mongoose
          );
        });
      }
    }
    // Ignore primitive types
  });
};

const seedCollection = async ({
  mongoose, model, collection, data, report, options, command
}) => {
  for (const record of data) {
    const nativeId = mongoose.Types.ObjectId(stringIsObjectId(smartId) ?
      smartId :
      await getUniqId(collection, smartId, options.mappingTable, mongoose));
    const db = mongoose.connection.db;
    const dbCollection = db.collection(collection);

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
      options.mappingTable,
      mongoose
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
