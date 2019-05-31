import loadFile from 'load-any-file';
import * as path from 'path';
import { parse } from 'type-args';
import optionDefs from './optionDefs';

function loadConfig(
  projRoot: string,
  argv: string[] = process.argv
): [string, string[], { [key: string]: any }] {
  const [options, [command, ...args]] = parse(argv, optionDefs);

  // Load config from package.json
  const pkgJson = path.join(projRoot, 'package.json');
  const configFromPkgJson = require(pkgJson).seedgoose;

  // Load config from config file
  let configFromConfFile;
  try {
    configFromConfFile = loadFile(
      path.join(projRoot, options.configFile as string)
    );
  } catch (e) {
    // ignore this
  }

  return [
    command,
    args,
    {
      ...configFromPkgJson,
      ...configFromConfFile,
      ...options
    }
  ];
}

export default loadConfig;
