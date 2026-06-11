import type { TaskStatus } from './task';

export const TASK_STATUS_ORDER: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluida',
};

export function nextTaskStatus(status: TaskStatus): TaskStatus | null {
  if (status === 'PENDING') {
    return 'IN_PROGRESS';
  }

  if (status === 'IN_PROGRESS') {
    return 'DONE';
  }

  return null;
}

export function previousTaskStatus(status: TaskStatus): TaskStatus | null {
  if (status === 'DONE') {
    return 'IN_PROGRESS';
  }

  if (status === 'IN_PROGRESS') {
    return 'PENDING';
  }

  return null;
}
