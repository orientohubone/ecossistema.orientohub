import { FormEvent, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Check, CreditCard, Loader2, Lock, Shield } from 'lucide-react';
import { supabase } from '../config/supabase';

const CheckoutPage = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const plan = params.get('plan') === 'pro' ? 'pro' : 'pro';
  const billing = params.get('billing') === 'annual' ? 'annual' : 'monthly';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = billing === 'annual' ? 970 : 97;
  const cancelled = params.get('cancelled') === '1';
  const expired = params.get('expired') === '1';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) throw new Error('Sua sessão expirou. Entre novamente para continuar.');
      const result = await fetch('/api/create-asaas-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session.access_token}` },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await result.json();
      if (!result.ok || !data.checkoutUrl) throw new Error(data.message || 'Não foi possível iniciar o pagamento.');
      window.location.assign(data.checkoutUrl);
    } catch (submitError: any) {
      setError(submitError.message || 'Não foi possível iniciar o pagamento.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | OrientoHub</title></Helmet>
      <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-10 text-white sm:py-16">
        <div className="container-custom max-w-5xl">
          <Link to="/planos" className="mb-8 inline-flex items-center gap-2 text-gray-300 transition hover:text-primary-400"><ArrowLeft className="h-4 w-4" />Voltar para planos</Link>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400"><CreditCard className="h-5 w-5" /></span><div><h1 className="text-xl font-bold">OrientoHub Pro</h1><p className="text-sm text-gray-400">Assinatura {billing === 'annual' ? 'anual' : 'mensal'}</p></div></div>
              <div className="border-y border-white/10 py-5"><p className="text-sm text-gray-400">Total</p><p className="mt-1 text-4xl font-bold text-primary-400">R$ {amount.toFixed(2).replace('.', ',')}</p><p className="text-sm text-gray-400">/{billing === 'annual' ? 'ano' : 'mês'}</p></div>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">{['Frameworks e templates premium', 'Projetos ilimitados', 'Mentorias mensais', 'Suporte prioritário'].map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />{feature}</li>)}</ul>
            </aside>
            <motion.form initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="rounded-2xl border border-white/10 bg-white p-6 text-gray-900 shadow-2xl sm:p-8">
              <div className="mb-7"><div className="mb-2 flex items-center gap-2"><Lock className="h-5 w-5 text-primary-600" /><h2 className="text-xl font-bold">Continue no checkout seguro</h2></div><p className="text-sm text-gray-600">Você será direcionado ao checkout hospedado pelo Asaas para informar e confirmar seus dados de pagamento.</p></div>
              {(cancelled || expired || error) && <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" />{error || (expired ? 'Este checkout expirou. Gere um novo para continuar.' : 'O pagamento foi cancelado. Você pode tentar novamente quando quiser.')}</div>}
              <button disabled={isSubmitting} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-4 font-bold text-black transition hover:bg-primary-400 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Abrindo checkout…</> : <>Ir para pagamento seguro <CreditCard className="h-5 w-5" /></>}</button>
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500"><Shield className="h-4 w-4 text-green-600" />O pagamento é processado pelo Asaas.</p>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
