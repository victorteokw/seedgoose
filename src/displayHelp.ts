import { Writable } from 'stream';
import { body, options, title } from 'type-args-usage';
import optionDefs from './optionDefs';

function displayHelp(stream: Writable = process.stdout) {
  const packageJson = require('../package.json');
  const t = title('Seedgoose ' + packageJson.version);
  const d = body(packageJson.description);
  const c = title('Commands');
  const cs = `  ${'seed'.padEnd(10)}seed and untouch existing records.\n  ${'reseed'.padEnd(10)}seed and update existing records.\n  ${'unseed'.padEnd(10)}remove seeded records.\n`;
  const ot = title('Options');
  const os = options(optionDefs);
  stream.write(t + d + c + cs + ot + os + '\n');
}

export default displayHelp;
