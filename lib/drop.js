const url = require('url');
const drop = require('./tasks/drop');
const withMongooseConnection = require('./withMongooseConnection');
const withProjectOptions = require('./withProjectOptions');

module.exports = async function(options) {
  if (options.help || options.version) return;
  options = withProjectOptions(options);
  await withMongooseConnection(options.mongourl, drop);
  const dbName = url.parse(options.mongourl).pathname.replace('/', '');
  console.log(`Dropped database '${dbName}'.`);
};
