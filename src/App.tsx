import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import PlatformaPage from './pages/PlatformaPage';
import ContactPage from './pages/ContactPage';
import ManifestoPage from './pages/ManifestoPage';
import GlossaryPage from './pages/GlossaryPage';
import AboutPage from './pages/AboutPage';
import EcosystemPage from './pages/EcosystemPage';
import AcademyPage from './pages/AcademyPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AcademyLoginPage from './pages/AcademyLoginPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const OrientoAcademyPage = lazy(() => import('./pages/OrientoAcademyPage'));
const PedagogicPanelPage = lazy(() => import('./pages/PedagogicPanelPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const FrameworksPage = lazy(() => import('./pages/FrameworksPage'));
const FrameworkGamePage = lazy(() => import('./pages/FrameworkGamePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const JourneyPage = lazy(() => import('./pages/JourneyPage'));
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const FounderDashboardPage = lazy(() => import('./pages/FounderDashboardPage'));

// Auth
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FounderRoute from './components/auth/FounderRoute';
import FounderDashboardRoute from './components/auth/FounderDashboardRoute';
import ProtectedRouteSkeleton from './components/auth/ProtectedRouteSkeleton';

const PublicLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="h-10 w-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
  </div>
);

const withProtectedSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<ProtectedRouteSkeleton />}>{element}</Suspense>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { initAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      await initAuth();
      setIsLoading(false);
    };

    init();
  }, [initAuth]);

  if (isLoading) {
    return location.pathname.startsWith('/dashboard') ? (
      <ProtectedRouteSkeleton />
    ) : (
      <PublicLoadingFallback />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/plataforma" element={<PlatformaPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="manifesto" element={<ManifestoPage />} />
          <Route path="glossario" element={<GlossaryPage />} />
          <Route path="ecossistema" element={<EcosystemPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/academy/login" element={<AcademyLoginPage />} />
          <Route path="planos" element={<PricingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="termos" element={<TermsPage />} />
          <Route path="privacidade" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
        </Route>

        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withProtectedSuspense(<DashboardPage />)} />
          <Route path="insights" element={withProtectedSuspense(<InsightsPage />)} />
          <Route path="frameworks" element={withProtectedSuspense(<FrameworksPage />)} />
          <Route path="frameworks/:id/game" element={withProtectedSuspense(<FrameworkGamePage />)} />
          <Route path="projects" element={withProtectedSuspense(<ProjectsPage />)} />
          <Route path="projects/:projectId" element={withProtectedSuspense(<ProjectsPage />)} />
          <Route path="tarefas" element={withProtectedSuspense(<TasksPage />)} />
          <Route path="jornada" element={withProtectedSuspense(<JourneyPage />)} />
          <Route path="academy" element={withProtectedSuspense(<OrientoAcademyPage />)} />
          <Route
            path="pedagogico"
            element={(
              <FounderRoute>
                {withProtectedSuspense(<PedagogicPanelPage />)}
              </FounderRoute>
            )}
          />
          <Route path="solutions" element={withProtectedSuspense(<SolutionsPage />)} />
          <Route path="community" element={withProtectedSuspense(<CommunityPage />)} />
          <Route
            path="founder"
            element={(
              <FounderDashboardRoute>
                {withProtectedSuspense(<FounderDashboardPage />)}
              </FounderDashboardRoute>
            )}
          />
          <Route path="settings" element={withProtectedSuspense(<SettingsPage />)} />
          <Route path="calendario" element={withProtectedSuspense(<CalendarPage />)} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
