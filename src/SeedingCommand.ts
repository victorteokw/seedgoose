import { Mongoose } from 'mongoose';
import Reporter from './Reporter';

export interface Record {
  [key: string]: any
}

export type Records = Record[] | { [key: string]: Record };

export enum SeedingCommandType {
  SEED,
  RESEED,
  UNSEED
}

type SeedingCommand = (
  collectionName: string,
  records: Records,
  mongoose: Mongoose,
  reporter: Reporter
) => Promise<void>;

export default SeedingCommand;

export type GeneralSeedCommand = (
  collectionName: string,
  records: Records,
  mongoose: Mongoose,
  reporter: Reporter,
  command: SeedingCommandType
) => Promise<void>;
