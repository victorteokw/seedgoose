module.exports = async function(mongoose) {
  await mongoose.connection.db.dropDatabase();
  console.log("Dropped database.");
};
