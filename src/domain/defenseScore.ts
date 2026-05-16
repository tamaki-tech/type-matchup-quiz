import type { TypeSet } from '../types/pokemon';
import type { Multiplier } from '../types/quiz';
import { calcMultiplier } from './multiplier';

// 仕様書の被ダメ倍率 → 防御評価点
export function defenseRating(multiplier: Multiplier): number {
  switch (multiplier) {
    case 0:
      return 4;
    case 0.25:
      return 3;
    case 0.5:
      return 2;
    case 1:
      return 1;
    case 2:
      return -1;
    case 4:
      return -3;
  }
}

// 候補ポケモンが「相手6体それぞれのタイプ一致攻撃」を受けるシナリオを評価する。
// 各相手の primary / secondary を独立に攻撃技として扱い、最も厳しい(=評価点が低い)被弾を採用する。
// 「相手の最強の技で殴られたら？」という観点で被害を見積もる解釈。
export function calcDefenseScore(candidate: TypeSet, opponents: TypeSet[]): {
  total: number;
  perOpponent: number[];
  weakSpotCount: number;
} {
  const perOpponent: number[] = [];
  let weakSpotCount = 0;
  for (const opp of opponents) {
    const attackTypes = [opp.primary];
    if (opp.secondary) attackTypes.push(opp.secondary);
    const multipliersTakenByCandidate: Multiplier[] = attackTypes.map((t) =>
      calcMultiplier(t, candidate),
    );
    // 評価点はもっとも低いものを採用(最も痛い被弾)
    const ratings = multipliersTakenByCandidate.map(defenseRating);
    const worst = Math.min(...ratings);
    perOpponent.push(worst);
    if (multipliersTakenByCandidate.some((m) => m >= 2)) weakSpotCount += 1;
  }
  const total = perOpponent.reduce((a, b) => a + b, 0);
  return { total, perOpponent, weakSpotCount };
}
