import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { DashboardPage } from '@/pages/DashboardPage';
import { Spinner } from '@/components/ui/Spinner';

const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((mod) => ({ default: mod.ProfilePage }))
);

export function DashboardApp() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route
        path="/profile/:username"
        element={
          <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center"><Spinner size="lg" /></div>}>
            <ProfilePage />
          </Suspense>
        }
      />
    </Routes>
  );
}
