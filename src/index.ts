#!/usr/bin/env node
import findDominantFile from 'find-dominant-file';
import * as path from 'path';
import displayHelp from './displayHelp';
import displayVersion from './displayVersion';
import getModelFiles from './getModelFiles';
import loadConfig from './loadConfig';
import * as reporters from './reporters';

async function startup(cwd: string = process.cwd(), argv: string[] = process.argv): Promise<void> {

  // Find project root directory
  const projRoot = findDominantFile(cwd, 'package.json', true);
  if (!projRoot) {
    throw new Error("Please run `seedgoose' inside your project directory.");
  }

  const [command, args, options] = loadConfig(projRoot, argv);

  // Show help and exit
  if (options.help) {
    displayHelp(process.stdout);
    return;
  }

  // Show version and exit
  if (options.version) {
    displayVersion(process.stdout);
    return;
  }

  // Check command availability
  if (!['seed', 'reseed', 'unseed'].includes(command)) {
    throw new Error(`Unknown seedgoose command \`${command}'.`);
  }

  // Requires data directory
  if (!options.data) {
    throw new Error('Please provide data directory.');
  }
  options.data = path.resolve(projRoot, options.data);

  // Load model files
  const modelFileList = getModelFiles(projRoot, options.models, options.modelBaseDirectory);
  modelFileList.forEach(require);

  // Connect mongoose
  const nodeModules = findDominantFile(cwd, 'node_modules', false);
  if (nodeModules) {
    module.paths.push(nodeModules);
  }
  const mongoose = require('mongoose');
  const connection = await mongoose.connect(options.db, {
    useNewUrlParser: true
  });

  const reporter = reporters.default;
  const collections = args;

  try {
    // Execute command
    switch (command) {
      case 'seed':
      await seed(collections, options, mongoose, reporter);
      break;
      case 'reseed':
      await reseed(collections, options, mongoose, reporter);
      break;
      case 'unseed':
      await unseed(collections, options, mongoose, reporter);
      break;
    }

  } catch(e) {
    throw e;
  } finally {
    // Close connection and exit
    await connection.disconnect();
  }
};

if (require.main === module) {
  startup(process.cwd(), process.argv);
}

module.exports = startup;
