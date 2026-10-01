import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Home,
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Rocket,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(false);
  const scrollIndicatorTimeoutRef = useRef<number | null>(null);

  const signupBenefits = [
    'Acesso imediato aos frameworks',
    'Comunidade de founders',
    'Sem compromisso, cancele quando quiser',
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!acceptTerms) {
      setPasswordError('Você precisa aceitar os termos de uso');
      return;
    }
    
    setPasswordError('');
    
    try {
      await signup(email, password, { name });
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const passwordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: '', color: '' };
    if (pass.length < 6) return { strength: 33, label: 'Fraca', color: 'bg-red-500' };
    if (pass.length < 10) return { strength: 66, label: 'Média', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Forte', color: 'bg-green-500' };
  };

  const currentStrength = passwordStrength(password);

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
        <title>Criar Conta - Orientohub</title>
        <meta name="description" content="Crie sua conta gratuitamente e comece a acelerar sua startup hoje mesmo" />
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
            className="w-full max-w-md relative z-10 my-auto"
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
                Crie sua conta.
              </h1>
              <p className="text-gray-400 text-lg">
                Junte-se a nós e comece agora.
              </p>
            </div>

            {/* Error Messages */}
            {(error || passwordError) && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error && <p className="text-sm text-red-400 mb-1">{error}</p>}
                {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="name" name="name" type="text" autoComplete="name" required
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-2.5 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-[#FFF200] focus:ring-1 focus:ring-[#FFF200] outline-none transition-all"
                    placeholder="João da Silva"
                  />
                </div>
              </div>

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
                    value={email} onChange={(e) => setEmail(e.target.value)}
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
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password" name="password" type={showPassword ? 'text' : 'password'} required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-2.5 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-[#FFF200] focus:ring-1 focus:ring-[#FFF200] outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>

                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-2.5 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-[#FFF200] focus:ring-1 focus:ring-[#FFF200] outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start pt-2">
                <input
                  id="terms" name="terms" type="checkbox" required
                  checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-800 bg-[#121212] text-[#FFF200] focus:ring-[#FFF200] focus:ring-offset-0 transition-colors"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                  Li e concordo com os{' '}
                  <Link to="/termos" className="text-[#FFF200] hover:underline">Termos de Serviço</Link>{' '}
                  e a{' '}
                  <Link to="/privacidade" className="text-[#FFF200] hover:underline">Política de Privacidade</Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading || !acceptTerms}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FFF200] hover:bg-[#FFF200]/90 text-black font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 shadow-none mt-4"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  <>
                    
                    Criar conta <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800/50 flex justify-center items-center gap-2 text-sm text-gray-400">
              Já tem uma conta? 
              <Link to="/entrar" className="text-[#FFF200] font-semibold hover:underline flex items-center gap-1">
                Fazer login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
