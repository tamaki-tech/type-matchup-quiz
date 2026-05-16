import type { PokemonType } from '../types/pokemon';
import type {
  AnswerDetail,
  AttackScoreDetail,
  CandidateScoreDetail,
  Difficulty,
  Mode,
  QuizQuestion,
  QuizResult,
} from '../types/quiz';
import type { SessionState } from '../types/session';
import { evaluateChoices } from '../domain/findCorrectChoices';
import { generateExplanation } from '../domain/explanation';
import { generateQuestion } from '../domain/generateQuestion';

// 1ラウンドの問題数。10問解いたら成績画面へ
export const ROUND_LENGTH = 10;

export const initialSessionState: SessionState = {
  screen: 'top',
  mode: 'attack-coverage',
  difficulty: 'normal',
  currentQuestion: null,
  lastAnswer: null,
  history: [],
  streak: 0,
  bestStreak: 0,
  roundAnswered: 0,
};

export type SessionAction =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_QUIZ' }
  | { type: 'SUBMIT_ANSWER'; selectedChoiceIndex: number | null }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GO_TO_RESULT' }
  | { type: 'GO_TO_TOP' }
  | { type: 'RESET_STATS' };

function makeAnswerDetail(
  question: QuizQuestion,
  selectedChoiceIndex: number | null,
): AnswerDetail {
  const evaluation = evaluateChoices(question.choices, question.opponents);
  const correct =
    selectedChoiceIndex != null &&
    evaluation.correctChoiceIndexes.includes(selectedChoiceIndex);

  let attackDetails: AttackScoreDetail[] | undefined;
  let candidateDetails: CandidateScoreDetail[] | undefined;
  if (evaluation.kind === 'attack') attackDetails = evaluation.details;
  else candidateDetails = evaluation.details;

  const explanation =
    evaluation.kind === 'attack'
      ? generateExplanation({
          question,
          kind: 'attack',
          details: evaluation.details,
          correctChoiceIndexes: evaluation.correctChoiceIndexes,
        })
      : generateExplanation({
          question,
          kind: 'candidate',
          details: evaluation.details,
          correctChoiceIndexes: evaluation.correctChoiceIndexes,
        });

  return {
    question,
    selectedChoiceIndex,
    correct,
    attackDetails,
    candidateDetails,
    correctChoiceIndexes: evaluation.correctChoiceIndexes,
    explanation,
  };
}

function deriveMistakeTypes(answer: AnswerDetail): PokemonType[] {
  if (answer.correct) return [];
  const types = new Set<PokemonType>();
  for (const opp of answer.question.opponents) {
    types.add(opp.primary);
    if (opp.secondary) types.add(opp.secondary);
  }
  // 候補ポケモン選択モードの場合、ユーザーが選んだ候補側のタイプは「自分のタイプ」なので除外する
  if (
    answer.question.choices.kind === 'candidate' &&
    answer.selectedChoiceIndex != null
  ) {
    const set = answer.question.choices.sets[answer.selectedChoiceIndex];
    if (set) {
      types.delete(set.primary);
      if (set.secondary) types.delete(set.secondary);
    }
  }
  return Array.from(types);
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };
    case 'START_QUIZ': {
      const question = generateQuestion({ mode: state.mode, difficulty: state.difficulty });
      return {
        ...state,
        screen: 'quiz',
        currentQuestion: question,
        lastAnswer: null,
        roundAnswered: 0,
      };
    }
    case 'SUBMIT_ANSWER': {
      if (!state.currentQuestion) return state;
      const answer = makeAnswerDetail(state.currentQuestion, action.selectedChoiceIndex);
      const mistakeTypes = deriveMistakeTypes(answer);
      const result: QuizResult = {
        questionId: state.currentQuestion.id,
        mode: state.currentQuestion.mode,
        selectedChoiceIndex: action.selectedChoiceIndex,
        correct: answer.correct,
        answeredAt: new Date().toISOString(),
        mistakeTypes,
      };
      const nextStreak = answer.correct ? state.streak + 1 : 0;
      return {
        ...state,
        screen: 'explanation',
        lastAnswer: answer,
        history: [...state.history, result],
        streak: nextStreak,
        bestStreak: Math.max(state.bestStreak, nextStreak),
        roundAnswered: state.roundAnswered + 1,
      };
    }
    case 'NEXT_QUESTION': {
      const question = generateQuestion({ mode: state.mode, difficulty: state.difficulty });
      return { ...state, screen: 'quiz', currentQuestion: question, lastAnswer: null };
    }
    case 'GO_TO_RESULT':
      return { ...state, screen: 'result' };
    case 'GO_TO_TOP':
      return { ...state, screen: 'top', currentQuestion: null, lastAnswer: null };
    case 'RESET_STATS':
      return {
        ...state,
        history: [],
        streak: 0,
        bestStreak: 0,
      };
    default:
      return state;
  }
}
