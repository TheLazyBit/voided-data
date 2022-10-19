import { cyrb53 } from '../math/hash';

type HashableObject = {
  [key: string]: Hashable
};
type HasNativeHashablility = null | string | number | bigint | undefined | boolean;
export type Hashable = HashableObject | HasNativeHashablility | Hashable[];
const hash = (hashable: Hashable, seed = 0): number => {
  const _hash = cyrb53(seed);
  if (hashable === null) return 17;
  if (hashable === undefined) return 31;
  if (typeof hashable === 'string') return _hash(hashable);
  if (typeof hashable === 'bigint' || typeof hashable === 'number') return _hash(`${hashable}`);
  if (typeof hashable === 'boolean') return _hash(`${+hashable}`); // +true = 1; +false = 0;

  if (Array.isArray(hashable)) {
    return hashable.reduce((agr: number, next) => 17 * agr + hash(next, _hash(`${seed}`)), 17);
  }

  const values = Object.entries(hashable);
  values.sort(([l], [r]) => l.localeCompare(r));

  return values.reduce((agr: number, [,v]) => 17 * agr + hash(v, _hash(`${seed}`)), 17);
};

export default hash;
