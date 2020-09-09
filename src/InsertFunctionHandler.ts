import MutationFunctionHandler from './MutationFunctionHandler';
import { mutation } from '../types/mutation';

/**
 * A MutationFunctionHandler for insertions.
 */
export default class InsertFunctionHandler extends MutationFunctionHandler {
  constructor() {
    super(mutation.INSERT, false);
  }
}
