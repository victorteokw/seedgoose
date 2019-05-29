"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function displayHelp(stream = process.stdout) {
    const packageJson = require('../package.json');
    stream.write(packageJson.version + '\n');
}
exports.default = displayHelp;
