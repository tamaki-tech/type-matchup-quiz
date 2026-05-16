import clsx from 'clsx';
import type { Multiplier } from '../types/quiz';

type Props = {
  value: Multiplier;
};

const MULTIPLIER_LABEL: Record<Multiplier, string> = {
  4: 'ばつぐん',
  2: 'ばつぐん',
  1: 'とおる',
  0.5: 'いまひとつ',
  0.25: 'いまひとつ',
  0: 'こうかなし',
};

const MULTIPLIER_DISPLAY: Record<Multiplier, string> = {
  4: '4×',
  2: '2×',
  1: '1×',
  0.5: '0.5×',
  0.25: '0.25×',
  0: '0×',
};

function multClass(value: Multiplier): string {
  if (value === 4) return 'bg-incorrect/20 text-incorrect border border-incorrect/40';
  if (value === 2) return 'bg-incorrect/10 text-incorrect/90 border border-incorrect/25';
  if (value === 1) return 'bg-surface-3 text-text-dim border border-border-base';
  if (value === 0.5) return 'bg-correct/10 text-correct/90 border border-correct/25';
  if (value === 0.25) return 'bg-correct/20 text-correct border border-correct/40';
  return 'bg-accent/20 text-accent border border-accent/40';
}

export function MultiplierBadge({ value }: Props) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-body font-medium text-[9px] text-text-mute min-w-[44px] text-right">
        {MULTIPLIER_LABEL[value]}
      </span>
      <span
        className={clsx(
          'font-mono font-bold text-[13px] px-2 py-0.5 min-w-[50px] text-center',
          multClass(value),
        )}
      >
        {MULTIPLIER_DISPLAY[value]}
      </span>
    </span>
  );
}
