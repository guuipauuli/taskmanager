import type { PropsWithChildren } from 'react';

interface StatusBadgeProps extends PropsWithChildren {
  tone?: 'success' | 'error' | 'neutral';
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className="status-badge" data-tone={tone}>
      {children}
    </span>
  );
}
