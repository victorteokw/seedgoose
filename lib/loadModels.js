const map = require('lodash/map');
const glob = require('glob');
const { join } = require('path');

module.exports = function(modelDirectory) {
  return map(glob.sync(join(modelDirectory, '/**/*.js')), require);
};
