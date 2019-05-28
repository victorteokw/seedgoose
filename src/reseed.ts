import genericSeed from './genericSeed';
import SeedingCommand, { SeedingCommandType } from './SeedingCommand';

const reseed: SeedingCommand = async function (collectionName, records, mongoose, reporter) {
  await genericSeed(collectionName, records, mongoose, reporter, SeedingCommandType.RESEED);
}

export default reseed;
