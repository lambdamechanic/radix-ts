import { describe, it, expect } from 'vitest';
import { buildTrie, intersectAll } from './index';

function randomWord(len: number) {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  return out;
}

function randomWords(count: number, minLen: number, maxLen: number) {
  const res: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
    res.push(randomWord(len));
  }
  return res;
}

function naiveIntersect(qWords: string[], iWords: string[]) {
  const result = new Set<string>();
  for (const q of qWords) {
    for (const i of iWords) {
      if (q.startsWith(i)) {
        result.add(q);
        break;
      }
    }
  }
  return Array.from(result).sort();
}

describe('intersectAll', () => {
  it('matches naive implementation for random tries', async () => {
    for (let r = 0; r < 20; r++) {
      const qWords = randomWords(20, 1, 4);
      const iWords = randomWords(10, 1, 3);
      const qTrie = await buildTrie(qWords);
      const iTrie = await buildTrie(iWords);
      const fast: string[] = [];
      for await (const [k] of intersectAll(qTrie, iTrie)) fast.push(k);
      fast.sort();
      const slow = naiveIntersect(qWords, iWords);
      expect(fast).toEqual(slow);
    }
  });
});
