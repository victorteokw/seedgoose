import genericSeed from './genericSeed';
import SeedingCommand, { SeedingCommandType } from './SeedingCommand';

const seed: SeedingCommand = async function (collectionName, records, options, mongoose, reporter) {
  await genericSeed(collectionName, records, options, mongoose, reporter, SeedingCommandType.SEED);
}

export default seed;
