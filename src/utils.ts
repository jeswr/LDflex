export function hashCode(str : string): number {
    return str.split('').reduce((prevHash, currVal) =>
      // eslint-disable-line
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}