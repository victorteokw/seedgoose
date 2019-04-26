#!/usr/bin/env node
const findDominantFile = require('find-dominant-file');
const loadConfig = require('./lib/loadConfig');
const showHelp = require('./lib/showHelp');
const showVersion = require('./lib/showVersion');

const startup = async function() {

  // Locate project root directory
  const projRoot = findDominantFile(process.cwd(), 'package.json', true);

  // Get config object
  const [command, args, options] = loadConfig(projRoot);

  // Show help and exit
  if (options.help) {
    showHelp();
    return;
  }

  // Show version and exit
  if (options.version) {
    showVersion();
    return;
  }

};

if (require.main === module) {
  startup();
}

module.exports = startup;
