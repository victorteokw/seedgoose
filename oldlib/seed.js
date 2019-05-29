const eachAsync = require('series-async-each');
const set = require('lodash/set');
const get = require('lodash/get');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const fill = require('lodash/fill');
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


//   const treeSchema = model.schema.tree;
//     await replaceRefsOnRecord(
//       convertedRecord,
//       treeSchema,
//       collection,
//       mongoose.models,
//       [],
//       options.mappingTable,
//       mongoose
//     );

// };
