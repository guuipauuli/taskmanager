import { AppButton } from '../../../shared/ui/actions/AppButton';
import { BodyText } from '../../../shared/ui/typography/BodyText';

interface TasksToolbarProps {
  total: number;
  onCreate: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function TasksToolbar({ total, onCreate, onRefresh, isLoading }: TasksToolbarProps) {
  return (
    <div className="tasks-toolbar">
      <BodyText>Total de tasks: {total}</BodyText>
      <div className="tasks-toolbar__actions">
        <AppButton variant="secondary" onClick={onRefresh} disabled={isLoading}>
          Atualizar
        </AppButton>
        <AppButton onClick={onCreate}>Nova Task</AppButton>
      </div>
    </div>
  );
}
