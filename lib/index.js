#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_dominant_file_1 = require("find-dominant-file");
const load_any_file_1 = require("load-any-file");
const path = require("path");
const collectionsFromArgs_1 = require("./collectionsFromArgs");
const displayHelp_1 = require("./displayHelp");
const displayVersion_1 = require("./displayVersion");
const getModelFiles_1 = require("./getModelFiles");
const idMap_1 = require("./idMap");
const loadConfig_1 = require("./loadConfig");
const reporters = require("./reporters");
const reseed_1 = require("./reseed");
const seed_1 = require("./seed");
const unseed_1 = require("./unseed");
function startup(cwd = process.cwd(), argv = process.argv) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find project root directory
        const projRoot = find_dominant_file_1.default(cwd, 'package.json', true);
        if (!projRoot) {
            throw new Error("Please run `seedgoose' inside your project directory.");
        }
        const [command, args, options] = loadConfig_1.default(projRoot, argv);
        // Show help and exit
        if (options.help) {
            displayHelp_1.default(process.stdout);
            return;
        }
        // Show version and exit
        if (options.version) {
            displayVersion_1.default(process.stdout);
            return;
        }
        // Check command availability
        if (!['seed', 'reseed', 'unseed'].includes(command)) {
            throw new Error(`Unknown seedgoose command \`${command}'.`);
        }
        // Requires data directory
        if (!options.data) {
            throw new Error('Please provide data directory.');
        }
        options.data = path.resolve(projRoot, options.data);
        // Load model files
        const modelFileList = getModelFiles_1.default(projRoot, options.models, options.modelBaseDirectory);
        modelFileList.forEach(require);
        // Connect mongoose
        const nodeModules = find_dominant_file_1.default(cwd, 'node_modules', false);
        if (nodeModules) {
            module.paths.push(nodeModules);
        }
        const mongoose = require('mongoose');
        const connection = yield mongoose.connect(options.db, {
            useNewUrlParser: true
        });
        idMap_1.idMapSetMongoose(mongoose);
        idMap_1.idMapSetMappingTable(options.mappingTable);
        const dataDir = path.join(projRoot, options.data);
        const reporter = reporters.default;
        const collections = collectionsFromArgs_1.default(dataDir, args, mongoose);
        try {
            // Execute command
            for (const collection of collections) {
                const records = load_any_file_1.default(path.join(dataDir, collection));
                switch (command) {
                    case 'seed':
                        yield seed_1.default(collection, records, mongoose, reporter);
                        break;
                    case 'reseed':
                        yield reseed_1.default(collection, records, mongoose, reporter);
                        break;
                    case 'unseed':
                        yield unseed_1.default(collection, records, mongoose, reporter);
                        break;
                }
            }
        }
        catch (e) {
            throw e;
        }
        finally {
            // Close connection and exit
            yield connection.disconnect();
        }
    });
}
;
if (require.main === module) {
    startup(process.cwd(), process.argv);
}
module.exports = startup;
