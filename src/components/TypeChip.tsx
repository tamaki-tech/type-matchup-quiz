import clsx from 'clsx';
import type { PokemonType } from '../types/pokemon';
import { TYPE_BG_CLASS, TYPE_LABEL_JA, TYPE_USES_WHITE_TEXT } from '../constants/types';

type Props = {
  type: PokemonType;
  className?: string;
};

export function TypeChip({ type, className }: Props) {
  const bg = TYPE_BG_CLASS[type];
  const usesWhite = TYPE_USES_WHITE_TEXT[type];
  return (
    <span
      role="img"
      aria-label={`タイプ：${TYPE_LABEL_JA[type]}`}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-bold text-xs leading-none tracking-wide font-body',
        bg,
        usesWhite ? 'text-white' : 'text-black/85',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'w-1.5 h-1.5 rounded-full shrink-0',
          usesWhite ? 'bg-white/50' : 'bg-black/40',
        )}
      />
      {TYPE_LABEL_JA[type]}
    </span>
  );
}
