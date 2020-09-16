import { Data } from '../types';
export default class PropertiesHandler {
    handle(pathData: Data, path: any): {
        [Symbol.asyncIterator](): any;
        readonly then: (onResolved: any, onRejected: any) => any;
        catch(onRejected: any): any;
        finally(callback: any): any;
    };
    _handle(pathData: Data, path: any): AsyncGenerator<string, void, unknown>;
}
