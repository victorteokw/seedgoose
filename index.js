const seeding = require('./lib/seeding.js');
const dropping = require('./lib/dropping.js');

const argv = require('yargs')
  .command('seed', 'Seed mongoDB with mongoose schema and seed data.',
    (yargs) => {
      yargs
        .option('models', {
          describe: 'Directory of mongoose model definitions',
          demand: true
        })
        .option('data', {
          describe: 'Directory of seed data',
          demand: true
        })
        .option('mongourl', {
          describe: 'URL of mongoDB instance',
          demand: true
        });
    }, seeding)
  .command('drop', 'Drop mongoDB database.', (yargs) => {
    yargs
      .option('mongourl', {
        describe: 'URL of mongoDB instance'
      });
  }, dropping)
  .argv;

module.exports = () => argv;
