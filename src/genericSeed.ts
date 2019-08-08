import { Model, Mongoose } from 'mongoose';
import eachAsync from 'series-async-each';
import get from './get';
import { getUniqId } from './idMap';
import { GeneralSeedCommand, Record, SeedingCommandType } from './SeedingCommand';
import stringIsObjectId from './stringIsObjectId';

const shouldIgnoreItem = (item: any, key: string | number, mongoose: Mongoose) => {
  if (key === '_id') return true;
  if (key === 'id') return true;
  if (item instanceof mongoose.VirtualType) return true;
};

const transformRecord = async (record: any, schema: any, mongoose: Mongoose, root: Record) => {
  if (record === undefined) record = null;
  // this is a primitive type declared with mongoose primitive types
  if (schema.schemaName) {
    // ignore mongoose Schema primitive types for now
    // TODO: handle date casting here
    return record;
  }
  // schema object type
  if (schema instanceof mongoose.Schema) {
    const retval = {};
    await eachAsync((schema as any).tree, async (item, key) => {
      if (record && record[key]) {
        if (!shouldIgnoreItem(item, key, mongoose)) {
          retval[key] = await transformRecord(record[key], item, mongoose, root);
        }
      }
    });
    return retval;
  }
  // Array type
  if (Array.isArray(schema)) {
    if (record) {
      const retval: any[] = [];
      await eachAsync(record, async (recordItem) => {
        retval.push(await transformRecord(recordItem, schema[0], mongoose, root));
      });
      return retval;
    } else {
      return [];
    }
  }
  // Very primitive type declared with function constructor
  if (typeof schema === 'function') {
    // TODO: handle date casting here
    return record;
  }
  // Declared with an object
  if (typeof schema === 'object') {
    // Primitive type declared with type
    if (schema.type) {
      if ((schema.type === mongoose.Schema.Types.ObjectId) || (schema.type === mongoose.Types.ObjectId)) {
        if (stringIsObjectId(record)) return mongoose.Types.ObjectId(record);
        // Reference type
        if (schema.ref) {
          // Static type reference
          return await getUniqId(mongoose.model(schema.ref).collection.name, record);
        } else if (schema.refPath) {
          // Dynamic type reference
          return await getUniqId(mongoose.model(get(root, schema.refPath)).collection.name, record);
        } else {
          // Just ObjectId without references
          return mongoose.Types.ObjectId();
        }
      } else {
        // Primitive type
        // TODO: handle date casting here
        return record;
      }
    } else {
      // nested declared with object syntax
      const retval = {};
      await eachAsync(schema, async (item, key) => {
        if (record && record[key]) {
          if (!shouldIgnoreItem(item, key, mongoose)) {
            retval[key] = await transformRecord(record[key], item, mongoose, root);
          }
        }
      });
      return retval;
    }
  }
};

const genericSeed: GeneralSeedCommand = async function (
  collectionName, records, mongoose, reporter, command
) {
  reporter.startSeedCollection(collectionName);
  const model: Model<any> = Object.values(mongoose.models).find((m) => m.collection.name === collectionName) as Model<any>;
  await eachAsync(records, async (record, index) => {
    if (Array.isArray(records) && !record._id && !record.id) {
      throw new Error(`id not found for a record of \`${collectionName}'.`);
    }
    if (Array.isArray(records)) {
      if (!record._id) record._id = record.id;
    } else {
      record._id = index;
    }
    const nativeId = mongoose.Types.ObjectId(stringIsObjectId(record._id) ? record._id : await getUniqId(collectionName, record._id));
    const db = mongoose.connection.db;
    const dbCollection = db.collection(collectionName);
    if (command === SeedingCommandType.UNSEED) {
      const result = await dbCollection.deleteOne({ _id: nativeId });
      reporter.didHandleRecord(result.result.n === 0 ? 'unexist' : 'delete', collectionName, record._id);
      return;
    }
    const transformedRecord = await transformRecord(record, model.schema, model.base, record);

    if (command === SeedingCommandType.RESEED) {
      const result = await dbCollection.findOneAndUpdate(
        { _id: nativeId },
        { $set: transformedRecord },
        { upsert: true, returnOriginal: false }
      );
      const update = result.lastErrorObject.updatedExisting;
      reporter.didHandleRecord(update ? 'update' : 'create', collectionName, record._id);
      return;
    }
    if (command === SeedingCommandType.SEED) {
      const exist = await dbCollection.findOne({ _id: nativeId });
      if (exist) {
        reporter.didHandleRecord('untouch', collectionName, record._id);
      } else {
        const insertResult = (await dbCollection.insertOne(
          Object.assign(
            { _id: nativeId },
            transformedRecord
          )
        )).ops[0];
        reporter.didHandleRecord('create', collectionName, record._id);
        return;
      }
    }
  });
  reporter.endSeedCollection(collectionName);
}

export default genericSeed;
