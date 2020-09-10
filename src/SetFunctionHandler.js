"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MutationFunctionHandler_1 = __importDefault(require("./MutationFunctionHandler"));
const valueUtils_1 = require("./valueUtils");
/**
 * Returns a function that deletes all existing values
 * for the path, and then adds the given values to the path.
 *
 * Requires:
 * - a delete function on the path proxy.
 * - an add function on the path proxy.
 */
class SetFunctionHandler extends MutationFunctionHandler_1.default {
    handle(pathData, path) {
        return (...args) => {
            // First, delete all existing values for the property/properties
            const deletePath = !valueUtils_1.hasPlainObjectArgs(args) ?
                // When a single property is given, delete all of its values
                path.delete() :
                // When a map of properties is given, delete all of their values
                Object.keys(args[0]).reduce((previousPath, property) => previousPath.delete({ [property]: [] }), path);
            // Next, insert the new values
            return deletePath.add(...args);
        };
    }
}
exports.default = SetFunctionHandler;
