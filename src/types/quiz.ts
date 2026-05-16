import type { PokemonType, TypeSet } from './pokemon';

export type Mode = 'attack-coverage' | 'candidate-selection';
export type Difficulty = 'easy' | 'normal' | 'hard';

export type Multiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4;

export type AttackChoices = {
  kind: 'attack';
  types: PokemonType[];
};

export type CandidateChoices = {
  kind: 'candidate';
  sets: TypeSet[];
};

export type QuizChoices = AttackChoices | CandidateChoices;

export type QuizQuestion = {
  id: string;
  mode: Mode;
  difficulty: Difficulty;
  opponents: TypeSet[];
  choices: QuizChoices;
  correctChoiceIndexes: number[];
};

export type AttackScoreDetail = {
  total: number;
  superEffectiveCount: number;
  immuneCount: number;
  halvedOrLessCount: number;
  perOpponent: Multiplier[];
};

export type CandidateScoreDetail = {
  attack: number;
  defense: number;
  total: number;
  attackPerOpponent: Multiplier[];
  defensePerOpponent: number[];
  superEffectiveCount: number;
  immuneCount: number;
  halvedOrLessCount: number;
  weakSpotCount: number;
};

export type AnswerDetail = {
  question: QuizQuestion;
  selectedChoiceIndex: number | null;
  correct: boolean;
  attackDetails?: AttackScoreDetail[];
  candidateDetails?: CandidateScoreDetail[];
  correctChoiceIndexes: number[];
  explanation: string;
};

export type QuizResult = {
  questionId: string;
  mode: Mode;
  selectedChoiceIndex: number | null;
  correct: boolean;
  answeredAt: string;
  mistakeTypes: PokemonType[];
};
