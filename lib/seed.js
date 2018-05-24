let mongoose;
const map = require('lodash/map');
const each = require('lodash/each');
const set = require('lodash/set');
const get = require('lodash/get');
const isObject = require('lodash/isObject');
const isFunction = require('lodash/isFunction');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const keys = require('lodash/keys');
const isEmpty = require('lodash/isEmpty');
const fill = require('lodash/fill');
const stringIsObjectId = require('./stringIsObjectId');

const savedReferences = {};

const replaceRefsInTreeSchema = function(
  data, treeSchema, collectionName, models, savedPath
) {
  map(treeSchema, (schemaItem, key) => {
    // Ignore _id field
    if (key === '_id') return;
    // Ignore virtual types
    if (schemaItem instanceof mongoose.VirtualType) return;
    // ignore mongoose Schema primitive types
    if (schemaItem.schemaName) return;
    // subschema
    if (schemaItem instanceof mongoose.Schema) {
      replaceRefsInTreeSchema(
        data, schemaItem.tree, collectionName, models, [...savedPath, key]
      );
    } else if (isPlainObject(schemaItem)) {
      if ((schemaItem.type === mongoose.Schema.Types.ObjectId) ||
        (schemaItem.type === mongoose.Types.ObjectId)) {

        // Direct ref definition
        let refCollectionName = mongoose.model(schemaItem.ref).collection.name;

        const refPath = schemaItem.refPath;
        if (refPath) {
          refCollectionName = mongoose.model(get(data, refPath)).collection.name;
        }
        if (refCollectionName) {
          savedReferences[refCollectionName] ||
            (savedReferences[refCollectionName] = {});
          const value = get(data, [...savedPath, key]);
          if (value && !stringIsObjectId(value)) {

            if (!savedReferences[refCollectionName][value]) {
              savedReferences[refCollectionName][value] = mongoose.Types.ObjectId();
            }
            set(data, [...savedPath, key],
              savedReferences[refCollectionName][value]);
          }
        }
      } else {
        // Nested objects
        replaceRefsInTreeSchema(
          data, schemaItem, collectionName, models, [...savedPath, key]
        );
      }
    // array
    } else if (isArray(schemaItem)) {
      const valueOfArray = get(data, [...savedPath, key]);
      if (valueOfArray && isArray(valueOfArray)) {
        map(valueOfArray, (v, i) => {
          replaceRefsInTreeSchema(
            data, fill(Array(valueOfArray.length), schemaItem[0]), collectionName, models, [...savedPath, key]
          );
        });
      }
    }
    // Ignore primitive types
  });
};

// options: dry run, inspect, idKey = '_id'
module.exports = async function(_mongoose, models, data, options) {
  mongoose = _mongoose;
  await Promise.all(map(models, async (model) => {
    const collectionName = model.collection.name;
    let dataOfThisCollection = data[collectionName];
    if (!dataOfThisCollection) return;
    // Create references table for this collection if needed.
    savedReferences[collectionName] || (savedReferences[collectionName] = {});
    // We can accept dynamic data generated from functions
    // Most of times, user is using faker
    if (isFunction(dataOfThisCollection)) {
      dataOfThisCollection = dataOfThisCollection();
    }
    // Convert single object to array
    if (isObject(dataOfThisCollection) && !isArray(dataOfThisCollection)) {
      dataOfThisCollection = [dataOfThisCollection];
    }
    await Promise.all(map(dataOfThisCollection, async (data) => {
      // Need to cast _id or not
      if (data._id && !stringIsObjectId(data._id)) {
        // Create reference _id if needed
        if (!savedReferences[collectionName][data._id]) {
          savedReferences[collectionName][data._id] = mongoose.Types.ObjectId();
        }
        // Assign the generated _id
        data._id = savedReferences[collectionName][data._id];
      }
      // Looping schema to find references to other tables
      const treeSchema = model.schema.tree;
      // Should handle simple ref, array ref,
      // nested object ref and dynamic refs(refPath)
      replaceRefsInTreeSchema(data, treeSchema, collectionName, models, []);
      // Insert data into database here (should by pass hooks and validations)
      // Better use mongoDB insertMany here with ObjectIds casted
    }));

    await Promise.all(
      map(dataOfThisCollection, async (o) => await model.create(o))
    );
    const inserted = data[collectionName].length;
    console.log(`Inserted ${inserted} document${inserted === 1 ? '': 's'} into '${collectionName}'.`);
    delete data[collectionName];
  }));
  if (!isEmpty(keys(data))) {
    console.error(`[ERROR]: Unknown collection '${keys(data).join(', ')}'.`);
  }
  console.log("Seeded database 'interview'.");
};
