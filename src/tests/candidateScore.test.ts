import { describe, expect, it } from 'vitest';
import type { TypeSet } from '../types/pokemon';
import { calcCandidateScore } from '../domain/candidateScore';

describe('calcCandidateScore', () => {
  it('複合候補の攻撃面は各相手についてタイプごとの最大倍率を採用する', () => {
    // 候補=みず/くさ。相手=ほのお。みず攻撃=2倍, くさ攻撃=0.5倍 → max=2倍を採用。
    const opponents: TypeSet[] = [{ primary: 'fire' }];
    const result = calcCandidateScore({ primary: 'water', secondary: 'grass' }, opponents);
    expect(result.attackPerOpponent[0]).toBe(2);
    expect(result.attack).toBe(2);
  });

  it('総合スコア = 攻撃 + 防御', () => {
    // 候補=みず。相手=ほのお (みず2倍取れる, ほのお技は0.5倍で受ける=評価2)
    const opponents: TypeSet[] = [{ primary: 'fire' }];
    const result = calcCandidateScore({ primary: 'water' }, opponents);
    expect(result.attack).toBe(2);
    expect(result.defense).toBe(2);
    expect(result.total).toBe(4);
  });

  it('攻撃面で同点だが防御面で勝るケース', () => {
    // 同じ相手構成に対して、攻撃面が同等でも防御面差が出る候補を比較する
    const opponents: TypeSet[] = [
      { primary: 'fire' },
      { primary: 'fire' },
      { primary: 'fire' },
      { primary: 'fire' },
      { primary: 'fire' },
      { primary: 'fire' },
    ];
    const water = calcCandidateScore({ primary: 'water' }, opponents);
    const ground = calcCandidateScore({ primary: 'ground' }, opponents);
    // どちらもほのお相手に2倍 → 攻撃面は同点
    expect(water.attack).toBe(ground.attack);
    // 防御面：水はほのおを0.5倍で受ける(2点), 地面はほのお等倍(1点)
    expect(water.defense).toBeGreaterThan(ground.defense);
  });
});
