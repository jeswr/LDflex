import JSONLDResolver from '../src/JSONLDResolver';

export interface Resolver {
  supports(...args: any[]): boolean;
  resolve: JSONLDResolver['resolve'];
}
