import clsx from 'clsx';
import type { Difficulty, Mode } from '../types/quiz';
import { AppHeader } from '../components/AppHeader';
import { Disclaimer } from '../components/Disclaimer';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionLabel } from '../components/SectionLabel';
import { useQuizFlow } from '../hooks/useQuizFlow';

const MODES: { mode: Mode; icon: string; title: string; sub: string }[] = [
  {
    mode: 'attack-coverage',
    icon: 'A',
    title: '攻撃有利モード',
    sub: '相手6体に最も通る攻撃タイプを選ぶ',
  },
  {
    mode: 'candidate-selection',
    icon: 'B',
    title: '候補ポケモン選択',
    sub: '攻守両面で最も有利な候補を選ぶ',
  },
];

const DIFFICULTIES: { id: Difficulty; ja: string; en: string }[] = [
  { id: 'easy', ja: 'かんたん', en: 'EASY' },
  { id: 'normal', ja: 'ふつう', en: 'NORMAL' },
  { id: 'hard', ja: 'むずかしい', en: 'HARD' },
];

export function TopScreen() {
  const { state, setMode, setDifficulty, start } = useQuizFlow();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="タイプトレーナー" meta="v1.0" />
      <div className="flex-1 px-5 py-6 pb-12 max-w-md mx-auto w-full">
        <div className="text-center pt-2 pb-8">
          <div className="font-mono text-[10px] tracking-widest3 text-accent mb-3">
            TYPE MATCHUP TRAINER
          </div>
          <h1 className="font-display text-[34px] leading-none mb-1">
            タイプ相性
            <br />
            トレーナー
          </h1>
          <div className="font-mono text-[10px] text-text-mute tracking-widest2 mb-4">
            — 18 TYPES —
          </div>
          <p className="text-[13px] text-text-dim leading-relaxed max-w-[280px] mx-auto">
            相手の手持ち6体に対して
            <br />
            最も有利な選出を瞬間判断する練習
          </p>
        </div>

        <SectionLabel text="モード選択" count="01 / 02" />
        <div className="grid gap-2.5">
          {MODES.map((m) => {
            const active = state.mode === m.mode;
            return (
              <button
                key={m.mode}
                type="button"
                onClick={() => setMode(m.mode)}
                aria-pressed={active}
                className={clsx(
                  'border p-4 flex items-start gap-3.5 text-left transition-colors relative min-h-[64px]',
                  active
                    ? 'border-accent bg-accent/[0.04]'
                    : 'border-border-base bg-surface hover:border-border-bright',
                )}
              >
                <div className="w-9 h-9 border border-border-bright grid place-items-center font-mono font-bold text-sm text-accent shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="font-display text-[15px] mb-1">{m.title}</div>
                  <div className="text-[11px] text-text-dim leading-snug">{m.sub}</div>
                </div>
                {active && (
                  <div
                    aria-hidden="true"
                    className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>

        <SectionLabel text="難易度" count="02 / 02" />
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => {
            const active = state.difficulty === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                aria-pressed={active}
                className={clsx(
                  'border py-3.5 px-2 text-center transition-colors min-h-[60px]',
                  active
                    ? 'border-accent bg-accent/[0.04]'
                    : 'border-border-base bg-surface hover:border-border-bright',
                )}
              >
                <div className="font-display text-sm mb-0.5">{d.ja}</div>
                <div
                  className={clsx(
                    'font-mono text-[9px] tracking-wider2',
                    active ? 'text-accent' : 'text-text-mute',
                  )}
                >
                  {d.en}
                </div>
              </button>
            );
          })}
        </div>

        <PrimaryButton className="mt-7" onClick={start}>
          <span>スタート</span>
          <span aria-hidden="true" className="font-mono font-bold">
            →
          </span>
        </PrimaryButton>

        <Disclaimer className="mt-5" />
      </div>
    </div>
  );
}
