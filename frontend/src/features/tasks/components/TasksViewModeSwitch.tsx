import { AppButton } from '../../../shared/ui/actions/AppButton';

export type TasksViewMode = 'table' | 'board';

interface TasksViewModeSwitchProps {
  mode: TasksViewMode;
  onChangeMode: (mode: TasksViewMode) => void;
}

export function TasksViewModeSwitch({ mode, onChangeMode }: TasksViewModeSwitchProps) {
  return (
    <div className="tasks-view-mode" role="group" aria-label="Modo de visualizacao de tasks">
      <AppButton
        variant={mode === 'table' ? 'primary' : 'secondary'}
        onClick={() => onChangeMode('table')}
      >
        Tabela
      </AppButton>
      <AppButton
        variant={mode === 'board' ? 'primary' : 'secondary'}
        onClick={() => onChangeMode('board')}
      >
        Raias
      </AppButton>
    </div>
  );
}
