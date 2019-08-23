import { assert } from "chai";
import { Db, MongoClient, ObjectId } from "mongodb";
import * as path from "path";
import seedgoose from "../../src";

let db: Db;
let client: MongoClient;

const connectDb = (dbName: string) => async () => {
	const mongoClient = await MongoClient.connect(`mongodb://localhost:27017/${dbName}`, {
		useNewUrlParser: true
	});
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

before(connectDb("seedgoose-subdocument-example"));
after(disconnectDb);

it("support subdocument data format", async () => {
	await seedgoose(path.resolve(__dirname), ["seed", "-S"]);
	const posts = db.collection("posts");
	const comments = db.collection("comments");

	assert.equal(await posts.countDocuments(), 2, "number of records should be 2");
	assert.equal(await comments.countDocuments(), 2, "number of records should be 2");

	comments.find().forEach(async doc => {
		if (doc.for && doc.for.article) {
   //! Article is being assigned a non-existant post ID     
			assert.include(await posts.find().toArray().then(docs => docs.map(doc => doc._id)), doc.for.article, 'ref should be a valid post id');
		}
		assert.include(["First Comment", "Second Comment"], doc.name, "value should be one of them");
	});

	posts.find().forEach(doc => {
		assert.include(["First Post", "Second Post"], doc.name, "value should be one of them");
	});
});
