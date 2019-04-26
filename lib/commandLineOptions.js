module.exports = [
  {
    name: 'help',
    alias: 'h',
    description: 'view seedgoose\'s help',
    type: Boolean,
    defaultValue: false
  },
  {
    name: 'version',
    alias: 'v',
    description: 'view seedgoose\'s version',
    type: Boolean,
    defaultValue: false
  },
  {
    name: 'config-file',
    alias: 'c',
    description: 'the config file to load',
    type: String,
    defaultValue: '.seedgooserc'
  },
  {
    name: 'db',
    alias: 'd',
    description: 'the database connection url',
    type: String,
    defaultValue: undefined
  },
  {
    name: 'models',
    alias: 'm',
    description: 'model files matcher',
    type: String,
    defaultValue: undefined
  },
  {
    name: 'model-base-directory',
    alias: 'b',
    description: 'where to execute model files matcher',
    type: String,
    defaultValue: ''
  }
];
