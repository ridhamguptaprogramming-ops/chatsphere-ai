import { AppRoutes } from '@/routes/AppRoutes';
import { SettingsWatcher } from '@/features/settings/components/SettingsWatcher';

export default function App() {
  return (
    <>
      <SettingsWatcher />
      <AppRoutes />
    </>
  );
}

