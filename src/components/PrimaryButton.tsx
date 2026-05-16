import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({ children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        'w-full py-4 bg-accent text-bg border-0 font-display text-base tracking-wider cursor-pointer flex items-center justify-center gap-2.5 hover:bg-accent-dim active:bg-accent-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}
