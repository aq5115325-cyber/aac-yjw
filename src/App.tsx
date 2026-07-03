import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLoading from './components/AppLoading';
import { loadExercises } from './data/exercises';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import PlanDetailPage from './pages/PlanDetailPage';
import WorkoutPage from './pages/WorkoutPage';
import NotFoundPage from './pages/NotFoundPage';
import ImportPlanPage from './pages/ImportPlanPage';

// 路由级代码拆分（非核心页面）
const Layout = lazy(() => import('./components/Layout'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

/** 路由切换时显示的骨架屏 */
function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="space-y-3 w-full max-w-sm px-4">
        <div className="h-8 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-800 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-800 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function App() {
  const [dataReady, setDataReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises()
      .then(() => setDataReady(true))
      .catch((err) => {
        console.error('Failed to load exercises:', err);
        setError('动作数据加载失败，请刷新页面重试');
      });
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 px-6 text-center gap-4">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-lg font-bold text-white">数据加载失败</h1>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-indigo-500 rounded-xl text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          刷新页面
        </button>
      </div>
    );
  }

  if (!dataReady) {
    return <AppLoading />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading />}>
        <Layout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/plans" element={<HomePage />} />
              <Route path="/plan/import" element={<ImportPlanPage />} />
              <Route path="/plan/new" element={<PlanDetailPage />} />
              <Route path="/plan/edit/:id" element={<PlanDetailPage />} />
              <Route path="/plan/:id" element={<PlanDetailPage />} />
              <Route path="/workout/:id" element={<WorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
}
