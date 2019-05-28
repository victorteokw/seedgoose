import genericSeed from './genericSeed';
import SeedingCommand, { SeedingCommandType } from './SeedingCommand';

const unseed: SeedingCommand = async function (collectionName, records, options, mongoose, reporter) {
  await genericSeed(collectionName, records, options, mongoose, reporter, SeedingCommandType.UNSEED);
}

export default unseed;
