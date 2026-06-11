import { useNotifications } from '../../../core/hooks/useNotifications';
import { ToastStack } from './ToastStack';

export function NotificationHost() {
  const { toasts, dismissToast } = useNotifications();
  return <ToastStack toasts={toasts} onDismiss={dismissToast} />;
}