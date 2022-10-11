import { isNone, isSome, Maybe, none, some } from '../../../src/mondas/maybe';

describe('identities', () => {
  it('should be some when some', () => {
    expect(isSome(some(2))).toBe(true);
  });

  it('should not be None when Some', () => {
    expect(isNone(some(2))).toBe(false);
  });

  it('should be None when None', () => {
    expect(isNone(none())).toBe(true);
  });

  it('should not be Some when None', () => {
    expect(isSome(none())).toBe(false);
  });

  it
    .each([1, 2, 3, 'Some', 'vale', { object: true }])
    ('should contain same value', (item) => {
      expect(
        some(item).just,
      ).toBe(item);
    });
});

describe('mapping', () => {
  it('should be Some of new value after map when Some', () => {
    expect(
      some("vale")
        .map((just) => just + 42)
        .just,
    ).toBe("vale42");
  });

  it('should be None after map when None', () => {
    expect(
      isNone(
        none<string>()
        .map((just) => just + 42),
      ),
    ).toBe(true);
  });
});

describe('pattern match', () => {
  it('should use onSome when Some', () => {
    expect(
      some(42)
        .match(
          (just) => just*2,
          () => "NA",
        ),
    ).toBe(42*2);
  });

  it('should use onNone when None', () => {
    expect(
      none<number>()
        .match(
          (just) => just*2,
          () => "NA",
        ),
    ).toBe("NA");
  });
});

/*
  TYPE TESTS
*/

/* eslint-disable @typescript-eslint/no-unused-vars */

const whenSomeHasJust = some(2).just;

// @ts-expect-error type-test
const whenNoneNoJust = none().just;

const whenSomeIsKnownCollapse: number = some(2).match(() => 2, () => "no");

const whenNoneIsKnownCollapse: string = none<number>().match(() => 2, () => "no");

const whenMaybeIsUnknownIsUnion: string | number = (some(2) as Maybe<number>)
  .match(() => 2, () => "no");

// @ts-expect-error type-test
const whenMaybeIsUnknownDontCollapseOnSome: number = (some(2) as Maybe<number>)
  .match(() => 2, () => "no");

// @ts-expect-error type-test
const whenMaybeIsUnknownDontCollapseOnNone: string = (none() as Maybe<number>)
  .match(() => 2, () => "no");

/* eslint-enable @typescript-eslint/no-unused-vars */
