import clsx from 'clsx';
import type { TypeSet } from '../types/pokemon';
import { TYPE_LABEL_JA } from '../constants/types';
import { TypeChip } from './TypeChip';

type Props = {
  letter: string;
  types: TypeSet;
  onClick: () => void;
  state?: 'idle' | 'correct' | 'incorrect';
  disabled?: boolean;
};

export function CandidateCard({ letter, types, onClick, state = 'idle', disabled }: Props) {
  const labelText = types.secondary
    ? `${TYPE_LABEL_JA[types.primary]} / ${TYPE_LABEL_JA[types.secondary]}`
    : TYPE_LABEL_JA[types.primary];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${letter} ${labelText}を選択`}
      className={clsx(
        'bg-surface border p-3.5 flex items-center gap-3.5 w-full text-left transition-colors min-h-[56px]',
        state === 'idle' && 'border-border-base hover:border-accent active:border-accent',
        state === 'correct' && 'border-correct bg-correct-bg',
        state === 'incorrect' && 'border-incorrect bg-incorrect-bg',
        disabled && 'opacity-70 cursor-default',
      )}
    >
      <div className="w-8 h-8 border border-border-bright grid place-items-center font-mono font-bold text-[13px] text-accent shrink-0">
        {letter}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <TypeChip type={types.primary} />
        {types.secondary && <TypeChip type={types.secondary} />}
      </div>
    </button>
  );
}
