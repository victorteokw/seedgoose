const path = require('path');
const url = require('url');
const loadData = require('./tasks/loadData');
const loadModels = require('./tasks/loadModels');
const seed = require('./tasks/seed');
const withMongooseConnection = require('./withMongooseConnection');
const withProjectOptions = require('./withProjectOptions');

module.exports = async function(options) {
  if (options.help || options.version) return;
  options = withProjectOptions(options);
  const modelsDir = path.join(process.cwd(), options.models);
  const dataDir = path.join(process.cwd(), options.data);
  const models = loadModels(modelsDir);
  const data = loadData(dataDir);
  await withMongooseConnection(options.mongourl, async () => {
    await seed(models, data);
    const dbName = url.parse(options.mongourl).pathname.replace('/', '');
    console.log(`Seeded database '${dbName}'.`);
  });
};
