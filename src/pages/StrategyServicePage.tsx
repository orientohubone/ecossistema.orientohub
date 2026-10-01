import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, ClipboardList, Compass, Crosshair, Route, Search, Target } from 'lucide-react';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

const StrategyServicePage = ({ service }: { service: ServiceCatalogItem }) => (
  <>
    <Helmet><title>Estratégia | Serviços OrientoHub</title><meta name="description" content={service.description} /></Helmet>
    <main className="relative isolate overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <section className="relative z-10 border-b border-white/10">
        <div className="container-custom py-14 sm:py-20 lg:py-28">
          <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Todos os serviços</Link>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Estratégia empresarial</p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.75rem,5.4vw,4.75rem)] font-black leading-[0.94] tracking-[-0.05em]"><span className="block">Clareza para o</span><span className="mt-2 block whitespace-nowrap text-[#FFF200]">próximo movimento.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">{service.outcome}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/contato?service=Estratégia" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Quero construir minha estratégia <ArrowRight className="h-4 w-4" /></Link><a href="#metodo" className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-bold transition hover:border-[#FFF200] hover:text-[#FFF200]">Conhecer o método</a></div>
            </motion.div>

            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-7 backdrop-blur-md sm:p-9">
              <div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200] text-black"><Compass className="h-6 w-6" /></span><span className="rounded-full border border-[#FFF200]/35 bg-[#FFF200]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FFF200]">Sob demanda</span></div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-white/35">Uma boa estratégia responde</p>
              <ul className="mt-5 space-y-5">{['Onde estamos agora?', 'O que realmente precisa mudar?', 'Qual movimento gera mais impacto?', 'Como transformar direção em execução?'].map((item, index) => <li key={item} className="flex items-start gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"><span className="text-xs font-black text-[#FFF200]">0{index + 1}</span><span className="font-semibold text-white/85">{item}</span></li>)}</ul>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="relative z-10 container-custom py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Antes do plano</p><h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">Estratégia não é uma lista de ideias.</h2><p className="mt-5 text-lg leading-relaxed text-white/50">É uma sequência de escolhas: o que priorizar, o que abandonar e como concentrar recursos no que pode mudar o resultado.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{service.deliverables.map((item, index) => <motion.div key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/70 p-6 backdrop-blur"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF200]/10 text-xs font-black text-[#FFF200]">0{index + 1}</span><p className="mt-8 text-lg font-bold leading-snug">{item}</p></motion.div>)}</div>
        </div>
      </section>

      <section id="metodo" className="relative z-10 border-y border-white/10 bg-black/35">
        <div className="container-custom py-16 sm:py-24"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Como trabalhamos</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Direção antes da execução.</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{service.process.map((step, index) => { const Icon = [Search, Crosshair, Route][index] || Target; return <article key={step.title} className="group rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7 transition hover:-translate-y-1 hover:border-[#FFF200]/65"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200]/10 text-[#FFF200]"><Icon className="h-6 w-6" /></span><span className="text-sm font-black text-white/20">0{index + 1}</span></div><h3 className="mt-10 text-2xl font-black">{step.title}</h3><p className="mt-3 leading-relaxed text-white/50">{step.description}</p></article>; })}</div>
        </div>
      </section>

      <section className="relative z-10 bg-[#FFF200] text-black">
        <div className="container-custom grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.92fr)] lg:items-center lg:gap-16 lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] sm:text-sm">Antes de indicar uma solução</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.2vw,3.75rem)] font-black leading-[1.05] tracking-[-0.045em]"><span className="block">Primeiro, precisamos</span><span className="mt-2 block whitespace-nowrap">entender o <span className="inline-block bg-black px-3 py-1 text-white sm:px-4 sm:py-1.5">problema.</span></span></h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/65 sm:text-xl">Diagnóstico, análise e direção para descobrir o que seu negócio realmente precisa.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#161616] to-[#070707] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="text-4xl font-black tracking-[-0.05em] sm:text-5xl"><span className="text-white">Orienta</span><span className="text-[#FFF200]">+</span></div>
            <h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">Comece pelo diagnóstico.</h3>
            <div className="mt-8 grid grid-cols-4 gap-2">{[
              { label: 'Diagnóstico', icon: Search }, { label: 'Análise', icon: BarChart3 }, { label: 'Discovery', icon: ClipboardList }, { label: 'Plano de ação', icon: Target },
            ].map((step, index) => { const Icon = step.icon; return <div key={step.label} className="relative flex min-w-0 flex-col items-center text-center">{index < 3 && <span className="absolute left-[68%] top-7 h-px w-[64%] bg-white/35" />}<span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.07] text-[#FFF200]"><Icon className="h-6 w-6" /></span><span className="mt-3 text-[10px] font-bold leading-tight text-white/80 sm:text-xs">{step.label}</span></div>; })}</div>
            <a href="https://consultoria.orientohub.com.br" target="_blank" rel="noopener noreferrer" className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FFF200] px-5 py-4 text-xs font-black uppercase tracking-[0.08em] text-black transition hover:bg-white sm:text-sm">Quero analisar meu negócio <ArrowRight className="h-5 w-5" /></a>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default StrategyServicePage;
