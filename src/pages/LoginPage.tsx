import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        <title>Login - Orientohub</title>
        <meta name="description" content="Faça login na plataforma Orientohub e acelere sua startup" />
      </Helmet>
      
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black relative flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Branding */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="inline-block mb-8">
                <span className="text-4xl font-bold text-white">
                  Oriento<span className="text-primary-500">hub</span>
                </span>
              </Link>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Bem-vindo de{' '}
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  volta
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Acesse sua conta e continue transformando sua ideia em um negócio de sucesso.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  'Acesso a frameworks exclusivos',
                  'Comunidade ativa de founders',
                  'Mentorias e networking',
                  'Gamificação e conquistas'
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { value: '500+', label: 'Startups' },
                  { value: '1000+', label: 'Founders' },
                  { value: '95%', label: 'Satisfação' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 bg-white/5 rounded-xl border border-primary-500/20 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-primary-500">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border-2 border-white/10 shadow-2xl">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <Link to="/" className="inline-block">
                    <span className="text-3xl font-bold text-white">
                      Oriento<span className="text-primary-500">hub</span>
                    </span>
                  </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                      Login
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Entre na sua conta
                  </h2>
                  <p className="text-gray-400">
                    Continue sua jornada empreendedora
                  </p>
                </div>

                {/* Connection Status */}
                {connectionStatus === 'disconnected' && (
                  <motion.div
                    className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-red-400 mb-1">
                          Problema de Conexão
                        </h3>
                        <p className="text-sm text-red-300/80 mb-3">
                          Não foi possível conectar ao servidor. O projeto pode estar pausado.
                        </p>
                        <button
                          onClick={handleRetryConnection}
                          className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Messages */}
                {error && !isConnectionError && (
                  <motion.div
                    className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-sm text-red-400">{error}</p>
                    
                    {isEmailNotConfirmed && (
                      <div className="mt-3 pt-3 border-t border-red-500/20">
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={isLoading}
                          className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          Reenviar e-mail de confirmação
                        </button>
                        {resendSuccess && (
                          <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            E-mail reenviado com sucesso!
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={connectionStatus === 'disconnected'}
                        className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={connectionStatus === 'disconnected'}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={connectionStatus === 'disconnected'}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 transition-colors disabled:opacity-50"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Lembrar-me
                      </label>
                    </div>

                    <Link
                      to="/recuperar-senha"
                      className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || connectionStatus === 'disconnected'}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                        Entrar
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-br from-white/10 to-white/5 text-gray-400">
                      Novo por aqui?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Link
                    to="/cadastro"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                  >
                    <span>Não tem uma conta?</span>
                    <span className="font-bold text-primary-500 group-hover:text-primary-400">
                      Cadastre-se grátis
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
