"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResolver = exports.toHandler = void 0;
const PathProxy_1 = __importDefault(require("./PathProxy"));
const JSONLDResolver_1 = __importDefault(require("./JSONLDResolver"));
const defaultHandlers_1 = __importDefault(require("./defaultHandlers"));
const jsonld_context_parser_1 = require("jsonld-context-parser");
const data_model_1 = require("@rdfjs/data-model");
function mapObjects(object, map) {
    for (const key in object)
        object[key] = map(object[key]);
    for (const key of Object.getOwnPropertySymbols(object))
        // TODO: Fix this error caused by 'no implicit any' checks
        // @ts-ignore
        object[key] = map(object[key]);
    return object;
}
/**
 * A PathFactory creates paths with default settings.
 */
class PathFactory {
    constructor(settings, data) {
        // Store settings and data
        this._settings = settings = { ...settings };
        this._data = data = { ...data };
        // Prepare the handlers
        const handlers = mapObjects(settings.handlers ?? defaultHandlers_1.default ?? {}, toHandler);
        // Prepare the resolvers
        const resolvers = (settings.resolvers || []).map(toResolver);
        if (settings.context) {
            resolvers.push(new JSONLDResolver_1.default(settings.context));
            settings.parsedContext = new jsonld_context_parser_1.ContextParser().parse(settings.context)
                .then(context => context.getContextRaw());
        }
        else {
            settings.context = settings.parsedContext = {};
        }
        // Instantiate PathProxy that will create the paths
        this._pathProxy = new PathProxy_1.default({ handlers, resolvers });
        // Remove PathProxy settings from the settings object
        delete settings.handlers;
        delete settings.resolvers;
        // In some cases, such as when we call 'subjects' we
        // dont need to call the 'create' method first.
        // TODO: Add test for this
        // return this
        // interface P {
        //   [x: keyof handlers]
        // }
        return new Proxy(this, {
            get(target, prop, reciever) {
                return target[prop] ?? target.create({ subject: data_model_1.namedNode('') })[prop];
                return target.create(reciever);
                if (prop === 'create') {
                    return target.create;
                }
                else {
                    // TODO - do this in a less hacky way - ie remove unecessary 'requires root' errors elsewhere
                    return target.create({ subject: data_model_1.namedNode('') });
                }
            }
        });
    }
    /**
     * Creates a path with the given (optional) settings and data.
     */
    create(settings = {}, data) {
        // Apply defaults on settings and data
        return this._pathProxy.createPath(Object.assign(Object.create(null), this._settings, data ? settings : null), Object.assign(Object.create(null), this._data, data ?? settings));
    }
}
exports.default = PathFactory;
PathFactory.defaultHandlers = defaultHandlers_1.default;
/**
 * Converts a handler function into a handler object.
 */
function toHandler(handle) {
    return 'handle' in handle ? handle : { handle };
}
exports.toHandler = toHandler;
/**
 * Converts a resolver function into a catch-all resolver object.
 */
function toResolver(resolve) {
    return 'resolve' in resolve ? resolve : { supports, resolve };
}
exports.toResolver = toResolver;
// Catch-all resolvers support everything
function supports() {
    return true;
}
