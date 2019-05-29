import { OptionRules } from 'type-args';

const optionDefs:OptionRules = {
  'help': {
    alias: 'h',
    desc: 'view seedgoose\'s help',
    type: 'boolean',
    default: false
  },
  'version': {
    alias: 'v',
    desc: 'view seedgoose\'s version',
    type: 'boolean',
    default: false
  },
  'configFile': {
    alias: 'c',
    desc: 'the config file to load',
    type: 'string',
    default: '.seedgooserc'
  },
  'db': {
    alias: 'd',
    desc: 'the database connection url',
    type: 'string'
  },
  'models': {
    alias: 'm',
    desc: 'model files matcher',
    type: 'string'
  },
  'modelBaseDirectory': {
    alias: 'b',
    desc: 'where to execute model files matcher',
    type: 'string'
  },
  'data': {
    alias: 's',
    desc: 'data directory',
    type: 'string'
  },
  'mappingTable': {
    alias: 'T',
    desc: 'where to save readable id and actually id mapping',
    type: 'string',
    default: 'seedgoosemap'
  },
  'noColorOutput': {
    alias: 'C',
    desc: 'whether output with color',
    type: 'boolean',
    default: false
  },
 'verbose': {
    alias: 'V',
    desc: 'verbose output',
    type: 'boolean',
    default: false
  },
  'silent': {
    alias: 'S',
    desc: 'suppress output',
    type: 'boolean',
    default: false
  }
};

export default optionDefs;
