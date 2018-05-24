const drop = require('./drop');
const withMongooseConnection = require('./withMongooseConnection');
const mongoose = require('mongoose');

module.exports = async function(options) {
  if (options.help || options.version) return;
  await withMongooseConnection(mongoose, options.mongourl, drop);
};
