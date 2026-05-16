type Props = {
  text: string;
  count?: string;
};

export function SectionLabel({ text, count }: Props) {
  return (
    <div className="flex items-center gap-2.5 mt-7 mb-3">
      <span aria-hidden="true" className="w-1.5 h-1.5 bg-accent rotate-45" />
      <span className="font-mono text-[10px] tracking-widest2 text-text-dim uppercase">
        {text}
      </span>
      {count && (
        <span className="ml-auto font-mono text-[10px] text-text-mute">{count}</span>
      )}
    </div>
  );
}
