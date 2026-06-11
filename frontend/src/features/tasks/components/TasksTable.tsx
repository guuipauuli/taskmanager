import { AppButton } from '../../../shared/ui/actions/AppButton';
import { BodyText } from '../../../shared/ui/typography/BodyText';
import { TASK_STATUS_LABEL } from '../model/taskStatus';
import type { Task } from '../model/task';

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TasksTable({ tasks, onEdit, onDelete }: TasksTableProps) {
  if (tasks.length === 0) {
    return <BodyText>Nenhuma task cadastrada ate o momento.</BodyText>;
  }

  return (
    <div className="tasks-table__wrapper">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Descricao</th>
            <th>Status</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{TASK_STATUS_LABEL[task.status]}</td>
              <td className="tasks-table__actions">
                <AppButton variant="secondary" onClick={() => onEdit(task)}>
                  Editar
                </AppButton>
                <AppButton variant="danger" onClick={() => onDelete(task)}>
                  Excluir
                </AppButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
