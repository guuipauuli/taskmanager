import type { PropsWithChildren } from 'react';

interface PageSectionProps extends PropsWithChildren {
  className?: string;
}

export function PageSection({ children, className }: PageSectionProps) {
  const classes = ['page-section', className].filter(Boolean).join(' ');
  return <section className={classes}>{children}</section>;
}
