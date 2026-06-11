import { useEffect, useState } from 'react';
import { useTasksLoader } from '../hooks/useTasksLoader';
import { StatusBadge } from '../../../shared/ui/feedback/StatusBadge';
import { PageSection } from '../../../shared/ui/layout/PageSection';
import { BodyText } from '../../../shared/ui/typography/BodyText';
import { PageTitle } from '../../../shared/ui/typography/PageTitle';
import { TaskFormModal } from '../components/TaskFormModal';
import { TasksBoard } from '../components/TasksBoard';
import { TasksTable } from '../components/TasksTable';
import { TasksToolbar } from '../components/TasksToolbar';
import { TasksViewModeSwitch, type TasksViewMode } from '../components/TasksViewModeSwitch';
import type { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from '../model/task';

const DEBUG_TASKS_PAGE = false;

export function TasksPage() {
  const {
    tasks,
    status,
    isSubmitting,
    fieldErrors,
    load,
    createTask,
    updateTask,
    deleteTask,
  } = useTasksLoader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<TasksViewMode>('table');

  useEffect(() => {
    if (DEBUG_TASKS_PAGE) {
      console.info('[TasksPage] mount -> initial load');
    }
    void load();

    return () => {
      if (DEBUG_TASKS_PAGE) {
        console.info('[TasksPage] unmount');
      }
    };
  }, []);

  const handleCreate = () => {
    setModalMode('create');
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (task: Task) => {
    const shouldDelete = window.confirm(`Deseja excluir a task "${task.title}"?`);
    if (!shouldDelete) {
      return;
    }
    await deleteTask(task.id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleMoveTask = async (task: Task, newStatus: TaskStatus) => {
    await updateTask(task.id, {
      title: task.title,
      description: task.description,
      status: newStatus,
    });
  };

  const handleCreateSubmit = async (payload: CreateTaskPayload): Promise<boolean> => {
    if (DEBUG_TASKS_PAGE) {
      console.info('[TasksPage] create submit');
    }
    const success = await createTask(payload);
    if (success) {
      handleCloseModal();
    }
    return success;
  };

  const handleUpdateSubmit = async (taskId: number, payload: UpdateTaskPayload): Promise<boolean> => {
    if (DEBUG_TASKS_PAGE) {
      console.info('[TasksPage] update submit', { taskId });
    }
    const success = await updateTask(taskId, payload);
    if (success) {
      handleCloseModal();
    }
    return success;
  };

  const statusTone =
    status === 'error' ? 'error' : status === 'loading' || status === 'idle' ? 'neutral' : 'success';

  return (
    <PageSection className="tasks-page">
      <PageTitle>Task Manager</PageTitle>
      <BodyText>Fluxo CRUD por componentes com estrutura modular.</BodyText>
      <TasksToolbar total={tasks.length} onCreate={handleCreate} onRefresh={() => void load()} isLoading={status === 'loading'} />
      <TasksViewModeSwitch mode={viewMode} onChangeMode={setViewMode} />
      <BodyText>
        Status geral:{' '}
        <StatusBadge tone={statusTone}>
          {status}
        </StatusBadge>
      </BodyText>
      {viewMode === 'table' ? (
        <TasksTable tasks={tasks} onEdit={handleEdit} onDelete={(task) => void handleDelete(task)} />
      ) : (
        <TasksBoard
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={(task) => void handleDelete(task)}
          onMove={(task, newStatus) => void handleMoveTask(task, newStatus)}
        />
      )}
      <TaskFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialTask={selectedTask}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onClose={handleCloseModal}
        onCreate={handleCreateSubmit}
        onUpdate={handleUpdateSubmit}
      />
    </PageSection>
  );
}
