type Props = {
  logoMark?: string;
  title: string;
  meta?: string;
};

export function AppHeader({ logoMark = 'T', title, meta }: Props) {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-border-base shrink-0">
      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="w-[22px] h-[22px] bg-accent grid place-items-center text-bg font-mono font-bold text-xs rounded-[4px]"
        >
          {logoMark}
        </div>
        <div className="font-display text-sm tracking-wide">{title}</div>
      </div>
      {meta && (
        <div className="font-mono text-[10px] text-text-mute tracking-wider2">{meta}</div>
      )}
    </header>
  );
}
