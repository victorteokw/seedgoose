/// <reference types="mongoose" />
export declare const idMapSetMongoose: (mongoose: typeof import("mongoose")) => void;
export declare const idMapSetMappingTable: (table: string) => void;
export declare const getUniqId: (collectionName: string, readableId: string) => Promise<string>;
