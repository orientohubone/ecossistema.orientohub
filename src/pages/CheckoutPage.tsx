import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { supabase } from '../config/supabase';

const CheckoutPage = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const plan = params.get('plan') === 'pro' ? 'pro' : 'pro';
  const billing = params.get('billing') === 'annual' ? 'annual' : 'monthly';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const amount = billing === 'annual' ? 970 : 97;
  const cancelled = params.get('cancelled') === '1';
  const expired = params.get('expired') === '1';

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email) setEmail(data.session.user.email);
    });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const result = await fetch('/api/create-mercadopago-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionData.session?.access_token ? { Authorization: `Bearer ${sessionData.session.access_token}` } : {}),
        },
        body: JSON.stringify({ plan, billing, email }),
      });
      const contentType = result.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await result.json() : {};
      if (!contentType.includes('application/json')) {
        throw new Error('A API de pagamento não está disponível neste ambiente. Use “vercel dev” ou publique o projeto na Vercel.');
      }
      if (!result.ok || !data.checkoutUrl) throw new Error(data.message || 'Não foi possível iniciar o pagamento.');
      window.location.assign(data.checkoutUrl);
    } catch (submitError: any) {
      setError(submitError.message || 'Não foi possível iniciar o pagamento.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Assine o Pro | OrientoHub</title></Helmet>
      <section className="relative min-h-screen overflow-hidden bg-[#070809] py-8 text-white sm:py-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[130px]" />
        <div className="container-custom relative max-w-6xl">
          <Link to="/planos" className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary-400"><ArrowLeft className="h-4 w-4" />Voltar para planos</Link>
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-400"><Sparkles className="h-3.5 w-3.5" />OrientoHub Pro</span>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Um último passo para acelerar seu negócio</h1>
            <p className="mx-auto mt-3 max-w-2xl text-gray-400">Revise sua assinatura e continue para o ambiente seguro do Mercado Pago.</p>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#111318] shadow-2xl shadow-black/50 lg:grid-cols-[1fr_0.85fr]">
            <div className="p-6 sm:p-10">
              <p className="mb-3 text-sm font-semibold text-gray-300">Escolha como prefere pagar</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/checkout?plan=pro&billing=monthly" className={`relative rounded-2xl border p-5 transition ${billing === 'monthly' ? 'border-primary-400 bg-primary-400/10 ring-1 ring-primary-400' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}>
                  <span className="font-bold">Mensal</span><span className="mt-3 block text-2xl font-bold">R$ 97,00</span><span className="text-sm text-gray-400">por mês</span>{billing === 'monthly' && <Check className="absolute right-4 top-4 h-5 w-5 text-primary-400" />}
                </Link>
                <Link to="/checkout?plan=pro&billing=annual" className={`relative rounded-2xl border p-5 transition ${billing === 'annual' ? 'border-primary-400 bg-primary-400/10 ring-1 ring-primary-400' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}>
                  <span className="font-bold">Anual</span><span className="ml-2 rounded-full bg-green-500/15 px-2 py-1 text-xs font-bold text-green-400">Economize R$ 194</span><span className="mt-3 block text-2xl font-bold">R$ 970,00</span><span className="text-sm text-gray-400">R$ 80,83 por mês</span>{billing === 'annual' && <Check className="absolute right-4 top-4 h-5 w-5 text-primary-400" />}
                </Link>
              </div>

              <div className="mt-8 border-t border-white/10 pt-7">
                <p className="mb-4 text-sm font-semibold text-gray-300">Tudo que você recebe no Pro</p>
                <ul className="grid gap-4 sm:grid-cols-2">{['Frameworks e templates premium', 'Projetos ilimitados', 'Mentorias mensais', 'Suporte prioritário', 'Integrações avançadas', 'Networking exclusivo'].map((feature) => <li key={feature} className="flex gap-2.5 text-sm text-gray-300"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-400/15"><Check className="h-3.5 w-3.5 text-primary-400" /></span>{feature}</li>)}</ul>
              </div>
            </div>

            <motion.form initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} onSubmit={submit} className="border-t border-white/10 bg-white p-6 text-gray-950 sm:p-10 lg:border-l lg:border-t-0">
              <div className="mb-7 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-primary-400"><CreditCard className="h-5 w-5" /></span><div><h2 className="text-xl font-bold">Resumo do pedido</h2><p className="text-sm text-gray-500">Assinatura {billing === 'annual' ? 'anual' : 'mensal'}</p></div></div>
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5"><div className="flex justify-between"><span className="text-gray-600">OrientoHub Pro</span><span className="font-semibold">R$ {amount.toFixed(2).replace('.', ',')}</span></div><div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold"><span>Total</span><span>R$ {amount.toFixed(2).replace('.', ',')}</span></div><p className="text-xs text-gray-500">Renovação automática a cada {billing === 'annual' ? 'ano' : 'mês'}. Cancele quando quiser.</p></div>
              <label className="mt-5 block text-sm font-semibold text-gray-700">E-mail da assinatura<div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500"><Mail className="h-4 w-4 text-gray-400" /><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@empresa.com" className="w-full border-0 bg-transparent py-3 outline-none" /></div></label>
              {(cancelled || expired || error) && <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" /><span>{error || (expired ? 'Este checkout expirou. Gere um novo para continuar.' : 'O pagamento foi cancelado. Você pode tentar novamente.')}</span></div>}
              <button disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-400 px-5 py-4 font-bold text-black transition hover:bg-primary-300 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Preparando checkout...</> : <>Continuar para pagamento <ArrowRight className="h-5 w-5" /></>}</button>
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500"><Lock className="h-4 w-4 text-green-600" />Checkout criptografado e processado pelo Mercado Pago.</p>
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-gray-200 pt-5 text-xs text-gray-500"><Shield className="h-4 w-4" />Seus dados de pagamento não passam pela OrientoHub.</div>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
