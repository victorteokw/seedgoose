import { Writable } from 'stream';

function displayVersion(stream: Writable = process.stdout) {
  const packageJson = require('../package.json');
  stream.write(packageJson.version + '\n');
}

export default displayVersion;
