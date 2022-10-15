// null, string, number, bigint, undefined, boolean

type EqualableObject = {
  [key: string]: Equalable
}
type HasNativeEquality = null | string | number | bigint | undefined | boolean
export type Equalable = EqualableObject | HasNativeEquality | Equalable[]

const equals = (
  self: Equalable,
  other: Equalable,
): boolean => {
  if (self === null || other === null) return self === other;
  if (typeof self !== typeof other) return false;

  if (Array.isArray(self)) {
    if (!Array.isArray(other)) return false;
    if (self.length !== other.length) return false;
    for (let i = 0; i < self.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const left = self[i]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const right = other[i]!;
      if (!equals(left, right)) return false;
    }
    return true;
  }

  if (typeof self === 'object') {
    const selfValues = Object.entries(self);
    const otherValues = Object.entries(other as EqualableObject);
    selfValues.sort(([l], [r]) => l.localeCompare(r));
    otherValues.sort(([l], [r]) => l.localeCompare(r));
    if (selfValues.length !== otherValues.length) return false;
    for (let i = 0; i < selfValues.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [,left] = selfValues[i]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [,right] = otherValues[i]!;
      if (!equals(left, right)) return false;
    }
    return true;
  }
  return self === other;
};

export default equals;


