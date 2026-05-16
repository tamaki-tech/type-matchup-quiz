type Props = {
  className?: string;
};

export function SupportFooter({ className }: Props) {
  return (
    <div
      className={`text-center text-[10px] text-text-mute leading-relaxed ${className ?? ''}`}
    >
      <a
        href="https://buymeacoffee.com/tkmkn2021"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buy Me a Coffee で開発者を応援"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-border-base hover:border-text-mute transition-colors no-underline text-text-dim"
      >
        <span aria-hidden="true" className="text-sm leading-none">
          ☕
        </span>
        <span className="tracking-wider">開発者にコーヒーをおごる</span>
      </a>
    </div>
  );
}
