import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { isFounderUser } from '../utils/founderAccess';

const AcademyLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    isLoading,
    error,
    connectionStatus,
    resendConfirmationEmail,
    initAuth,
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  const from = (location.state?.from?.pathname as string | undefined) ?? '/dashboard/academy';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResendSuccess(false);

    try {
      await login(email, password);
      const nextRoute = isFounderUser(useAuthStore.getState().user, { requireSecret: true })
        ? '/dashboard/pedagogico'
        : from;
      navigate(nextRoute, { replace: true });
    } catch (err) {
      console.error('Academy login failed', err);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await resendConfirmationEmail(email);
      setResendSuccess(true);
    } catch (err) {
      console.error('Failed to resend confirmation email', err);
    }
  };

  const handleRetryConnection = async () => {
    await initAuth();
  };

  const isEmailNotConfirmed = error?.includes('Email not confirmed');
  const isConnectionError = connectionStatus === 'disconnected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Helmet>
        <title>Entrar – Oriento Academy</title>
      </Helmet>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251,191,36,0.25) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 container-custom py-16">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Link to="/">
                <img src="/oriento-academy-logo.png" alt="Orientoacademy" className="h-13 w-auto" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold tracking-[0.3em] uppercase text-amber-200">
                <Sparkles size={14} /> Academy
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Autenticação dedicada da Oriento Academy
              </h1>
              <p className="text-slate-300 text-lg">
                Founders, mentores e curadores acessam aqui o cockpit pedagógico e as trilhas premium. Utilize as mesmas credenciais do ecossistema Orientohub.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  'Sincronizado ao painel pedagógico',
                  'Fluxos seguros com Supabase',
                  'Acesso imediato ao catálogo privado'
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-300">E-mail</label>
                  <div className="mt-2 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      className="w-full rounded-2xl bg-slate-950/40 border border-white/10 pl-10 pr-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                      placeholder="founder@orientohub.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={connectionStatus === 'disconnected'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">Senha</label>
                  <div className="mt-2 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      className="w-full rounded-2xl bg-slate-950/40 border border-white/10 pl-10 pr-4 py-3 text-white focus:border-amber-300 focus:outline-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={connectionStatus === 'disconnected'}
                      required
                    />
                  </div>
                </div>

                {error && !isConnectionError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                    <p>{error}</p>
                    {isEmailNotConfirmed && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={isLoading}
                          className="text-red-100 underline"
                        >
                          Reenviar confirmação
                        </button>
                        {resendSuccess && (
                          <p className="mt-2 text-green-200 flex items-center gap-2 text-xs">
                            <CheckCircle2 size={14} /> E-mail reenviado com sucesso.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {isConnectionError && (
                  <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                    <p>Não foi possível conectar ao servidor. Tente novamente em alguns instantes.</p>
                    <button
                      type="button"
                      onClick={handleRetryConnection}
                      className="mt-2 underline"
                    >
                      Recarregar estado de autenticação
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isConnectionError}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-300 text-slate-900 font-semibold py-3 shadow-lg shadow-amber-300/30 disabled:opacity-60"
                >
                  {isLoading ? 'Validando…' : 'Entrar na Academy'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Precisa de ajuda? <a href="mailto:academy@orientohub.com" className="text-amber-300">Fale com o suporte da Academy</a>.
                </p>

                <div className="text-center text-sm text-slate-500">
                  Ainda não faz parte da Academy? <Link to="/planos" className="text-amber-200 underline">Conheça os planos</Link>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyLoginPage;


