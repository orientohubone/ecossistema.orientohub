import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Rocket } from 'lucide-react';
import { CRM_ALLOWED_EMAIL, supabase } from '../lib/supabase';

export const Login = () => {
  const [email, setEmail] = useState(CRM_ALLOWED_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (email.trim().toLowerCase() !== CRM_ALLOWED_EMAIL) return setError('Este CRM ainda possui acesso restrito.');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (authError) setError('Não foi possível entrar. Confira suas credenciais.');
  };

  return <main className="auth-page">
    <section className="auth-art"><img src="/Colagem de Dashboard em Preto e Amarelo.png" alt="Colagem do dashboard OrientoHub" /></section>
    <section className="auth-panel">
      <form className="auth-form" onSubmit={submit}>
        <a className="auth-back" href="https://orientohub.com.br"><ArrowLeft size={16} />Voltar para a Home</a>
        <img className="auth-logo" src="/orientohub.png" alt="OrientoHub" />
        <div className="auth-heading"><h1>Bem-vindo de volta.</h1><p>Acesse sua conta para continuar.</p></div>
        {error && <p className="auth-error">{error}</p>}
        <label className="auth-field">E-mail<div><Mail size={20} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" required /></div></label>
        <label className="auth-field">Senha<div><Lock size={20} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></label>
        <div className="auth-options"><label><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />Lembrar-me</label><a href="https://orientohub.com.br/recuperar-senha">Esqueci minha senha?</a></div>
        <button className="auth-submit" disabled={loading}>{loading ? 'Entrando...' : <><Rocket size={20} />Entrar <ArrowRight size={20} /></>}</button>
        <p className="auth-restriction">O acesso ao CRM está liberado somente para o Founder.</p>
      </form>
    </section>
  </main>;
};
