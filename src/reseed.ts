import genericSeed from './genericSeed';
import SeedingCommand, { SeedingCommandType } from './SeedingCommand';

const reseed: SeedingCommand = async function (collectionName, records, options, mongoose, reporter) {
  await genericSeed(collectionName, records, options, mongoose, reporter, SeedingCommandType.RESEED);
}

export default reseed;
