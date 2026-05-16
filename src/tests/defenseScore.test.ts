import { describe, expect, it } from 'vitest';
import { calcDefenseScore, defenseRating } from '../domain/defenseScore';

describe('defenseRating', () => {
  it('被ダメ倍率→評価点 (仕様書テーブル)', () => {
    expect(defenseRating(0)).toBe(4);
    expect(defenseRating(0.25)).toBe(3);
    expect(defenseRating(0.5)).toBe(2);
    expect(defenseRating(1)).toBe(1);
    expect(defenseRating(2)).toBe(-1);
    expect(defenseRating(4)).toBe(-3);
  });
});

describe('calcDefenseScore', () => {
  it('はがねは ノーマル攻撃を半減 → 評価点2', () => {
    const result = calcDefenseScore({ primary: 'steel' }, [{ primary: 'normal' }]);
    expect(result.perOpponent[0]).toBe(2);
    expect(result.total).toBe(2);
    expect(result.weakSpotCount).toBe(0);
  });

  it('複合相手では「より痛い側」を被弾として採用', () => {
    // 候補=みず、相手=でんき/くさ: でんき技は2倍、くさ技も2倍 → 共に2倍。両方weak、より痛いのは2倍(-1)
    const result = calcDefenseScore({ primary: 'water' }, [
      { primary: 'electric', secondary: 'grass' },
    ]);
    expect(result.perOpponent[0]).toBe(-1);
    expect(result.weakSpotCount).toBe(1);
  });

  it('候補が複合タイプで二重弱点を取られるケース', () => {
    // 候補=くさ/エスパー (例: フシギバナのナシ風候補), 相手=むし → むし攻撃 4倍 → -3点
    const result = calcDefenseScore({ primary: 'grass', secondary: 'psychic' }, [
      { primary: 'bug' },
    ]);
    expect(result.perOpponent[0]).toBe(-3);
    expect(result.weakSpotCount).toBe(1);
  });
});
