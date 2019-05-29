"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringIsObjectId(str) {
    return /^[0-9a-f]{24}$/.test(str);
}
exports.default = stringIsObjectId;
