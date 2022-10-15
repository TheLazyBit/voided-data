import equals, { Equalable } from '../../../src/objects/equals';

describe('null equality', () => {
  test.each(
    [42, undefined, 'string', BigInt(7), {}, { some: 'value' }, [6, 'values']] as Equalable[],
  )('when null compared against others is safe', (other) => {
    expect(equals(other, null)).toBe(false);
    expect(equals(null, other)).toBe(false);
  });

  test('when null equals null', () => {
    expect(equals(null, null)).toBe(true);
  });
});

describe('equality checks', () => {
  it.each([
    ['', ''],
    ['some value', 'some value'],
    [0, 0],
    [53, 53],
    [BigInt(9), BigInt(9)],
    [[], []],
    [[1, 2, 3], [1, 2, 3]],
    [undefined, undefined],
    [{}, {}],
    [{ some: 'value' }, { some: 'value' }],
    [{ more: 'values', and: 7 }, { more: 'values', and: 7 }],
  ] as [Equalable, Equalable][])('should be equal', ((l, r) => {
    expect(equals(l, r)).toBe(true);
    expect(equals(r, l)).toBe(true);
  }));

  it.each([
    ['', ''],
    ['some value', 'some ! value'],
    [0, 4],
    [53, 513],
    [BigInt(1), BigInt(9)],
    [[1, 3, 2], [1, 2, 3]],
    [undefined, {}],
    [{}, []],
    [{ some: 'value' }, { some: '<value>' }],
    [{ more: 'values', and: 7 }, { more: 'values', and: 15 }],
  ] as [Equalable, Equalable][])('should not be equal', ((l, r) => {
    expect(equals(l, r)).toBe(true);
    expect(equals(r, l)).toBe(true);
  }));

  it('should be equal on deep', () => {
    expect(
      equals({
          l1: {
            l2: {
              l3: {
                x: [1, [2, [3]]],
              },
            },
          },
        },
        {
          l1: {
            l2: {
              l3: {
                x: [1, [2, [3]]],
              },
            },
          },
        }),
    ).toBe(true);
  });

  it('should not be equal on deep', () => {
    expect(
      equals({
          l1: {
            l2: {
              l3: {
                x: [1, [2, ["NOT"]]],
              },
            },
          },
        },
        {
          l1: {
            l2: {
              l3: {
                x: [1, [2, [3]]],
              },
            },
          },
        }),
    ).toBe(false);
  });
});
