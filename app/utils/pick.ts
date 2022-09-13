/**
 ** Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
// const pick = <T = Record<string, unknown>>(object: T, keys: string[]): T => {
//   return keys.reduce((obj: Record<string, unknown>, key:string) => {
//     if (object && Object.hasOwn(object, key)) {
//       obj[key] = (object as Record<string, unknown>)[key];
//     }
//     return obj as T;
//   }, {}) as T;
// };

function pick<T = Record<string, unknown>>(obj: T, keys: string[]): T {
  const ret = {};
  keys.forEach((key) => {
    if (obj && Object.hasOwn(obj as Record<string, unknown>, key)) {
      ret[key] = (obj as Record<string, unknown>)[key] as T;
    }
  });
  return ret as T;
}

// function pick2 <T extends object, K extends keyof T> (base: T, ...keys: K[]): Pick<T, K> {
//   const entries = keys.map(key => ([key, base[key]]));
//   return Object.fromEntries(entries);
// }

export default pick;
