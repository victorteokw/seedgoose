module.exports = async function(mongoose, url, callback) {
  await mongoose.connect(url);
  await callback(mongoose);
  mongoose.connection.close();
};
