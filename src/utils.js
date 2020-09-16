"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xprods = exports.asArray = exports.hashCode = void 0;
const R = __importStar(require("ramda"));
function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) => 
    // eslint-disable-line
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}
exports.hashCode = hashCode;
function asArray(obj) {
    return Array.isArray(obj) ? obj : [obj];
}
exports.asArray = asArray;
/**
 * Take the n-ary cross product of each arguement
 * If an arguement is not an array it is converted
 * to an array with a single element to begin.
 */
function xprods(...args) {
    return args.reduce((t, x) => R.xprod(t, asArray(x)).map(a => a.flat()));
}
exports.xprods = xprods;
