import { Writable } from 'stream';

function displayHelp(stream: Writable = process.stdout) {
  const packageJson = require('../package.json');
  stream.write(packageJson.version + '\n');
}

export default displayHelp;
