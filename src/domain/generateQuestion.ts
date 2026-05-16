import type { PokemonType, TypeSet } from '../types/pokemon';
import type { Difficulty, Mode, QuizChoices, QuizQuestion } from '../types/quiz';
import { ALL_TYPES } from '../constants/types';
import { evaluateChoices } from './findCorrectChoices';
import { defaultRng, pickRandom, type Rng, shuffleInPlace } from './rng';

const DUAL_TYPE_PROBABILITY: Record<Difficulty, number> = {
  easy: 0.2,
  normal: 0.5,
  hard: 0.8,
};

const CANDIDATE_DUAL_PROBABILITY: Record<Difficulty, number> = {
  easy: 0.3,
  normal: 0.6,
  hard: 0.85,
};

function makeId(rng: Rng): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // テスト用フォールバック
  return `q_${Math.floor(rng() * 1_000_000_000).toString(36)}`;
}

function generateTypeSet(rng: Rng, dualProbability: number): TypeSet {
  const primary = pickRandom(ALL_TYPES, rng);
  if (rng() < dualProbability) {
    let secondary = pickRandom(ALL_TYPES, rng);
    let guard = 0;
    while (secondary === primary && guard < 20) {
      secondary = pickRandom(ALL_TYPES, rng);
      guard += 1;
    }
    if (secondary !== primary) {
      return { primary, secondary };
    }
  }
  return { primary };
}

function generateOpponents(difficulty: Difficulty, rng: Rng): TypeSet[] {
  const probability = DUAL_TYPE_PROBABILITY[difficulty];
  const opponents: TypeSet[] = [];
  for (let i = 0; i < 6; i += 1) {
    opponents.push(generateTypeSet(rng, probability));
  }
  return opponents;
}

function pickDistinctTypes(count: number, rng: Rng): PokemonType[] {
  const pool = [...ALL_TYPES];
  shuffleInPlace(pool, rng);
  return pool.slice(0, count);
}

function generateAttackChoices(rng: Rng): QuizChoices {
  return { kind: 'attack', types: pickDistinctTypes(4, rng) };
}

function generateCandidateChoices(difficulty: Difficulty, rng: Rng): QuizChoices {
  const count = rng() < 0.5 ? 3 : 4;
  const dualProb = CANDIDATE_DUAL_PROBABILITY[difficulty];
  const seen = new Set<string>();
  const sets: TypeSet[] = [];
  let guard = 0;
  while (sets.length < count && guard < 50) {
    guard += 1;
    const set = generateTypeSet(rng, dualProb);
    const key = `${set.primary}/${set.secondary ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sets.push(set);
  }
  return { kind: 'candidate', sets };
}

export type GenerateQuestionParams = {
  mode: Mode;
  difficulty: Difficulty;
  rng?: Rng;
  maxAttempts?: number;
};

// 全候補が同点になる退屈な問題を避けるため、最大 maxAttempts 回まで再生成する。
// それでも同点なら最後の結果を採用(複数正解扱い)。
export function generateQuestion({
  mode,
  difficulty,
  rng = defaultRng,
  maxAttempts = 5,
}: GenerateQuestionParams): QuizQuestion {
  let lastQuestion: QuizQuestion | null = null;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const opponents = generateOpponents(difficulty, rng);
    const choices: QuizChoices =
      mode === 'attack-coverage'
        ? generateAttackChoices(rng)
        : generateCandidateChoices(difficulty, rng);

    const evaluation = evaluateChoices(choices, opponents);
    const question: QuizQuestion = {
      id: makeId(rng),
      mode,
      difficulty,
      opponents,
      choices,
      correctChoiceIndexes: evaluation.correctChoiceIndexes,
    };
    lastQuestion = question;

    const choiceCount =
      choices.kind === 'attack' ? choices.types.length : choices.sets.length;
    if (evaluation.correctChoiceIndexes.length < choiceCount) {
      return question;
    }
  }
  // 最終フォールバック
  return lastQuestion!;
}
