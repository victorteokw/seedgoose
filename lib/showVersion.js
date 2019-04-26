const packageJson = require('../package.json');

module.exports = () => {
  console.log(`${packageJson.version}`);
};
