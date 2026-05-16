import type { TypeSet } from '../types/pokemon';
import type {
  AttackScoreDetail,
  CandidateScoreDetail,
  QuizChoices,
} from '../types/quiz';
import { attackTieBreakKey, calcAttackScore } from './attackScore';
import { calcCandidateScore, candidateTieBreakKey } from './candidateScore';

export type ChoiceEvaluation =
  | { kind: 'attack'; details: AttackScoreDetail[]; correctChoiceIndexes: number[] }
  | { kind: 'candidate'; details: CandidateScoreDetail[]; correctChoiceIndexes: number[] };

function compareKeys(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function findMaxIndexes(keys: number[][]): number[] {
  let best = keys[0];
  for (let i = 1; i < keys.length; i += 1) {
    if (compareKeys(keys[i], best) > 0) best = keys[i];
  }
  const result: number[] = [];
  for (let i = 0; i < keys.length; i += 1) {
    if (compareKeys(keys[i], best) === 0) result.push(i);
  }
  return result;
}

export function evaluateChoices(choices: QuizChoices, opponents: TypeSet[]): ChoiceEvaluation {
  if (choices.kind === 'attack') {
    const details = choices.types.map((t) => calcAttackScore(t, opponents));
    const keys = details.map((d) => attackTieBreakKey(d) as unknown as number[]);
    return { kind: 'attack', details, correctChoiceIndexes: findMaxIndexes(keys) };
  }
  const details = choices.sets.map((s) => calcCandidateScore(s, opponents));
  const keys = details.map((d) => candidateTieBreakKey(d) as unknown as number[]);
  return { kind: 'candidate', details, correctChoiceIndexes: findMaxIndexes(keys) };
}
