const commandLineUsage = require('command-line-usage');
const commandLineOptions = require('./commandLineOptions');
const packageJson = require('../package.json');

module.exports = () => {
  const sections = [
    {
      header: `Seedgoose ${packageJson.version}`,
      content: packageJson.description
    },
    {
      header: 'Commands',
      content: [
        { name: 'seed', value: 'seed and untouch existing records' },
        { name: 'reseed', value: 'seed and update existing records' },
        { name: 'unseed', value: 'remove seeded records' },
      ]
    },
    {
      header: 'Options',
      optionList: commandLineOptions
    }
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
};
