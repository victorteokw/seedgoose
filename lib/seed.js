const mongoose = require('mongoose');
const map = require('lodash/map');
const each = require('lodash/each');
const set = require('lodash/set');
const get = require('lodash/get');
const isObject = require('lodash/isObject');
const isFunction = require('lodash/isFunction');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const stringIsObjectId = require('./stringIsObjectId');

const {ObjectId} = mongoose.Types;

const savedReferences = {};

const replaceRefsInTreeSchema = async function(data, treeSchema, collectionName, models, savedPath) {
  map(treeSchema, (schemaItem, key) => {
    // Ignore _id field
    if (key === '_id') return;
    // Ignore virtual types
    if (schemaItem instanceof mongoose.VirtualType) return;
    // ignore mongoose Schema primitive types
    if (schemaItem.schemaName) return;
    // subschema
    if (schemaItem instanceof mongoose.Schema) {
      replaceRefsInTreeSchema(data, schemaItem.tree, collectionName, models, [...savedPath, key]);
    } else if (isPlainObject(schemaItem)) {
      if ((schemaItem.type === mongoose.Schema.Types.ObjectId) ||
        (schemaItem.type === mongoose.Types.ObjectId)) {
        // Direct ref definition
        let refCollectionName = schemaItem.ref;
        const refPath = schemaItem.refPath;
        if (refPath) {
          refCollectionName = get(data, refPath);
        }
        if (refCollectionName) {
          savedReferences[refCollectionName] || (savedReferences[refCollectionName] = {});
          const value = get(data, [...savedPath, key]);
          if (value && !stringIsObjectId(value)) {
            if (!savedReferences[refCollectionName][value]) {
              savedReferences[refCollectionName][value] = ObjectId();
            }
            set(data, [...savedPath, key], savedReferences[refCollectionName][value]);
          }
        }
      } else {
        // Nested objects
        replaceRefsInTreeSchema(data, schemaItem, collectionName, models, [...savedPath, key]);
      }
    // array
  } else if (isArray(schemaItem)) {
      const valueOfArray = get(data, [...savedPath, key]);
      if (valueOfArray && isArray(valueOfArray)) {
        map(valueOfArray, (v, i) => {
          replaceRefsInTreeSchema(data, schemaItem[0], collectionName, models, [...savedPath, i]);
        });
      }
    }
    // Ignore primitive types
  });
};

// options: dry run, inspect, idKey = '_id'
module.exports = async function(models, data, options) {
  await Promise.all(map(models, async (model) => {
    const collectionName = model.collection.name;
    let dataOfThisCollection = data[collectionName];
    if (!dataOfThisCollection) return;
    // Create references table for this collection if needed.
    savedReferences[collectionName] || (savedReferences[collectionName] = {});
    // We can accept dynamic data generated from functions
    // Most of times, user is using faker
    if (typeof dataOfThisCollection === 'function') {
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
          savedReferences[collectionName][data._id] = ObjectId();
        }
        // Assign the generated _id
        data._id = savedReferences[collectionName][data._id];
      }
      // Looping schema to find references to other tables
      const treeSchema = model.schema.tree;
      // Should handle simple ref, array ref, nested object ref and dynamic refs(refPath)
      replaceRefsInTreeSchema(data, treeSchema, collectionName, models, '');

      // Insert data into database here (should by pass hooks and validations)
      // Better use mongoDB insertMany here with ObjectIds casted
    }));

    delete data[collectionName];
  }));
};
