import type { TypeSet } from '../types/pokemon';
import type { CandidateScoreDetail, Multiplier } from '../types/quiz';
import { calcMultiplier } from './multiplier';
import { calcDefenseScore } from './defenseScore';

// 候補ポケモンの攻撃面：候補が持つタイプそれぞれのタイプ一致攻撃を、各相手に対して試算し、
// 各相手については「最も通る方の倍率(=最大値)」を採用する。
// 解釈：候補ポケモンはタイプ一致技を技1〜2本持っており、相手ごとに最適な技を選んで撃つ前提。
// 仕様書に明文がないため、本実装はテスト candidateScore.test.ts で固定する。
export function calcCandidateScore(candidate: TypeSet, opponents: TypeSet[]): CandidateScoreDetail {
  const attackTypes = [candidate.primary];
  if (candidate.secondary) attackTypes.push(candidate.secondary);

  const attackPerOpponent: Multiplier[] = opponents.map((opp) => {
    const mults = attackTypes.map((t) => calcMultiplier(t, opp));
    return Math.max(...mults) as Multiplier;
  });

  const attack = attackPerOpponent.reduce<number>((a, b) => a + b, 0);

  let superEffectiveCount = 0;
  let immuneCount = 0;
  let halvedOrLessCount = 0;
  for (const m of attackPerOpponent) {
    if (m >= 2) superEffectiveCount += 1;
    if (m === 0) immuneCount += 1;
    if (m <= 0.5) halvedOrLessCount += 1;
  }

  const defense = calcDefenseScore(candidate, opponents);

  return {
    attack,
    defense: defense.total,
    total: attack + defense.total,
    attackPerOpponent,
    defensePerOpponent: defense.perOpponent,
    superEffectiveCount,
    immuneCount,
    halvedOrLessCount,
    weakSpotCount: defense.weakSpotCount,
  };
}

// タイブレーク：総合 / 弱点が少ない / 攻撃面の無効を取られない / 抜群が多い
export function candidateTieBreakKey(detail: CandidateScoreDetail): [number, number, number, number] {
  return [
    detail.total,
    -detail.weakSpotCount || 0,
    -detail.immuneCount || 0,
    detail.superEffectiveCount,
  ];
}
