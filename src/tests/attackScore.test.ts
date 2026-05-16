import { describe, expect, it } from 'vitest';
import type { TypeSet } from '../types/pokemon';
import { attackTieBreakKey, calcAttackScore } from '../domain/attackScore';

describe('calcAttackScore', () => {
  it('全員に抜群を取れる場合', () => {
    const opponents: TypeSet[] = [
      { primary: 'dragon' },
      { primary: 'dragon' },
      { primary: 'dragon' },
      { primary: 'dragon' },
      { primary: 'dragon' },
      { primary: 'dragon' },
    ];
    const result = calcAttackScore('ice', opponents);
    expect(result.total).toBe(12);
    expect(result.superEffectiveCount).toBe(6);
    expect(result.immuneCount).toBe(0);
    expect(result.halvedOrLessCount).toBe(0);
  });

  it('全員に無効化される場合', () => {
    const opponents: TypeSet[] = [
      { primary: 'ghost' },
      { primary: 'ghost' },
      { primary: 'ghost' },
      { primary: 'ghost' },
      { primary: 'ghost' },
      { primary: 'ghost' },
    ];
    const result = calcAttackScore('normal', opponents);
    expect(result.total).toBe(0);
    expect(result.superEffectiveCount).toBe(0);
    expect(result.immuneCount).toBe(6);
    expect(result.halvedOrLessCount).toBe(6);
  });

  it('混在ケース', () => {
    const opponents: TypeSet[] = [
      { primary: 'water', secondary: 'flying' }, // ice→water=0.5, ice→flying=2 → 1
      { primary: 'ground' }, // ice→ground=2 → 2
      { primary: 'steel', secondary: 'fairy' }, // ice→steel=0.5, ice→fairy=1 → 0.5
      { primary: 'fire', secondary: 'rock' }, // ice→fire=0.5, ice→rock=1 → 0.5
      { primary: 'grass', secondary: 'poison' }, // ice→grass=2, ice→poison=1 → 2
      { primary: 'dragon' }, // ice→dragon=2 → 2
    ];
    const result = calcAttackScore('ice', opponents);
    // 1 + 2 + 0.5 + 0.5 + 2 + 2 = 8
    expect(result.total).toBe(8);
    expect(result.superEffectiveCount).toBe(3);
    expect(result.immuneCount).toBe(0);
    expect(result.halvedOrLessCount).toBe(2);
  });

  it('attackTieBreakKey はタプルを返す', () => {
    const detail = calcAttackScore('water', [{ primary: 'fire' }]);
    expect(attackTieBreakKey(detail)).toEqual([2, 0, 0, 1]);
  });
});
