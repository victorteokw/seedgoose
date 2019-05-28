import * as fs from 'fs';
import loadFile from 'load-any-file';
import { Mongoose } from 'mongoose';
import * as path from 'path';

function collectionsFromArgs(dataDir: string, args: string[], mongoose: Mongoose): string[] {
  const modelList = Object.values(mongoose.models);
  if (args.length) {
    for (const arg of args) {
      if (!modelList.find((m) => m.collection.name === arg)) {
        throw new Error(`Collection named \`${arg}' not defined in models.`);
      }
      try {
        loadFile.resolve(path.join(dataDir, arg));
      } catch (e) {
        throw new Error(`Collection named \`${arg}' doesn't have a data file.`);
      }
    }
    return args;
  } else {
    const allCollections = modelList.map((model) => model.collection.name);
    const files = fs.readdirSync(dataDir);
    const available = files.map((f) => path.parse(f).name);
    return allCollections.filter((c) => available.includes(c));
  }
}

export default collectionsFromArgs;
