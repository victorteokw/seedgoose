const { assert } = require('chai');
const path = require('path');
const seedgoose = require('../../index');
const { MongoClient } = require('mongodb');

let db, client;

const connectDb = (dbName) => async () => {
  const mongoClient = await MongoClient.connect(
    `mongodb://localhost:27017/${dbName}`,
    {
      useNewUrlParser: true
    }
  );
  client = mongoClient;
  db = client.db(dbName);
  await clearDatabase();
};

const clearDatabase = async () => {
  await db.dropDatabase();
};

const disconnectDb = async () => {
  await clearDatabase();
  await client.close();
};

before(connectDb('seedgoose-array-example'));
after(disconnectDb);
it('support data in format', async () => {
  await seedgoose(
    path.resolve(__dirname, '../../examples/array'),
    ['seed', '-S']
  );
  const collection = db.collection('products');
  assert.equal(
    await collection.countDocuments(),
    2,
    'number of records should be 2'
  );
  collection.find().forEach((doc) => {
    assert.include(
      ['Apple iPhone X', 'Apple iPhone Xs'],
      doc.name,
      'value should be one of them'
    );
  });
});
