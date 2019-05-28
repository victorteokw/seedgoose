#!/usr/bin/env node
import * as path from 'path';
import findDominantFile from 'find-dominant-file';
import loadConfig from './loadConfig';
import displayVersion from './displayVersion';
import displayHelp from './displayHelp';

// const loadConfig = require('./lib/loadConfig');
// const showHelp = require('./lib/showHelp');
// const showVersion = require('./lib/showVersion');
// const getModelFileList = require('./lib/getModelFileList');
// const seed = require('./lib/seed');
// const reporter = require('./lib/report');

async function startup(cwd = process.cwd(), argv = process.argv) {

  // Locate project root directory
  const projRoot = findDominantFile(cwd, 'package.json', true);

  if (!projRoot) {
    throw new Error("Please run `seedgoose' inside your project directory.");
  }

  const nodeModules = findDominantFile(cwd, 'node_modules', false);
  if (nodeModules) {
    module.paths.push(nodeModules);
  }

  // Parsing and getting settings
  const [command, args, options] = loadConfig(projRoot, argv);

  // Show help and exit
  if (options.help) {
    dislayHelp(process.stdout);
    return;
  }

  // Show version and exit
  if (options.version) {
    displayVersion(process.stdout);
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
      mongoose,
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
