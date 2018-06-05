const url = require('url');
const drop = require('./tasks/drop');
const withMongooseConnection = require('./withMongooseConnection');

module.exports = async function(options) {
  if (options.help || options.version) return;
  await withMongooseConnection(options.mongourl, drop);
  const dbName =  url.parse(options.mongourl).pathname.replace('/', '');
  console.log(`Dropped database ${dbName}.`);
};
