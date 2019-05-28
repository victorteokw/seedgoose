import genericSeed from './genericSeed';
import SeedingCommand, { SeedingCommandType } from './SeedingCommand';

const seed: SeedingCommand = async function (collectionName, records, mongoose, reporter) {
  await genericSeed(collectionName, records, mongoose, reporter, SeedingCommandType.SEED);
}

export default seed;
