import MutationFunctionHandler from './MutationFunctionHandler';
import { mutation } from '../types/mutation';

/**
 * A MutationFunctionHandler for deletions.
 */
export default class DeleteFunctionHandler extends MutationFunctionHandler {
  constructor() {
    super(mutation.DELETE, true);
  }
}
