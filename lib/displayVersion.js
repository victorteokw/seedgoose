"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function displayVersion(stream = process.stdout) {
    const packageJson = require('../package.json');
    stream.write(packageJson.version + '\n');
}
exports.default = displayVersion;
