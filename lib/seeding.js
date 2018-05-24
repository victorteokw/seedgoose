const path = require('path');
const loadData = require('./loadData');
const loadModels = require('./loadModels');
const seed = require('./seed');
const connectMongoose = require('./connectMongoose');
const disconnectMongoose = require('./disconnectMongoose');

module.exports = async function(options) {
  if (options.help || options.version) return;
  const modelsDir = path.join(process.cwd(), options.models);
  const dataDir = path.join(process.cwd(), options.data);
  const models = loadModels(modelsDir);
  const data = loadData(dataDir);
  const mongoose = models[0].base; // different instances of mongoose
  await connectMongoose(mongoose, options.mongourl);
  await seed(mongoose, models, data);
  await 520;
  disconnectMongoose(mongoose);
};
