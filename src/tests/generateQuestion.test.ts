import { describe, expect, it } from 'vitest';
import { generateQuestion } from '../domain/generateQuestion';
import { mulberry32 } from '../domain/rng';

describe('generateQuestion', () => {
  it('attack-coverage モード: 相手6体・候補4タイプ', () => {
    const q = generateQuestion({
      mode: 'attack-coverage',
      difficulty: 'normal',
      rng: mulberry32(12345),
    });
    expect(q.opponents).toHaveLength(6);
    expect(q.choices.kind).toBe('attack');
    if (q.choices.kind === 'attack') {
      expect(q.choices.types).toHaveLength(4);
    }
    expect(q.correctChoiceIndexes.length).toBeGreaterThanOrEqual(1);
  });

  it('candidate-selection モード: 候補は3〜4', () => {
    const q = generateQuestion({
      mode: 'candidate-selection',
      difficulty: 'hard',
      rng: mulberry32(99),
    });
    expect(q.opponents).toHaveLength(6);
    expect(q.choices.kind).toBe('candidate');
    if (q.choices.kind === 'candidate') {
      expect([3, 4]).toContain(q.choices.sets.length);
    }
    expect(q.correctChoiceIndexes.length).toBeGreaterThanOrEqual(1);
  });

  it('Easy は単タイプ多め、Hard は複合タイプ多め (傾向)', () => {
    let easyDualCount = 0;
    let hardDualCount = 0;
    for (let i = 0; i < 100; i += 1) {
      const easy = generateQuestion({
        mode: 'attack-coverage',
        difficulty: 'easy',
        rng: mulberry32(i + 1),
      });
      const hard = generateQuestion({
        mode: 'attack-coverage',
        difficulty: 'hard',
        rng: mulberry32(i + 5000),
      });
      easyDualCount += easy.opponents.filter((o) => o.secondary).length;
      hardDualCount += hard.opponents.filter((o) => o.secondary).length;
    }
    expect(hardDualCount).toBeGreaterThan(easyDualCount * 2);
  });

  it('同じ seed なら同じ問題', () => {
    const a = generateQuestion({
      mode: 'attack-coverage',
      difficulty: 'normal',
      rng: mulberry32(777),
    });
    const b = generateQuestion({
      mode: 'attack-coverage',
      difficulty: 'normal',
      rng: mulberry32(777),
    });
    expect(a.opponents).toEqual(b.opponents);
    if (a.choices.kind === 'attack' && b.choices.kind === 'attack') {
      expect(a.choices.types).toEqual(b.choices.types);
    }
  });
});
