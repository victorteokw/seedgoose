const stringIsObjectId = require('./stringIsObjectId');

const allCollections = (mongoose) => {
  return mongoose.models.map((model) => model.collection.name);
};

const seed = ({ mongoose, report, args, options }) => {
  const collections = args.length ? args : allCollections(mongoose);
  
};

module.exports = seed;
