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
/**
 * A PathFactory creates paths with default settings.
 */
class PathFactory {
    constructor(settings, data) {
        // Store settings and data
        this._settings = settings = { ...settings };
        this._data = data = { ...data };
        // Prepare the handlers
        const handlers = settings.handlers ?? defaultHandlers_1.default;
        for (const key in handlers)
            handlers[key] = toHandler(handlers[key]);
        for (const key of Object.getOwnPropertySymbols(handlers))
            handlers[key] = toHandler(handlers[key]);
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
