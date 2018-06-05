const fs = require('fs');
const path = require('path');
const find = require('lodash/find');
const assign = require('lodash/assign');
const map = require('lodash/map');
const findDominantFile = require('./functions/findDominantFile');

const configFiles = [
  '.nonularc',
  '.nonularc.js',
  '.nonularc.json',
  'nonula.config.js',
  'nonula.config.json'
];

module.exports = function(options) {
  const cwd = process.cwd();
  const projRoot = findDominantFile(cwd, 'package.json', true);
  const confFile =
    find(map(configFiles, (c) => path.join(projRoot, c)), fs.existsSync);
  return confFile ? assign(require(confFile), options) : options;
};
