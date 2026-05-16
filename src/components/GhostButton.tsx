import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GhostButton({ children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        'py-3.5 px-4 bg-transparent border border-border-bright text-text-dim font-body font-bold text-xs cursor-pointer hover:border-accent hover:text-text-base transition-colors min-h-[44px]',
        className,
      )}
    >
      {children}
    </button>
  );
}
