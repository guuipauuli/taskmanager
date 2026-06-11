import { useEffect, useState } from 'react';
import { notificationService, type NotificationToast } from '../services/notificationService';

export function useNotifications() {
  const [toasts, setToasts] = useState<NotificationToast[]>(() => notificationService.getToasts());

  useEffect(() => {
    return notificationService.subscribe(setToasts);
  }, []);

  return {
    toasts,
    dismissToast: notificationService.remove,
  };
}