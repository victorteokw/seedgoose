const path = require('path');
const loadData = require('./tasks/loadData');
const loadModels = require('./tasks/loadModels');
const seed = require('./tasks/seed');
const withMongooseConnection = require('./withMongooseConnection');

module.exports = async function(options) {
  if (options.help || options.version) return;
  const modelsDir = path.join(process.cwd(), options.models);
  const dataDir = path.join(process.cwd(), options.data);
  const models = loadModels(modelsDir);
  const data = loadData(dataDir);
  await withMongooseConnection(options.mongourl, async () => {
    await seed(models, data);
  });
};
