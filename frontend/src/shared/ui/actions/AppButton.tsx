import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant;
}

export function AppButton({ children, variant = 'primary', className, ...props }: AppButtonProps) {
  const classes = ['app-button', `app-button--${variant}`, className].filter(Boolean).join(' ');
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
