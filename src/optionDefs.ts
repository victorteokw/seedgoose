import { OptionRules } from 'type-args';

const optionDefs: OptionRules = {
  'help': {
    alias: 'h',
    desc: "view seedgoose's help.",
    type: 'boolean'
  },
  'version': {
    alias: 'v',
    desc: "view seedgoose's version.",
    type: 'boolean'
  },
  'configFile': {
    alias: 'c',
    desc: 'the config file to load.',
    type: 'string',
    default: '.seedgooserc'
  },
  'db': {
    alias: 'd',
    desc: 'the database connection url.',
    type: 'string'
  },
  'models': {
    alias: 'm',
    desc: 'model files matcher.',
    type: 'string'
  },
  'modelBaseDirectory': {
    alias: 'b',
    desc: 'where to execute model files matcher.',
    type: 'string'
  },
  'data': {
    alias: 's',
    desc: 'the data directory where data files are located.',
    type: 'string'
  },
  'mappingTable': {
    alias: 'T',
    desc: 'where to save readable id and actual id mapping.',
    type: 'string',
    default: 'seedgoosemap'
  },
  'color': {
    alias: 'C',
    desc: 'whether use color output.',
    type: 'boolean',
    default: true
  },
 'verbose': {
    alias: 'V',
    desc: 'whether verbose output.',
    type: 'boolean'
  },
  'silent': {
    alias: 'S',
    desc: 'whether suppress output.',
    type: 'boolean'
  }
};

export default optionDefs;
