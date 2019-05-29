import { Mongoose } from 'mongoose';
import Reporter from './Reporter';
export interface Record {
    [key: string]: any;
}
export declare type Records = Record[] | {
    [key: string]: Record;
};
export declare enum SeedingCommandType {
    SEED = 0,
    RESEED = 1,
    UNSEED = 2
}
declare type SeedingCommand = (collectionName: string, records: Records, mongoose: Mongoose, reporter: Reporter) => Promise<void>;
export default SeedingCommand;
export declare type GeneralSeedCommand = (collectionName: string, records: Records, mongoose: Mongoose, reporter: Reporter, command: SeedingCommandType) => Promise<void>;
