const mongoose = require('mongoose');

module.exports = async function(url, callback) {
  await mongoose.connect(url);
  await callback(mongoose);
  mongoose.connection.close();
};
