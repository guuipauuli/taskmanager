import type { PropsWithChildren } from 'react';

interface BodyTextProps extends PropsWithChildren {
  tone?: 'default' | 'error';
}

export function BodyText({ children, tone = 'default' }: BodyTextProps) {
  return (
    <p className="body-text" data-tone={tone}>
      {children}
    </p>
  );
}
