#!/usr/bin/env node
const path = require('path');
const findDominantFile = require('find-dominant-file');
const loadConfig = require('./lib/loadConfig');
const showHelp = require('./lib/showHelp');
const showVersion = require('./lib/showVersion');
const getModelFileList = require('./lib/getModelFileList');
const seed = require('./lib/seed');
const reporter = require('./lib/report');

const startup = async function(cwd = process.cwd(), argv = process.argv) {

  // Locate project root directory
  const projRoot = findDominantFile(cwd, 'package.json', true);

  // Parsing and getting settings
  const [command, args, options] = loadConfig(projRoot, argv);

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

  // Check command availability
  if (!['seed', 'reseed', 'unseed'].includes(command)) {
    throw new Error(`Unknown command '${command}'.`);
  }

  // Requires data directory
  if (!options.data) {
    throw new Error('Data directory is required.');
  }
  options.data = path.resolve(projRoot, options.data);

  // Get model file list
  const modelFileList =
    getModelFileList(projRoot, options.models, options.modelBaseDirectory);

  // Connect mongoose
  const mongoose = require('mongoose');
  const connection = await mongoose.connect(options.db, {
    useNewUrlParser: true
  });

  try {
    // Load model files
    modelFileList.forEach(require);

    // Execute command
    await seed({
      report: reporter,
      args: args || [],
      options,
      command
    });
  } catch(e) {
    console.log(e);
  } finally { // Close connection and exit
    await connection.disconnect();
  }
};

if (require.main === module) {
  startup(process.cwd(), process.argv);
}

module.exports = startup;
