import type { PokemonType, TypeSet } from '../types/pokemon';
import type { AttackScoreDetail } from '../types/quiz';
import { calcMultiplier } from './multiplier';

export function calcAttackScore(attacker: PokemonType, opponents: TypeSet[]): AttackScoreDetail {
  const perOpponent = opponents.map((opp) => calcMultiplier(attacker, opp));
  const total = perOpponent.reduce<number>((a, b) => a + b, 0);
  let superEffectiveCount = 0;
  let immuneCount = 0;
  let halvedOrLessCount = 0;
  for (const m of perOpponent) {
    if (m >= 2) superEffectiveCount += 1;
    if (m === 0) immuneCount += 1;
    if (m <= 0.5) halvedOrLessCount += 1;
  }
  return { total, superEffectiveCount, immuneCount, halvedOrLessCount, perOpponent };
}

// タイブレーク用比較タプル：合計が大きい / 無効を取られない / 半減以下が少ない / 抜群が多い
// 0 と -0 を区別したくないため、絶対値0なら +0 を返す
export function attackTieBreakKey(detail: AttackScoreDetail): [number, number, number, number] {
  return [
    detail.total,
    -detail.immuneCount || 0,
    -detail.halvedOrLessCount || 0,
    detail.superEffectiveCount,
  ];
}
