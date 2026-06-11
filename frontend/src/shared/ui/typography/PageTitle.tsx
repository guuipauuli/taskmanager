import type { PropsWithChildren } from 'react';

export function PageTitle({ children }: PropsWithChildren) {
  return <h1 className="page-title">{children}</h1>;
}
