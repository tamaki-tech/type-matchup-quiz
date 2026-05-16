import { describe, expect, it } from 'vitest';
import type { TypeSet } from '../types/pokemon';
import { evaluateChoices } from '../domain/findCorrectChoices';

describe('evaluateChoices (attack)', () => {
  it('明確な単一正解', () => {
    const opponents: TypeSet[] = [
      { primary: 'water' },
      { primary: 'water' },
      { primary: 'water' },
      { primary: 'water' },
      { primary: 'water' },
      { primary: 'water' },
    ];
    const result = evaluateChoices(
      { kind: 'attack', types: ['fire', 'electric', 'grass', 'normal'] },
      opponents,
    );
    // grass=2,2,2,2,2,2 / electric=2,2,2,2,2,2 → grass と electric は同点
    expect(result.correctChoiceIndexes.length).toBeGreaterThanOrEqual(1);
    expect(result.correctChoiceIndexes).toContain(1); // electric
    expect(result.correctChoiceIndexes).toContain(2); // grass
    expect(result.correctChoiceIndexes).not.toContain(0); // fire
    expect(result.correctChoiceIndexes).not.toContain(3); // normal
  });

  it('完全に同点なら全候補が正解', () => {
    const opponents: TypeSet[] = [
      { primary: 'normal' },
      { primary: 'normal' },
      { primary: 'normal' },
      { primary: 'normal' },
      { primary: 'normal' },
      { primary: 'normal' },
    ];
    const result = evaluateChoices(
      { kind: 'attack', types: ['fire', 'water', 'grass', 'electric'] },
      opponents,
    );
    expect(result.correctChoiceIndexes.length).toBe(4);
  });
});
