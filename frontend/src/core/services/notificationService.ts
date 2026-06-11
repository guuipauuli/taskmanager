export type NotificationTone = 'error' | 'success' | 'info';

export interface NotificationToast {
  id: number;
  message: string;
  tone: NotificationTone;
}

type NotificationListener = (toasts: NotificationToast[]) => void;

const listeners = new Set<NotificationListener>();
let toasts: NotificationToast[] = [];

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function push(message: string, tone: NotificationTone, timeoutMs = 4200) {
  const id = Date.now() + Math.floor(Math.random() * 1000);
  toasts = [...toasts, { id, message, tone }];
  emit();

  window.setTimeout(() => {
    remove(id);
  }, timeoutMs);

  return id;
}

function remove(id: number) {
  const nextToasts = toasts.filter((toast) => toast.id !== id);
  if (nextToasts.length === toasts.length) {
    return;
  }
  toasts = nextToasts;
  emit();
}

function subscribe(listener: NotificationListener) {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}

function getToasts() {
  return toasts;
}

export const notificationService = {
  subscribe,
  getToasts,
  remove,
  info: (message: string, timeoutMs?: number) => push(message, 'info', timeoutMs),
  success: (message: string, timeoutMs?: number) => push(message, 'success', timeoutMs),
  error: (message: string, timeoutMs?: number) => push(message, 'error', timeoutMs),
};