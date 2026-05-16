import type { TypeSet } from '../types/pokemon';
import type {
  AttackScoreDetail,
  CandidateScoreDetail,
  QuizChoices,
  QuizQuestion,
} from '../types/quiz';
import { TYPE_LABEL_JA } from '../constants/types';

function typeSetLabel(set: TypeSet): string {
  return set.secondary
    ? `${TYPE_LABEL_JA[set.primary]} / ${TYPE_LABEL_JA[set.secondary]}`
    : TYPE_LABEL_JA[set.primary];
}

function describeAttack(
  choices: QuizChoices,
  details: AttackScoreDetail[],
  correctIndex: number,
): string {
  if (choices.kind !== 'attack') return '';
  const correctType = TYPE_LABEL_JA[choices.types[correctIndex]];
  const detail = details[correctIndex];
  const fragments: string[] = [];
  fragments.push(`「${correctType}」は6体中${detail.superEffectiveCount}体に抜群を取れる一貫タイプ。`);
  if (detail.immuneCount > 0) {
    fragments.push(`ただし${detail.immuneCount}体には無効化される点に注意。`);
  } else {
    fragments.push('無効化されないため一貫性が高い。');
  }

  // 次点を探す
  let runnerUpIndex = -1;
  let runnerUpTotal = -Infinity;
  for (let i = 0; i < details.length; i += 1) {
    if (i === correctIndex) continue;
    if (details[i].total > runnerUpTotal) {
      runnerUpTotal = details[i].total;
      runnerUpIndex = i;
    }
  }
  if (runnerUpIndex >= 0) {
    const runnerUpType = TYPE_LABEL_JA[choices.types[runnerUpIndex]];
    const runnerUpDetail = details[runnerUpIndex];
    const reason =
      runnerUpDetail.immuneCount > 0
        ? `${runnerUpDetail.immuneCount}体に無効化される`
        : runnerUpDetail.halvedOrLessCount > 0
          ? `${runnerUpDetail.halvedOrLessCount}体に半減以下`
          : `総合倍率で劣る`;
    fragments.push(`次点の「${runnerUpType}」は${reason}ため不利。`);
  }
  return fragments.join('');
}

function describeCandidate(
  choices: QuizChoices,
  details: CandidateScoreDetail[],
  correctIndex: number,
): string {
  if (choices.kind !== 'candidate') return '';
  const correctSet = choices.sets[correctIndex];
  const detail = details[correctIndex];
  const fragments: string[] = [];
  fragments.push(
    `「${typeSetLabel(correctSet)}」は攻撃面で6体中${detail.superEffectiveCount}体に抜群、防御面の弱点は${detail.weakSpotCount}体。`,
  );
  fragments.push(`総合スコア${detail.total}点で他候補より優位。`);

  let runnerUpIndex = -1;
  let runnerUpTotal = -Infinity;
  for (let i = 0; i < details.length; i += 1) {
    if (i === correctIndex) continue;
    if (details[i].total > runnerUpTotal) {
      runnerUpTotal = details[i].total;
      runnerUpIndex = i;
    }
  }
  if (runnerUpIndex >= 0) {
    const runnerUp = choices.sets[runnerUpIndex];
    const runnerUpDetail = details[runnerUpIndex];
    const reason =
      runnerUpDetail.weakSpotCount > detail.weakSpotCount
        ? `弱点が${runnerUpDetail.weakSpotCount}体と多い`
        : runnerUpDetail.superEffectiveCount < detail.superEffectiveCount
          ? `攻撃面で抜群が${runnerUpDetail.superEffectiveCount}体と少ない`
          : `総合スコアで劣る`;
    fragments.push(`次点の「${typeSetLabel(runnerUp)}」は${reason}。`);
  }
  return fragments.join('');
}

export type ExplanationInput =
  | { question: QuizQuestion; kind: 'attack'; details: AttackScoreDetail[]; correctChoiceIndexes: number[] }
  | { question: QuizQuestion; kind: 'candidate'; details: CandidateScoreDetail[]; correctChoiceIndexes: number[] };

export function generateExplanation(input: ExplanationInput): string {
  const firstCorrect = input.correctChoiceIndexes[0];
  if (firstCorrect == null) return '';
  if (input.kind === 'attack') {
    return describeAttack(input.question.choices, input.details, firstCorrect);
  }
  return describeCandidate(input.question.choices, input.details, firstCorrect);
}
