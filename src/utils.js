"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCode = void 0;
function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) => 
    // eslint-disable-line
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}
exports.hashCode = hashCode;
