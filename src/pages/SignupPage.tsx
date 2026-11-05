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
  const { signup, resendConfirmationEmail, isLoading, error } = useAuthStore();
  const [confirmationEmail,setConfirmationEmail]=useState('');
  const [resendCooldown,setResendCooldown]=useState(0);
  const [resendNotice,setResendNotice]=useState('');
  const submitting=useRef(false);
  useEffect(()=>{
    if(!resendCooldown)return;
    const timer=window.setTimeout(()=>setResendCooldown(value=>Math.max(0,value-1)),1000);
    return()=>window.clearTimeout(timer);
  },[resendCooldown]);
  
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
    if(submitting.current||isLoading)return;
    
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
      submitting.current=true;
      const normalizedEmail=email.trim();
      const result=await signup(normalizedEmail, password, { name:name.trim() });
      if(result.confirmationRequired){
        setConfirmationEmail(normalizedEmail);
        setPassword('');setConfirmPassword('');
        setResendCooldown(60);
      }else{
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      submitting.current=false;
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
  
  if(confirmationEmail)return <>
    <Helmet><title>Confirme seu e-mail - Orientohub</title></Helmet>
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121212] p-6 sm:p-8" aria-labelledby="signup-confirmation-title">
        <Link to="/" className="mb-8 inline-block"><img src="/orientohub.png" alt="Orientohub" className="h-8 w-auto" /></Link>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FFF200]/25 bg-[#FFF200]/10 text-[#FFF200]"><Mail className="h-7 w-7" /></div>
        <h1 id="signup-confirmation-title" className="text-2xl font-bold">Confirme seu e-mail para continuar</h1>
        <p role="status" className="mt-4 text-sm leading-relaxed text-gray-400">Enviamos um link de confirmação para <strong className="font-semibold text-white [overflow-wrap:anywhere]">{confirmationEmail}</strong>. Abra o e-mail e clique no link para ativar sua conta antes de fazer login.</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">Confira também as pastas de spam e lixo eletrônico. O envio pode levar alguns minutos.</p>
        {error&&<p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        {resendNotice&&<p role="status" className="mt-4 text-sm text-[#FFF200]">{resendNotice}</p>}
        <Link to="/entrar" className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-4 py-3 text-sm font-bold text-black">Já confirmei, ir para o login<ArrowRight className="h-4 w-4" /></Link>
        <button type="button" disabled={isLoading||resendCooldown>0} onClick={async()=>{
          setResendNotice('');
          await resendConfirmationEmail(confirmationEmail);
          if(!useAuthStore.getState().error){setResendNotice('Novo e-mail de confirmação solicitado. Confira sua caixa de entrada.');setResendCooldown(60);}
        }} className="mt-3 w-full rounded-xl border border-gray-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{isLoading?'Reenviando...':resendCooldown>0?`Reenviar e-mail em ${resendCooldown}s`:'Reenviar e-mail de confirmação'}</button>
        <button type="button" disabled={isLoading} onClick={()=>{setConfirmationEmail('');setResendNotice('');useAuthStore.setState({error:null});}} className="mt-5 w-full text-sm text-gray-400 hover:text-white">Corrigir o e-mail informado</button>
      </section>
    </main>
  </>;

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
