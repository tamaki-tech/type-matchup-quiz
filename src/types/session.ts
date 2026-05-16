import type { AnswerDetail, Difficulty, Mode, QuizQuestion, QuizResult } from './quiz';

export type Screen = 'top' | 'quiz' | 'explanation' | 'result';

export type SessionState = {
  screen: Screen;
  mode: Mode;
  difficulty: Difficulty;
  currentQuestion: QuizQuestion | null;
  lastAnswer: AnswerDetail | null;
  history: QuizResult[];
  streak: number;
  bestStreak: number;
  // 現ラウンド(1回のプレイ=10問)での回答済み数。START_QUIZでリセット
  roundAnswered: number;
};
