import { Maybe, none, some } from '../../monads/maybe';
import hash, { Hashable } from '../../objects/hash';
import equals, { Equalable } from '../../objects/equals';

/**
 * A Map:
 *  Is a lookup table with constant access behavior.
 *  In the case of a HashMap or HashTable,
 *  this is achieved by storing the value key pairs in arrays as "buckets"
 *  using their hash values
 *  (a good hashing function will distribute the keys evenly)
 *
 *
 * @startuml
 * title VNMap
 * interface VNMap<Key, Value> {
 *   size(): Int
 *   get(key: Key): Maybe<Value>
 *   set(key: Key, value: Value): Unit
 *   unset(key: Key): Unit
 *   toString(): string
 * }
 * @enduml
 */
export interface VNMap<Key extends Hashable & Equalable, Value> {
  get(key: Key): Maybe<Value>;

  set(key: Key, value: Value): void;

  map<NewKey extends Hashable & Equalable, NewValue>(
    mapper: (pair: [Key, Value]) => [NewKey, NewValue]
  ): VNMap<NewKey, NewValue>;

  iter(): [Key, Value][];

  unset(key: Key): void;

  size(): number;

  toString(): string;
}

const MIN_LOAD = 0.25;
const MAX_LOAD = 1;
const EXPANSION_FACTOR = 2;
const CONTRACTION_FACTOR = 0.5;
const MIN_CAPACITY = 32;

export function createHashTable<Key extends Hashable & Equalable, Value>(): VNMap<Key, Value> {
  type KeyValuePair = [Key, Value];
  type Bucket = KeyValuePair[];
  let size = 0;
  let capacity = MIN_CAPACITY;
  let buckets: Bucket[] = new Array(capacity).fill(null).map(() => []);

  const iter = () => buckets.flatMap((bucket) => bucket.map(([k,v]) => [k,v] as KeyValuePair));

  const load = () => size / capacity;

  const _set = (key: Key, value: Value): boolean => {
    const _hash = hash(key) % capacity;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const _bucket = buckets[_hash]!;
    const pair = _bucket.find(([k]) => equals(k, key));
    if (!pair) {
      _bucket.push([key, value]);
      return true;
    }
    pair[1] = value;
    return false;
  };

  const resize = () => {
    const _load = load();
    let newCapacity = capacity;
    if (_load < MIN_LOAD) {
      newCapacity = Math.max(capacity * CONTRACTION_FACTOR, MIN_CAPACITY);
    }
    if (_load > MAX_LOAD) {
      newCapacity = capacity * EXPANSION_FACTOR;
    }
    if (newCapacity !== capacity) {
      capacity = newCapacity;
      const oldBuckets = buckets;
      buckets = new Array(capacity).fill(null).map(() => []);
      oldBuckets.forEach((bucket) => bucket.forEach(([k, v]) => _set(k, v)));
    }
  };

  return {
    size: () => size,
    set(key: Key, value: Value) {
      if (_set(key, value)) {
        size++;
        resize();
      }
    },
    iter,
    get(key: Key): Maybe<Value> {
      const _hash = hash(key) % capacity;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const _bucket = buckets[_hash]!;
      const pair = _bucket.find(([k]) => equals(k, key));
      if (!pair) {
        return none();
      }
      return some(pair[1]);
    },
    unset(key: Key) {
      const _hash = hash(key) % capacity;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const _bucket = buckets[_hash]!;
      const _newBucket = _bucket.filter(([k]) => !equals(k, key));
      buckets[_hash] = _newBucket;
      if (_newBucket.length !== _bucket.length) {
        size--;
        resize();
      }
    },
    map<NewKey extends Hashable & Equalable, NewValue>(mapper: (pair: [Key, Value]) => [NewKey, NewValue]): VNMap<NewKey, NewValue> {
      const newMap = createHashTable<NewKey, NewValue>();
      iter().forEach((pair) => {
        const [nk, nv] = mapper(pair);
        newMap.set(nk, nv);
      });
      return newMap;
    },
    toString(): string {
      return (
        '{ ' +
        iter()
          .map((pair) => JSON.stringify(pair))
          .join(',') +
        ' }'
      );
    },
  };
}
