import { AppHeader } from '../components/AppHeader';
import { CandidateCard } from '../components/CandidateCard';
import { ChoiceButton } from '../components/ChoiceButton';
import { GhostButton } from '../components/GhostButton';
import { OpponentCell } from '../components/OpponentCell';
import { SectionLabel } from '../components/SectionLabel';
import { StreakBadge } from '../components/StreakBadge';
import { useQuizFlow } from '../hooks/useQuizFlow';
import { ROUND_LENGTH } from '../state/sessionReducer';

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizScreen() {
  const { state, submit, skip } = useQuizFlow();
  const question = state.currentQuestion;

  const questionNumber = state.roundAnswered + 1;
  const progressPct = Math.min(100, (state.roundAnswered / ROUND_LENGTH) * 100);

  if (!question) {
    return null;
  }

  const modeLabel = question.mode === 'attack-coverage' ? '攻撃有利モード' : '候補ポケモン選択';
  const modeIcon = question.mode === 'attack-coverage' ? 'A' : 'B';
  const difficultyLabel = ({ easy: 'EASY', normal: 'NORMAL', hard: 'HARD' } as const)[
    question.difficulty
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={modeLabel} logoMark={modeIcon} meta={difficultyLabel} />
      <div className="flex-1 px-5 py-5 pb-8 max-w-md mx-auto w-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <StreakBadge value={state.streak} />
          <div className="font-mono text-[11px] text-text-dim px-2.5 py-1.5 bg-surface-2 border border-border-base">
            <span className="text-text-base font-bold">{questionNumber}</span>
            <span className="text-text-mute"> / {ROUND_LENGTH}</span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="h-1 bg-surface-2 border-l border-r border-b border-border-base mb-4 overflow-hidden"
        >
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mb-4">
          <div className="font-display text-lg leading-snug mb-1">
            {question.mode === 'attack-coverage' ? (
              <>
                相手6体に最も通る
                <br />
                攻撃タイプは？
              </>
            ) : (
              <>
                相手6体に最も有利な
                <br />
                候補は？
              </>
            )}
          </div>
          <div className="text-[11px] text-text-dim">タップして回答</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {question.opponents.map((o, i) => (
            <OpponentCell key={i} index={i} typeSet={o} />
          ))}
        </div>

        {question.choices.kind === 'attack' ? (
          <>
            <SectionLabel text="候補タイプ" count="A — D" />
            <div className="grid grid-cols-2 gap-2">
              {question.choices.types.map((t, i) => (
                <ChoiceButton
                  key={i}
                  letter={LETTERS[i]}
                  type={t}
                  onClick={() => submit(i)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionLabel
              text="候補ポケモン"
              count={`A — ${LETTERS[question.choices.sets.length - 1]}`}
            />
            <div className="flex flex-col gap-2.5">
              {question.choices.sets.map((s, i) => (
                <CandidateCard
                  key={i}
                  letter={LETTERS[i]}
                  types={s}
                  onClick={() => submit(i)}
                />
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2 pt-3 mt-auto border-t border-border-base">
          <GhostButton className="flex-1" onClick={skip}>
            スキップ
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
