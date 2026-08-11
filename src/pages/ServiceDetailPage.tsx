import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BarChart3, Briefcase, CheckCircle2, Code2, Globe2, Megaphone, Palette, Rocket, ShoppingCart, Sparkles, Target, Award } from 'lucide-react';
import type { ComponentType } from 'react';
import { getServiceBySlug } from '../data/serviceCatalog';

const icons: Record<string, ComponentType<{ className?: string }>> = {
  estrategia: Briefcase, inovacao: Rocket, marketing: BarChart3, 'midia-paga': Megaphone,
  design: Palette, 'vibe-coding': Code2, marcas: Award, dominio: Globe2, sites: Target, 'e-commerce': ShoppingCart,
};

const accentClasses = {
  primary: 'border-primary-400/30 bg-primary-500/10 text-primary-300',
  orange: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  pink: 'border-pink-400/30 bg-pink-400/10 text-pink-300',
  violet: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  sky: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  green: 'border-green-400/30 bg-green-400/10 text-green-300',
};

const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const service = getServiceBySlug(serviceSlug);
  if (!service) return <Navigate to="/servicos" replace />;

  const Icon = icons[service.slug] || Sparkles;
  const accent = accentClasses[service.accent];

  return (
    <>
      <Helmet>
        <title>{service.title} | Serviços OrientoHub</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <main className="min-h-screen overflow-hidden bg-[#0c121b] text-white">
        <section className="relative border-b border-[#273548] bg-[#101722]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.09]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #facc15 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="container-custom relative py-14 sm:py-20 lg:py-24">
            <Link to="/servicos" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#9ba9bc] transition-colors hover:text-primary-300"><ArrowLeft className="h-4 w-4" /> Todos os serviços</Link>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.17em] ${accent}`}><Icon className="h-4 w-4" /> {service.eyebrow}</div>
                <h1 className="max-w-4xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{service.hero}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#9ba9bc] sm:text-xl">{service.outcome}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to={`/contato?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(`Olá, gostaria de falar sobre ${service.title}. Podemos agendar uma conversa?`)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400">Quero falar sobre {service.title.toLowerCase()} <ArrowRight className="h-4 w-4" /></Link><a href="https://consultoria.orientohub.com.br" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b] px-5 py-3.5 text-sm font-semibold text-[#d7e0ea] transition hover:border-primary-400 hover:text-white">Conhecer a Orienta+</a></div>
              </div>
              <div className={`rounded-3xl border p-7 ${accent}`}><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0c121b]/50"><Icon className="h-8 w-8" /></div><p className="mt-7 text-sm font-semibold uppercase tracking-[0.15em] opacity-75">O foco</p><p className="mt-2 text-xl font-bold leading-snug text-white">{service.description}</p></div>
            </motion.div>
          </div>
        </section>

        <section className="container-custom py-12 sm:py-16">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">O que construímos</p><h2 className="mt-3 text-3xl font-bold">Uma frente integrada ao momento do seu negócio.</h2><p className="mt-4 leading-relaxed text-[#9ba9bc]">Cada projeto começa entendendo seu contexto. A entrega combina direção e execução, sem pacotes genéricos ou promessas desconectadas da realidade.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{service.deliverables.map((deliverable, index) => <motion.div key={deliverable} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex gap-3 rounded-2xl border border-[#273548] bg-[#151f2b] p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" /><p className="font-medium text-[#d7e0ea]">{deliverable}</p></motion.div>)}</div>
          </div>
        </section>

        <section className="border-y border-[#273548] bg-[#101722]"><div className="container-custom py-12 sm:py-16"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Como funciona</p><h2 className="mt-3 text-3xl font-bold">Direção antes da execução.</h2></div><div className="mt-8 grid gap-4 md:grid-cols-3">{service.process.map((step, index) => <div key={step.title} className="rounded-2xl border border-[#273548] bg-[#0c121b] p-6"><span className="text-sm font-bold text-primary-300">0{index + 1}</span><h3 className="mt-5 text-xl font-bold">{step.title}</h3><p className="mt-2 leading-relaxed text-[#9ba9bc]">{step.description}</p></div>)}</div></div></section>

        <section className="container-custom py-12 sm:py-16"><div className="rounded-3xl border border-primary-400/25 bg-primary-500/10 p-7 text-center sm:p-10"><Sparkles className="mx-auto h-7 w-7 text-primary-300" /><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold">Vamos desenhar a melhor próxima etapa para sua empresa?</h2><p className="mx-auto mt-3 max-w-xl text-[#d7e0ea]">Converse com a OrientoHub e entenda qual combinação de estratégia e execução faz sentido agora.</p><Link to={`/contato?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(`Olá, gostaria de conversar sobre ${service.title} e a melhor estratégia para meu negócio.`)}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400">Falar com a OrientoHub <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
    </>
  );
};

export default ServiceDetailPage;
