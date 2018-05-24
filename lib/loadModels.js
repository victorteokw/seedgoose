const map = require('lodash/map');
const glob = require('glob');
const path = require('path');

module.exports = function(modelDirectory) {
  return map(glob.sync(path.join(modelDirectory, '/**/*.js')), require);
};
