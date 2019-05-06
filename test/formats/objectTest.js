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

before(connectDb('seedgoose-object-example'));
after(disconnectDb);
it('support data in format', async () => {
  await seedgoose(
    path.resolve(__dirname, '../../examples/object'),
    ['seed', '-S']
  );
  const collection = db.collection('platforms');
  assert.equal(
    await collection.countDocuments(),
    2,
    'number of records should be 2'
  );
  collection.find().forEach((doc) => {
    assert.include(
      ['Windows 10', 'macOS Mojave'],
      doc.name,
      'value should be one of them'
    );
  });
});
