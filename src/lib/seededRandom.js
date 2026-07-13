// Deterministic RNG (mulberry32) so we can seed it from today's date.
// Same seed -> same sequence of "random" numbers -> everyone gets the
// same daily challenge, the same way Wordle gives everyone the same word.

export function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromDateString(dateKey) {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function dailyRandom(dateKey) {
  return mulberry32(seedFromDateString(dateKey));
}
