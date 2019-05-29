"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const collectionStartTimes = {};
const recordsCount = {};
const defaultReporter = {
    colorOutput: true,
    stream: process.stdout,
    startSeedCollection(collectionName) {
        chalk_1.default.enabled = this.colorOutput;
        this.stream.write('\n' + chalk_1.default.bold.underline(collectionName.toUpperCase() + ':') + '\n');
        collectionStartTimes[collectionName] = Date.now();
        recordsCount[collectionName] = 0;
    },
    endSeedCollection(collectionName) {
        chalk_1.default.enabled = this.colorOutput;
        const ms = Date.now() - collectionStartTimes[collectionName];
        const num = recordsCount[collectionName];
        this.stream.write(`\n  done seeding ${num} records \`${collectionName}' in ${ms}ms.\n`);
    },
    didHandleRecord(action, collectionName, id) {
        chalk_1.default.enabled = this.colorOutput;
        this.stream.write(`${chalk_1.default.cyanBright(action)} ` +
            `${chalk_1.default.magentaBright.bold(id)} in ` +
            `${chalk_1.default.greenBright(collectionName)}` +
            '\n');
        recordsCount[collectionName] = recordsCount[collectionName] + 1;
    }
};
exports.default = defaultReporter;
