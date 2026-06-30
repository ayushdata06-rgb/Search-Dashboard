import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NavBar } from '@/components/marketing/NavBar';
import { Spinner } from '@/components/ui/Spinner';

const CoverPage = lazy(() => import('@/pages/CoverPage').then(m => ({ default: m.CoverPage })));
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const DashboardApp = lazy(() => import('@/pages/DashboardApp').then(m => ({ default: m.DashboardApp })));

function PageWrapper({ children, showNav = true }: { children: React.ReactNode, showNav?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="min-h-screen bg-[var(--bg-base)] flex flex-col"
    >
      {showNav && <NavBar />}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
        <Route
          path="/"
          element={
            <PageWrapper showNav={true}>
              <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center"><Spinner size="lg" /></div>}>
                <CoverPage />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="/features"
          element={
            <PageWrapper showNav={true}>
              <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center"><Spinner size="lg" /></div>}>
                <FeaturesPage />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <PageWrapper showNav={false}>
              <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center"><Spinner size="lg" /></div>}>
                <DashboardApp />
              </Suspense>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
