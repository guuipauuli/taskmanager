import { httpClient } from '../../../core/http/httpClient';
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '../model/task';

const TASKS_PATH = '/api/tasks';

export const taskService = {
  list: () => httpClient.get<Task[]>(TASKS_PATH),
  create: (payload: CreateTaskPayload) => httpClient.post<Task>(TASKS_PATH, payload),
  update: (taskId: number, payload: UpdateTaskPayload) => httpClient.put<Task>(`${TASKS_PATH}/${taskId}`, payload),
  remove: (taskId: number) => httpClient.delete(`${TASKS_PATH}/${taskId}`),
};
