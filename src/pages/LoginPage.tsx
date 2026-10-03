import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Home,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Rocket
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, connectionStatus, resendConfirmationEmail, initAuth } = useAuthStore();

  const [email, setEmail] = useState(() => location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(false);
  const scrollIndicatorTimeoutRef = useRef<number | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendSuccess(false);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // A mensagem sanitizada é exibida pelo estado de autenticação.
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

  useEffect(() => {
    document.body.classList.add('auth-scrollbar-hidden');
    document.documentElement.classList.add('auth-scrollbar-hidden');

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;

      setScrollProgress(nextProgress);
      setIsScrollIndicatorVisible(scrollTop > 0);

      if (scrollIndicatorTimeoutRef.current) {
        window.clearTimeout(scrollIndicatorTimeoutRef.current);
      }

      scrollIndicatorTimeoutRef.current = window.setTimeout(() => {
        setIsScrollIndicatorVisible(false);
      }, 700);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.body.classList.remove('auth-scrollbar-hidden');
      document.documentElement.classList.remove('auth-scrollbar-hidden');
      window.removeEventListener('scroll', handleScroll);

      if (scrollIndicatorTimeoutRef.current) {
        window.clearTimeout(scrollIndicatorTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Login - Orientohub</title>
        <meta name="description" content="Faça login na plataforma Orientohub e acelere sua startup" />
      </Helmet>

      <div className="h-screen w-full flex bg-[#0A0A0A] text-white font-sans overflow-hidden">
        {/* Left Side - Dashboard Collage */}
        <div className="hidden lg:block lg:w-1/2 h-full relative bg-[#FFF200] items-center justify-center overflow-hidden">
          <img 
            src="/Colagem de Dashboard em Preto e Amarelo.png" 
            alt="Dashboard Collage" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
          <motion.div 
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar para a Home
            </Link>

            {/* Header */}
            <div className="mb-8">
              <Link to="/" className="inline-block mb-6">
                <img
                  src="/orientohub.png"
                  alt="Orientohub"
                  className="h-8 w-auto"
                />
              </Link>
              
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Bem-vindo de volta.
              </h1>
              <p className="text-gray-400 text-lg">
                Acesse sua conta para continuar.
              </p>
            </div>

            {/* Connection Status */}
            {connectionStatus === 'disconnected' && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-400 mb-1">Problema de Conexão</h3>
                    <p className="text-sm text-red-300/80 mb-3">Não foi possível conectar ao servidor.</p>
                    <button onClick={handleRetryConnection} className="text-sm text-red-400 font-medium hover:text-red-300 transition-colors flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Tentar novamente
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Messages */}
            {error && !isConnectionError && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-red-400">{error}</p>
                {isEmailNotConfirmed && (
                  <div className="mt-3 pt-3 border-t border-red-500/20">
                    <button type="button" onClick={handleResendConfirmation} disabled={isLoading} className="text-sm text-red-400 hover:underline">
                      Reenviar e-mail de confirmação
                    </button>
                    {resendSuccess && (
                      <p className="text-sm text-green-400 mt-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> E-mail reenviado com sucesso!</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email" name="email" type="email" autoComplete="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} disabled={connectionStatus === 'disconnected'}
                    className="block w-full pl-12 pr-4 py-2.5 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-[#FFF200] focus:ring-1 focus:ring-[#FFF200] outline-none transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                    value={password} onChange={(e) => setPassword(e.target.value)} disabled={connectionStatus === 'disconnected'}
                    className="block w-full pl-12 pr-12 py-2.5 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-[#FFF200] focus:ring-1 focus:ring-[#FFF200] outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center">
                  <input
                    id="remember-me" name="remember-me" type="checkbox"
                    checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={connectionStatus === 'disconnected'}
                    className="w-4 h-4 rounded border-gray-800 bg-[#121212] text-[#FFF200] focus:ring-[#FFF200] focus:ring-offset-0 transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Lembrar-me
                  </label>
                </div>
                <Link to="/recuperar-senha" className="text-sm font-medium text-[#FFF200] hover:text-[#FFF200]/80 transition-colors">
                  Esqueci minha senha?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading || connectionStatus === 'disconnected'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FFF200] hover:bg-[#FFF200]/90 text-black font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 mt-4 shadow-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Entrar <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800/50 flex justify-center items-center gap-2 text-sm text-gray-400">
              Ainda não tem uma conta? 
              <Link to="/cadastro" className="text-[#FFF200] font-semibold hover:underline flex items-center gap-1">
                Criar conta <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
