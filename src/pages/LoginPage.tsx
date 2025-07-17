import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, connectionStatus, resendConfirmationEmail, initAuth } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendSuccess(false);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await resendConfirmationEmail(email);
      setResendSuccess(true);
    } catch (error) {
      console.error('Failed to resend confirmation email:', error);
    }
  };

  const handleRetryConnection = async () => {
    await initAuth();
  };
  const isEmailNotConfirmed = error?.includes('Email not confirmed');
  const isConnectionError = connectionStatus === 'disconnected' || error?.includes('servidor') || error?.includes('Servidor');
  
  return (
    <>
      <Helmet>
        <title>{t('auth.login.title')} | Orientohub</title>
      </Helmet>
      
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <motion.div
          className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Link to="/" className="flex justify-center">
              <span className="text-2xl font-bold text-black dark:text-white">
                Oriento<span className="text-primary-500">hub</span>
              </span>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {t('auth.login.title')}
            </h2>
          </div>
          
          {/* Connection Status */}
          {connectionStatus === 'disconnected' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Problema de Conexão
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Não foi possível conectar ao servidor. Isso pode acontecer se o projeto Supabase estiver pausado (comum no plano gratuito).
                  </p>
                  <button
                    onClick={handleRetryConnection}
                    className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="space-y-4">
              <div className={`p-3 rounded-md text-sm ${
                isConnectionError 
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}>
                {error}
              </div>
              
              {isEmailNotConfirmed && (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Reenviar e-mail de confirmação
                  </button>
                  {resendSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      E-mail de confirmação reenviado!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  {t('auth.login.email')}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={connectionStatus === 'disconnected'}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.login.email')}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t('auth.login.password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={connectionStatus === 'disconnected'}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.login.password')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={connectionStatus === 'disconnected'}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  {t('auth.login.forgotPassword')}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || connectionStatus === 'disconnected'}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.loading')}
                  </span>
                ) : (
                  t('auth.login.submit')
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.login.noAccount')}{' '}
              <Link to="/cadastro" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                {t('auth.login.createAccount')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;