import { cyrb128 } from './hash';

/**
 * @param a: seed part 1
 * @param b: seed part 1
 * @param c: seed part 1
 * @param d: seed part 1
 */
export function sfc32(a: number, b: number, c: number, d: number) {
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;
  let t = (a + b) | 0;
  return function () {
    t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function randomSfc32(seed: string) {
  const [a, b, c, d] = cyrb128(seed);
  return sfc32(a, b, c, d);
}
