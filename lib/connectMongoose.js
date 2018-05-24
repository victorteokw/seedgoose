module.exports = async function(mongoose, url) {
  return await mongoose.connect(url);
};
