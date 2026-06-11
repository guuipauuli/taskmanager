import { AppButton } from '../../../shared/ui/actions/AppButton';
import { BodyText } from '../../../shared/ui/typography/BodyText';
import { TASK_STATUS_LABEL, TASK_STATUS_ORDER, nextTaskStatus, previousTaskStatus } from '../model/taskStatus';
import type { Task, TaskStatus } from '../model/task';

interface TasksBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, newStatus: TaskStatus) => void;
}

export function TasksBoard({ tasks, onEdit, onDelete, onMove }: TasksBoardProps) {
  if (tasks.length === 0) {
    return <BodyText>Nenhuma task cadastrada ate o momento.</BodyText>;
  }

  return (
    <div className="tasks-board">
      {TASK_STATUS_ORDER.map((status) => {
        const laneTasks = tasks.filter((task) => task.status === status);

        return (
          <section key={status} className="tasks-lane">
            <header className="tasks-lane__header">
              <h3>{TASK_STATUS_LABEL[status]}</h3>
              <span>{laneTasks.length}</span>
            </header>

            <div className="tasks-lane__content">
              {laneTasks.length === 0 ? <BodyText>Sem tasks nesta raia.</BodyText> : null}
              {laneTasks.map((task) => {
                const previousStatus = previousTaskStatus(task.status);
                const nextStatus = nextTaskStatus(task.status);

                return (
                  <article key={task.id} className="task-card">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-card__actions">
                      <AppButton variant="secondary" onClick={() => onEdit(task)}>
                        Editar
                      </AppButton>
                      <AppButton variant="danger" onClick={() => onDelete(task)}>
                        Excluir
                      </AppButton>
                    </div>
                    <div className="task-card__flow-actions">
                      <AppButton
                        variant="secondary"
                        onClick={() => previousStatus && onMove(task, previousStatus)}
                        disabled={!previousStatus}
                      >
                        Mover para tras
                      </AppButton>
                      <AppButton
                        variant="secondary"
                        onClick={() => nextStatus && onMove(task, nextStatus)}
                        disabled={!nextStatus}
                      >
                        Mover para frente
                      </AppButton>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
