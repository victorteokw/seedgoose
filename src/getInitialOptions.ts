import { Options, parse } from 'type-args';
import optionDefs from './optionDefs';

function getInitialOptions(argv: string[] = process.argv): Options {
  return parse(argv, optionDefs)[0];
}

export default getInitialOptions;
