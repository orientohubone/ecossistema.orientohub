import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
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
  
  return (
    <>
      <Helmet>
        <title>Criar Conta - Orientohub</title>
        <meta name="description" content="Crie sua conta gratuitamente e comece a acelerar sua startup hoje mesmo" />
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
              <img 
              src="/orientohub.png" 
              alt="Orientohub" 
              className="h-10 w-auto"
            />
          </Link>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Comece sua jornada{' '}
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  gratuitamente
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Junte-se a centenas de founders que estão transformando suas ideias em startups de sucesso.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  'Acesso imediato a frameworks exclusivos',
                  'Comunidade ativa de empreendedores',
                  'Mentorias e networking qualificado',
                  'Recursos de gamificação',
                  'Sem compromisso, cancele quando quiser'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Launch Message */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 backdrop-blur-sm border-2 border-primary-500/30 overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 animate-pulse" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-primary-500/20 px-4 py-2 rounded-full mb-2">
                    <Sparkles className="w-5 h-5 text-primary-500 animate-pulse" />
                    <span className="text-primary-500 font-bold text-sm">PLATAFORMA PRONTA</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    Lançamento Oficial em Breve
                  </h3>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    Nossa plataforma está completa e pronta para transformar sua jornada empreendedora.
                    Em breve, faremos o lançamento oficial com acesso total a todos os recursos.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-300">Aguarde nosso anúncio oficial</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Signup Form */}
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border-2 border-white/10 shadow-2xl">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <Link to="/" className="inline-block mb-8">
                  <img 
                  src="/orientohub.png" 
                  alt="Orientohub" 
                  className="h-10 w-auto"
            />
             </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                      Cadastro Gratuito
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Crie sua conta
                  </h2>
                  <p className="text-gray-400">
                    E comece a transformar sua ideia em realidade
                  </p>
                </div>

                {/* Error Messages */}
                {(error || passwordError) && (
                  <motion.div
                    className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error || passwordError}</p>
                    </div>
                  </motion.div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

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
                        className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all"
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
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all"
                        placeholder="Mínimo 6 caracteres"
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
                    {/* Password Strength */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Força da senha:</span>
                          <span className={currentStrength.strength === 100 ? 'text-green-400' : currentStrength.strength === 66 ? 'text-yellow-400' : 'text-red-400'}>
                            {currentStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${currentStrength.color} transition-all duration-300`}
                            style={{ width: `${currentStrength.strength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all"
                        placeholder="Digite a senha novamente"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
                    />
                    <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-300">
                      Eu aceito os{' '}
                      <Link to="/termos" className="text-primary-400 hover:text-primary-300 font-medium">
                        Termos de Uso
                      </Link>
                      {' '}e a{' '}
                      <Link to="/privacidade" className="text-primary-400 hover:text-primary-300 font-medium">
                        Política de Privacidade
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                        <Rocket className="w-5 h-5" />
                        Criar Conta Grátis
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
                      Já tem uma conta?
                    </span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <Link
                    to="/entrar"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                  >
                    <span>Faça login na sua conta</span>
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

export default SignupPage;
