type Props = {
  value: number;
};

export function StreakBadge({ value }: Props) {
  return (
    <div
      aria-label={`連続正解 ${value}`}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border-base"
    >
      <span aria-hidden="true" className="text-accent text-xs">
        ▲
      </span>
      <span className="font-mono font-bold text-[13px]">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] text-text-dim">連続正解</span>
    </div>
  );
}
