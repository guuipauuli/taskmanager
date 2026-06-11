import { useEffect } from 'react';
import { setHttpErrorHandler } from './core/http/httpClient';
import { notificationService } from './core/services/notificationService';
import { AppLayout } from './layout/AppLayout';
import { TasksPage } from './features/tasks/pages/TasksPage';
import { NotificationHost } from './shared/ui/feedback/NotificationHost';

export default function App() {
  useEffect(() => {
    setHttpErrorHandler((error) => {
      notificationService.error(error.message);
    });
  }, []);

  return (
    <AppLayout>
      <TasksPage />
      <NotificationHost />
    </AppLayout>
  );
}
