import { useEffect, useState, type FormEvent } from 'react';
import { AppButton } from '../../../shared/ui/actions/AppButton';
import { AppInput } from '../../../shared/ui/forms/AppInput';
import { AppSelect } from '../../../shared/ui/forms/AppSelect';
import { AppTextArea } from '../../../shared/ui/forms/AppTextArea';
import { AppModal } from '../../../shared/ui/overlay/AppModal';
import type { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from '../model/task';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'DONE', label: 'Concluida' },
];

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialTask: Task | null;
  isSubmitting: boolean;
  fieldErrors: Record<string, string>;
  onClose: () => void;
  onCreate: (payload: CreateTaskPayload) => Promise<boolean>;
  onUpdate: (taskId: number, payload: UpdateTaskPayload) => Promise<boolean>;
}

export function TaskFormModal({
  isOpen,
  mode,
  initialTask,
  isSubmitting,
  fieldErrors,
  onClose,
  onCreate,
  onUpdate,
}: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>({
    title: '',
    description: '',
    status: 'PENDING',
  });

  useEffect(() => {
    if (mode === 'edit' && initialTask) {
      setValues({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
      });
      return;
    }

    setValues({ title: '', description: '', status: 'PENDING' });
  }, [mode, initialTask, isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'edit' && initialTask) {
      await onUpdate(initialTask.id, {
        title: values.title,
        description: values.description,
        status: values.status,
      });
      return;
    }

    await onCreate({
      title: values.title,
      description: values.description,
    });
  };

  return (
    <AppModal isOpen={isOpen} title={mode === 'create' ? 'Nova Task' : 'Editar Task'} onClose={onClose}>
      <form className="task-form" onSubmit={(event) => void handleSubmit(event)}>
        <AppInput
          label="Titulo"
          errorMessage={fieldErrors.title}
          value={values.title}
          onChange={(event) => setValues((state) => ({ ...state, title: event.target.value }))}
          maxLength={200}
          required
        />
        <AppTextArea
          label="Descricao"
          errorMessage={fieldErrors.description}
          value={values.description}
          onChange={(event) => setValues((state) => ({ ...state, description: event.target.value }))}
          maxLength={1000}
          rows={4}
          required
        />
        <AppSelect
          label="Status"
          errorMessage={fieldErrors.status}
          value={values.status}
          onChange={(event) =>
            setValues((state) => ({ ...state, status: event.target.value as TaskStatus }))
          }
          options={STATUS_OPTIONS}
          disabled={mode === 'create'}
        />
        <div className="task-form__actions">
          <AppButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </AppButton>
          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Task' : 'Salvar Alteracoes'}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
}
