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
 const productposts = db.collection("productposts");
 const blogposts = db.collection("blogposts");
	const comments = db.collection("comments");

 assert.equal(await productposts.countDocuments(), 1, "number of records should be 1");
 assert.equal(await blogposts.countDocuments(), 1, "number of records should be 1");
 assert.equal(await comments.countDocuments(), 2, "number of records should be 2");

 const allProductPosts = await productposts.find().toArray()
 const allBlogPosts = await blogposts.find().toArray()
 const allComments = await comments.find().toArray()

 allComments.forEach(comment => {
  assert.include([allProductPosts[0]._id, allBlogPosts[0]._id], comment.postLink.linkedTo)
 })
});
