import { AppLayout } from './layout/AppLayout';
import { TasksPage } from './features/tasks/pages/TasksPage';

export default function App() {
  return (
    <AppLayout>
      <TasksPage />
    </AppLayout>
  );
}
