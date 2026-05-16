import { useMemo } from 'react';
import type { Multiplier } from '../types/quiz';
import { TYPE_LABEL_JA } from '../constants/types';
import { AppHeader } from '../components/AppHeader';
import { GhostButton } from '../components/GhostButton';
import { MultiplierBadge } from '../components/MultiplierBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScoreCard } from '../components/ScoreCard';
import { TypeChip } from '../components/TypeChip';
import { VerdictBanner } from '../components/VerdictBanner';
import { useQuizFlow } from '../hooks/useQuizFlow';

export function ExplanationScreen() {
  const { state, next, goToResult } = useQuizFlow();
  const answer = state.lastAnswer;
  const questionNumber = useMemo(() => state.history.length, [state.history.length]);

  if (!answer) return null;
  const { question, correct, selectedChoiceIndex, correctChoiceIndexes, explanation } = answer;

  const firstCorrect = correctChoiceIndexes[0] ?? 0;

  const labels: string[] =
    question.choices.kind === 'attack'
      ? question.choices.types.map((t) => TYPE_LABEL_JA[t])
      : question.choices.sets.map((s) =>
          s.secondary
            ? `${TYPE_LABEL_JA[s.primary]} / ${TYPE_LABEL_JA[s.secondary]}`
            : TYPE_LABEL_JA[s.primary],
        );
  const userChoiceLabel = selectedChoiceIndex == null ? 'スキップ' : labels[selectedChoiceIndex];
  const correctChoiceLabels = correctChoiceIndexes.map((i) => labels[i]).join(' / ');

  // スコアカードのセル：モード別
  let scoreCells: { label: string; value: string | number; unit?: string; highlight?: boolean }[];
  if (question.choices.kind === 'attack' && answer.attackDetails) {
    const detail = answer.attackDetails[firstCorrect];
    scoreCells = [
      { label: 'SCORE', value: detail.total, unit: '/24', highlight: true },
      { label: '2× 抜群', value: detail.superEffectiveCount },
      { label: '無効・半減', value: detail.halvedOrLessCount },
    ];
  } else if (answer.candidateDetails) {
    const detail = answer.candidateDetails[firstCorrect];
    scoreCells = [
      { label: '総合', value: detail.total, highlight: true },
      { label: '攻撃面', value: detail.attack },
      { label: '防御面', value: detail.defense },
    ];
  } else {
    scoreCells = [];
  }

  // 倍率マトリクス
  const matrixRows = question.opponents.map((opp, i) => {
    let mult: Multiplier;
    if (question.choices.kind === 'attack' && answer.attackDetails) {
      mult = answer.attackDetails[firstCorrect].perOpponent[i];
    } else if (answer.candidateDetails) {
      mult = answer.candidateDetails[firstCorrect].attackPerOpponent[i];
    } else {
      mult = 1;
    }
    return { opponent: opp, multiplier: mult };
  });

  const matrixTitle =
    question.choices.kind === 'attack'
      ? `${TYPE_LABEL_JA[question.choices.types[firstCorrect]]}攻撃 × 相手6体`
      : `${labels[firstCorrect]} の攻撃 × 相手6体`;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader logoMark="?" title="解説" meta={`第${questionNumber}問`} />
      <div className="flex-1 px-5 py-5 pb-8 max-w-md mx-auto w-full flex flex-col">
        <VerdictBanner
          correct={correct}
          userChoiceLabel={userChoiceLabel}
          correctChoiceLabel={correctChoiceLabels}
        />

        <div className="mt-5 mb-4">
          <ScoreCard cells={scoreCells} />
        </div>

        <div className="bg-surface border border-border-base mb-4 overflow-hidden">
          <div className="flex justify-between items-center px-3.5 py-3 border-b border-border-base">
            <div className="font-mono text-[10px] tracking-wider2 text-text-dim">
              {matrixTitle}
            </div>
            <div className="font-mono text-[10px] text-accent">↓ 倍率</div>
          </div>
          {matrixRows.map((row, i) => (
            <div
              key={i}
              className="grid items-center gap-2.5 px-3.5 py-2.5 border-b border-border-base last:border-b-0"
              style={{ gridTemplateColumns: '1fr auto' }}
            >
              <div className="flex gap-1 items-center flex-wrap">
                <span className="font-mono text-[10px] text-text-mute w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <TypeChip type={row.opponent.primary} />
                {row.opponent.secondary && <TypeChip type={row.opponent.secondary} />}
              </div>
              <MultiplierBadge value={row.multiplier} />
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border-base border-l-[3px] border-l-accent px-3.5 py-3 text-[13px] leading-relaxed text-text-dim mb-4">
          {explanation}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <PrimaryButton onClick={next}>
            次の問題
            <span aria-hidden="true" className="font-mono font-bold">
              →
            </span>
          </PrimaryButton>
          <GhostButton onClick={goToResult}>成績を見る</GhostButton>
        </div>
      </div>
    </div>
  );
}
