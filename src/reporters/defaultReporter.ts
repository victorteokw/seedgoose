import chalk from 'chalk';
import StreamReporter from '../StreamReporter';

const collectionStartTimes = {};
const recordsCount = {};

const defaultReporter: StreamReporter = {
  colorOutput: true,
  stream: process.stdout,
  startSeedCollection(collectionName: string) {
    chalk.enabled = this.colorOutput;
    this.stream.write(
      '\n' + chalk.bold.underline(collectionName.toUpperCase() + ':') + '\n\n'
    );
    collectionStartTimes[collectionName] = Date.now();
    recordsCount[collectionName] = 0;
  },
  endSeedCollection(collectionName: string) {
    chalk.enabled = this.colorOutput;
    const ms = Date.now() - collectionStartTimes[collectionName];
    const num = recordsCount[collectionName];
    this.stream.write(
      `\n  done seeding ${num} records into \`${collectionName}' in ${ms}ms.\n`
    );
  },
  didHandleRecord(action: string, collectionName: string, id: string) {
    chalk.enabled = this.colorOutput;
    this.stream.write(
      '  ' +
      `${chalk.cyanBright(action)} ` +
      `${chalk.magentaBright.bold(id)} in ` +
      `${chalk.greenBright(collectionName)}` +
      '\n'
    );
    recordsCount[collectionName] = recordsCount[collectionName] + 1;
  }
};

export default defaultReporter;
