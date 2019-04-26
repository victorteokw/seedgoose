const seed = require('./lib/seed');
const drop = require('./lib/drop');
const withProjectOptions = require('./lib/withProjectOptions');

const argv = require('yargs')
  .pkgConf('seedgoose')
  .config(withProjectOptions({}))
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
    }, seed)
  .command('drop', 'Drop mongoDB database.', (yargs) => {
    yargs
      .option('mongourl', {
        describe: 'URL of mongoDB instance'
      });
  }, drop)
  .help('help')
  .alias('s', 'seed')
  .alias('d', 'drop')
  .argv;

module.exports = () => argv;
