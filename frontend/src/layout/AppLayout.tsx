import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <main className="app-shell">
      <section className="app-shell__content">{children}</section>
    </main>
  );
}
