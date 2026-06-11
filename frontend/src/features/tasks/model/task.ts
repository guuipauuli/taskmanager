export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
}

export interface UpdateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}
