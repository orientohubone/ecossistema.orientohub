import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';


// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ManifestoPage from './pages/ManifestoPage';
import GlossaryPage from './pages/GlossaryPage';
import AboutPage from './pages/AboutPage';
import EcosystemPage from './pages/EcosystemPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InsightsPage from './pages/InsightsPage';
import FrameworksPage from './pages/FrameworksPage';
import FrameworkGamePage from './pages/FrameworkGamePage';
import ProjectsPage from './pages/ProjectsPage';
import SolutionsPage from './pages/SolutionsPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    const init = async () => {
      await initAuth();
      setIsLoading(false);
    };
    
    init();
  }, [initAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}> 
          <Route index element={<HomePage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="manifesto" element={<ManifestoPage />} />
          <Route path="glossario" element={<GlossaryPage />} />
          <Route path="ecossistema" element={<EcosystemPage />} />
          <Route path="planos" element={<PricingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="entrar" element={<LoginPage />} />
          <Route path="cadastro" element={<SignupPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="termos" element={<TermsPage />} />
          <Route path="privacidade" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
        </Route>
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="frameworks" element={<FrameworksPage />} />
          <Route path="frameworks/:id/game" element={<FrameworkGamePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
