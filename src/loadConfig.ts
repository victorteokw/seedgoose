import loadFile from 'load-any-file';
import * as path from 'path';
import { Options, parse } from 'type-args';
import optionDefs from './optionDefs';

function loadConfig(projRoot: string, argv: string[] = process.argv):
[string, string[], Options] {

  const confFileName: string = parse(argv, {
    'configFile': {
      alias: 'c',
      desc: 'the config file to load',
      type: 'string',
      default: '.seedgooserc'
    }
  })[0].configFile as string;

  // Load config from package.json
  const pkgJson = path.join(projRoot, 'package.json');
  const configFromPkgJson = require(pkgJson).seedgoose;

  // Load config from config file
  let configFromConfFile;
  try {
    configFromConfFile = loadFile(path.join(projRoot, confFileName));
  } catch (e) {
    configFromConfFile = {};
  }

  const [options, [command, ...args]] = parse(
    argv, optionDefs, configFromPkgJson, configFromConfFile
  );

  return [command, args, options];
}

export default loadConfig;
