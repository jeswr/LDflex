
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const MutationFunctionHandler_1 = __importDefault(require('./MutationFunctionHandler'));
const mutation_1 = require('../types/mutation');

/**
 * A MutationFunctionHandler for deletions.
 */
class DeleteFunctionHandler extends MutationFunctionHandler_1.default {
  constructor() {
    super(mutation_1.mutation.DELETE, true);
  }
}
exports.default = DeleteFunctionHandler;
