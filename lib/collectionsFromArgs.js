"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const load_any_file_1 = require("load-any-file");
const path = require("path");
function collectionsFromArgs(dataDir, args, mongoose) {
    const modelList = Object.values(mongoose.models);
    if (args.length) {
        for (const arg of args) {
            if (!modelList.find((m) => m.collection.name === arg)) {
                throw new Error(`Collection named \`${arg}' not defined in models.`);
            }
            try {
                load_any_file_1.default.resolve(path.join(dataDir, arg));
            }
            catch (e) {
                throw new Error(`Collection named \`${arg}' doesn't have a data file.`);
            }
        }
        return args;
    }
    else {
        const allCollections = modelList.map((model) => model.collection.name);
        const files = fs.readdirSync(dataDir);
        const available = files.map((f) => path.parse(f).name);
        return allCollections.filter((c) => available.includes(c));
    }
}
exports.default = collectionsFromArgs;
