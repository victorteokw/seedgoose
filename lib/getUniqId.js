const mongoose = require('mongoose');

const getUniqId = async (collectionName, readableId, idTableName) => {
  const db = mongoose.connection.db;
  const collection = db.collection(idTableName);
  const result = await collection.findOne({ collectionName, readableId });
  if (result) {
    return result._id;
  } else {
    const result = await collection.insertOne({ collectionName, readableId });
    return result['ops'][0]._id;
  }
};

module.exports = getUniqId;
