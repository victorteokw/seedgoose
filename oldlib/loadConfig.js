const path = require('path');
const commandLineArgs = require('command-line-args');
const loadFile = require('load-any-file');
const commandLineOptions = require('./commandLineOptions');

const loadConfig = (projRoot, argv = process.argv) => {

  let command, args;
  const configFromArgv = commandLineArgs(commandLineOptions, {
    camelCase: true,
    partial: true,
    argv
  });
  if (configFromArgv._unknown) {
    [command, ...args] = configFromArgv._unknown;
    delete configFromArgv._unknown;
  }

  // Load config from package.json
  const pkgJson = path.join(projRoot, 'package.json');
  const configFromPkgJson = require(pkgJson).seedgoose;

  // Load config from config file
  let configFromConfFile;
  try {
    configFromConfFile =
      loadFile(path.join(projRoot, configFromArgv.configFile));
  } catch(e) {}

  return [command, args, Object.assign({},
    configFromPkgJson,
    configFromConfFile,
    configFromArgv
  )];
};

module.exports = loadConfig;
