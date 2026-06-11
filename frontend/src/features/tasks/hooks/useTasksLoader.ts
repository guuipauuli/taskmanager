import { useCallback } from 'react';
import { useEntityCrudLoader } from '../../../core/hooks/useEntityCrudLoader';
import { taskService } from '../services/taskService';
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '../model/task';

export function useTasksLoader() {
  const listTasks = useCallback(() => taskService.list(), []);
  const { items: tasks, status, isSubmitting, errorMessage, fieldErrors, load, runMutation } =
    useEntityCrudLoader<Task>(listTasks);

  const createTask = useCallback(
    (payload: CreateTaskPayload) => runMutation(() => taskService.create(payload)),
    [runMutation]
  );

  const updateTask = useCallback(
    (taskId: number, payload: UpdateTaskPayload) => runMutation(() => taskService.update(taskId, payload)),
    [runMutation]
  );

  const deleteTask = useCallback(
    (taskId: number) => runMutation(() => taskService.remove(taskId)),
    [runMutation]
  );

  return {
    tasks,
    status,
    isSubmitting,
    errorMessage,
    fieldErrors,
    load,
    createTask,
    updateTask,
    deleteTask,
  };
}
