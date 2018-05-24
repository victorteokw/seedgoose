const map = require('lodash/map');
const glob = require('glob');
const merge = require('lodash/merge');
const path = require('path');

module.exports = function(dataDirectory) {
  const jsonFiles = glob.sync(path.join(dataDirectory, '/**/*.json'));
  const jsFiles = glob.sync(path.join(dataDirectory, '/**/*.js'));
  const dataFiles = [...jsonFiles, ...jsFiles];
  return merge(...map(dataFiles, (file) => {
    const collectionName = path.parse(file).name;
    return { [collectionName]: require(file) };
  }));
};
