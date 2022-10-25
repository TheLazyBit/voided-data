import { Hashable } from '../../objects/hash';
import { Equalable } from '../../objects/equals';
import { createHashTable } from './map';

/**
 * A Set:
 *  Is a lookup structure to determine if an entry already exists or not.
 *
 * @startuml
 * title VNSet
 * interface VNSet<Key> {
 *   size(): Int
 *   has(key: Key): Boolean,
 *   add(key: Key): Unit
 *   remove(key: Key): Unit
 *   map<T>(m: (k: Key) => T): VNSet<T>
 *   intersect(other: VNSet<Key>): VNSet<Key>
 *   union(other: VNSet<Key>): VNSet<Key>
 *   disjunction(other: VNSet<Key>): VNSet<Key>
 * }
 * @enduml
 */
interface VNSet<Key extends Hashable & Equalable> {
  size(): number;
  has(key: Key): boolean;
  add(key: Key): void;
  remove(key: Key): void;
  map<T extends Hashable & Equalable>(mapper: (key: Key) => T): VNSet<T>;
  iter(): Key[];
  union(other: VNSet<Key>): VNSet<Key>;
  intersection(other: VNSet<Key>): VNSet<Key>;
  disjunction(other: VNSet<Key>): VNSet<Key>;
}

export function createHashSet<Key extends Equalable & Hashable>(): VNSet<Key> {
  const map = createHashTable<Key, null>();

  const iter = () => map.iter().map(([k]) => k);
  const has = (key: Key): boolean => {
    return map.get(key).match(
      () => true,
      () => false,
    );
  };

  return {
    size(): number {
      return map.size();
    },
    add(key: Key) {
      map.set(key, null);
    },
    has,
    remove(key: Key) {
      map.unset(key);
    },
    map<NewKey extends Hashable & Equalable>(mapper: (key: Key) => NewKey): VNSet<NewKey> {
      const set = createHashSet<NewKey>();
      map.iter().forEach(([k]) => set.add(mapper(k)));
      return set;
    },
    iter,
    union(other: VNSet<Key>): VNSet<Key> {
      const set = createHashSet<Key>();
      iter().forEach((k) => set.add(k));
      other.iter().forEach((k) => set.add(k));
      return set;
    },
    intersection(other: VNSet<Key>): VNSet<Key> {
      const set = createHashSet<Key>();
      iter().forEach((k) => {
        if (other.has(k)) set.add(k);
      });
      return set;
    },
    disjunction(other: VNSet<Key>): VNSet<Key> {
      const set = createHashSet<Key>();
      iter().forEach((k) => {
        if (!other.has(k)) set.add(k);
      });
      other.iter().forEach((k) => {
        if (!has(k)) set.add(k);
      });
      return set;
    },
  };
}
