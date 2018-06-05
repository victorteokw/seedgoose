const fs = require('fs');
const path = require('path');
const find = require('lodash/find');
const assign = require('lodash/assign');

const findDominantFile = require('./functions/findDominantFile');

const configFiles = ['nonula.config.js', 'nonula.config.json'];

module.exports = function(options) {
  const cwd = process.cwd();
  const projRoot = findDominantFile(cwd, 'package.json', true);
  const confFile =
    find(configFiles, (c) => fs.existsSync(path.join(projRoot, c)));
  return confFile ? assign(require(confFile), options) : options;
};
