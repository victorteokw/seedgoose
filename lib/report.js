const chalk = require('chalk');

module.exports = ({
  action, collection, id, color, record, verbose, silent
}) => {
  if (silent) return;
  chalk.enabled = color;
  console.log(
    `${chalk.cyanBright(action)} ` +
    `${chalk.magentaBright.bold(id)} in ` +
    `${chalk.greenBright(collection)}` +
    (!verbose ? '' : ` ${JSON.stringify(record, null, 2)}`)
  );
};
