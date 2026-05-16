import type { TypeSet } from '../types/pokemon';
import { TypeChip } from './TypeChip';

type Props = {
  index: number;
  typeSet: TypeSet;
};

export function OpponentCell({ index, typeSet }: Props) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className="relative bg-surface border border-border-base px-3 py-2.5">
      <span className="absolute top-1.5 right-2 font-mono text-[9px] text-text-mute">
        {num}
      </span>
      <div className="flex flex-col gap-1 pt-2 items-start">
        <TypeChip type={typeSet.primary} />
        {typeSet.secondary && <TypeChip type={typeSet.secondary} />}
      </div>
    </div>
  );
}
