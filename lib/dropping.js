const drop = require('./drop');
const connectMongoose = require('./connectMongoose');
const disconnectMongoose = require('./disconnectMongoose');
const mongoose = require('mongoose');

module.exports = async function(options) {
  if (options.help || options.version) return;
  await connectMongoose(mongoose, options.mongourl);
  await drop();
  disconnectMongoose(mongoose);
};
