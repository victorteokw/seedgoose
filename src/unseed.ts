import genericSeed from './genericSeed';
import SeedingCommand, { SeedingCommandType } from './SeedingCommand';

const unseed: SeedingCommand = async function (collectionName, records, mongoose, reporter) {
  await genericSeed(collectionName, records, mongoose, reporter, SeedingCommandType.UNSEED);
}

export default unseed;
