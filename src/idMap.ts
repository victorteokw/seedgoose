import { Mongoose } from 'mongoose';

let savedMongoose: Mongoose | undefined;

let mappingTable: string = 'seedgoosemap';

export const idMapSetMongoose = (mongoose: Mongoose) => {
  savedMongoose = mongoose;
}

export const idMapSetMappingTable = (table: string) => {
  mappingTable = table;
}

export const getUniqId = async (collectionName: string, readableId: string): Promise<string> => {
  const db = (savedMongoose as Mongoose).connection.db;
  const collection = db.collection(mappingTable);
  const result = await collection.findOne({ collectionName, readableId });
  if (result) {
    return result._id;
  } else {
    const newRecord = await collection.insertOne({ collectionName, readableId });
    return newRecord.ops[0]._id;
  }
}
