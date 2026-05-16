import clsx from 'clsx';
import type { PokemonType } from '../types/pokemon';
import { TYPE_LABEL_JA } from '../constants/types';
import { TypeChip } from './TypeChip';

type Props = {
  letter: string;
  type: PokemonType;
  onClick: () => void;
  state?: 'idle' | 'correct' | 'incorrect';
  disabled?: boolean;
};

export function ChoiceButton({ letter, type, onClick, state = 'idle', disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${letter} ${TYPE_LABEL_JA[type]}を選択`}
      className={clsx(
        'bg-surface border p-0 relative overflow-hidden text-left transition-colors min-h-[64px]',
        state === 'idle' && 'border-border-base hover:border-accent active:border-accent',
        state === 'correct' && 'border-correct bg-correct-bg',
        state === 'incorrect' && 'border-incorrect bg-incorrect-bg',
        disabled && 'opacity-70 cursor-default',
      )}
    >
      <div className="px-2.5 py-3.5 flex flex-col items-start gap-1.5">
        <span className="font-mono text-[10px] text-text-mute tracking-wider2">{letter}</span>
        <TypeChip type={type} />
      </div>
    </button>
  );
}
