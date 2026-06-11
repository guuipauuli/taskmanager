import type { PropsWithChildren } from 'react';
import { AppButton } from '../actions/AppButton';

interface AppModalProps extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AppModal({ title, isOpen, onClose, children }: AppModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="app-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="app-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="app-modal__header">
          <h2 className="app-modal__title">{title}</h2>
          <AppButton variant="secondary" onClick={onClose}>
            Fechar
          </AppButton>
        </header>
        <div className="app-modal__content">{children}</div>
      </div>
    </div>
  );
}
