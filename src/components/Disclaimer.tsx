type Props = {
  className?: string;
};

export function Disclaimer({ className }: Props) {
  return (
    <div
      className={
        `border border-dashed border-border-base text-[10px] text-text-mute text-center leading-relaxed p-2.5 ${className ?? ''}`
      }
    >
      これは非公式のファンメイドツールです。
      <br />
      株式会社ポケモン・任天堂とは関係ありません。
    </div>
  );
}
