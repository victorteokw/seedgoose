import chalk from 'chalk';
import { Writable } from 'stream';
import Report from '../Report';

function defaultReporter(report: Report, stream: Writable = process.stdout): void {
  if (report.silent) return;
  chalk.enabled = report.color;
  stream.write(
    `${chalk.cyanBright(report.action)} ` +
    `${chalk.magentaBright.bold(report.id)} in ` +
    `${chalk.greenBright(report.collection)}` +
    '\n'
  );
};

export default defaultReporter;
