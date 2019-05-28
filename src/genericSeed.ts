import { Model, Types } from 'mongoose';
const { ObjectId } = Types;
import eachAsync from 'series-async-each';
import { getUniqId } from './idMap';
import { GeneralSeedCommand, SeedingCommandType } from './SeedingCommand';
import stringIsObjectId from './stringIsObjectId';

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
      record._id = record.id;
    } else {
      record._id = index;
    }
    const nativeId = ObjectId(stringIsObjectId(record._id) ? record._id : await getUniqId(collectionName, record._id));
    const db = mongoose.connection.db;
    const dbCollection = db.collection(collectionName);
    if (command === SeedingCommandType.UNSEED) {
      const result = await dbCollection.deleteOne({ _id: nativeId });
      reporter.didHandleRecord(result.result.n === 0 ? 'unexist' : 'delete', collectionName, record._id);
      return;
    }

  });
  reporter.endSeedCollection(collectionName);
}

export default genericSeed;
