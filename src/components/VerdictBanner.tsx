import clsx from 'clsx';

type Props = {
  correct: boolean;
  userChoiceLabel: string;
  correctChoiceLabel: string;
};

export function VerdictBanner({ correct, userChoiceLabel, correctChoiceLabel }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'border p-4 flex items-center gap-3.5',
        correct ? 'border-correct bg-correct-bg' : 'border-incorrect bg-incorrect-bg',
      )}
    >
      <div
        aria-hidden="true"
        className={clsx(
          'w-9 h-9 border-2 grid place-items-center font-mono font-bold text-lg shrink-0',
          correct ? 'border-correct text-correct' : 'border-incorrect text-incorrect',
        )}
      >
        {correct ? '✓' : '✕'}
      </div>
      <div className="flex-1">
        <div className="font-display text-base mb-0.5">{correct ? '正解' : '不正解'}</div>
        <div className="text-[11px] text-text-dim">
          あなたの回答：{userChoiceLabel} / 正解：{correctChoiceLabel}
        </div>
      </div>
    </div>
  );
}
