type Cell = {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
};

type Props = {
  cells: Cell[];
};

export function ScoreCard({ cells }: Props) {
  return (
    <div
      className="grid gap-px bg-border-base border border-border-base"
      style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
    >
      {cells.map((c, i) => (
        <div key={i} className="bg-surface px-2.5 py-3.5 text-center">
          <div className="font-mono text-[9px] text-text-mute tracking-wider2 uppercase mb-1.5">
            {c.label}
          </div>
          <div
            className={`font-mono text-[22px] font-bold leading-none ${
              c.highlight ? 'text-accent' : 'text-text-base'
            }`}
          >
            {c.value}
            {c.unit && <span className="text-[10px] text-text-mute ml-0.5">{c.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
