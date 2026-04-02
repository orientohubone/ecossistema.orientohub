import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ManifestoPage = lazy(() => import('./pages/ManifestoPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EcosystemPage = lazy(() => import('./pages/EcosystemPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AcademyLoginPage = lazy(() => import('./pages/AcademyLoginPage'));
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
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const FounderDashboardPage = lazy(() => import('./pages/FounderDashboardPage'));

// Auth
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FounderRoute from './components/auth/FounderRoute';
import FounderDashboardRoute from './components/auth/FounderDashboardRoute';
import ProtectedRouteSkeleton from './components/auth/ProtectedRouteSkeleton';

const PublicRouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="route-skeleton-block h-12 w-12 rounded-full" />
  </div>
);

const withPublicSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PublicRouteFallback />}>{element}</Suspense>
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
      <PublicRouteFallback />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={withPublicSuspense(<HomePage />)} />
          <Route path="/contato" element={withPublicSuspense(<ContactPage />)} />
          <Route path="sobre" element={withPublicSuspense(<AboutPage />)} />
          <Route path="manifesto" element={withPublicSuspense(<ManifestoPage />)} />
          <Route path="glossario" element={withPublicSuspense(<GlossaryPage />)} />
          <Route path="ecossistema" element={withPublicSuspense(<EcosystemPage />)} />
          <Route path="/academy" element={withPublicSuspense(<AcademyPage />)} />
          <Route path="/academy/login" element={withPublicSuspense(<AcademyLoginPage />)} />
          <Route path="planos" element={withPublicSuspense(<PricingPage />)} />
          <Route path="checkout" element={withPublicSuspense(<CheckoutPage />)} />
          <Route path="checkout/success" element={withPublicSuspense(<CheckoutSuccessPage />)} />
          <Route path="entrar" element={withPublicSuspense(<LoginPage />)} />
          <Route path="cadastro" element={withPublicSuspense(<SignupPage />)} />
          <Route path="blog" element={withPublicSuspense(<BlogPage />)} />
          <Route path="blog/:slug" element={withPublicSuspense(<BlogPostPage />)} />
          <Route path="termos" element={withPublicSuspense(<TermsPage />)} />
          <Route path="privacidade" element={withPublicSuspense(<PrivacyPage />)} />
          <Route path="cookies" element={withPublicSuspense(<CookiesPage />)} />
        </Route>

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

        <Route path="*" element={withPublicSuspense(<NotFoundPage />)} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
