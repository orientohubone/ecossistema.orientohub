import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BarChart3, Check, ChevronRight, ClipboardList, MoveUpRight, Search, Target } from 'lucide-react';
import { serviceCatalog } from '../data/serviceCatalog';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const priceLabel = (service: ServiceCatalogItem) => {
  const price = service.pricing;
  if (!price) return 'Escopo personalizado';
  if (price.customText) return price.customText;
  if (price.fixed !== undefined) return money(price.fixed);
  if (price.promotional !== undefined) return money(price.promotional);
  if (price.startingAt !== undefined) return `A partir de ${money(price.startingAt)}${price.suffix ?? ''}`;
  return 'Escopo personalizado';
};

const ServicesCatalogPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = serviceCatalog[activeIndex];

  return <>
    <Helmet><title>Serviços | OrientoHub</title><meta name="description" content="Estratégia e execução conectadas para destravar o próximo movimento do seu negócio." /></Helmet>
    <main className="relative isolate overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <section className="relative z-10 overflow-hidden border-b border-white/10">
        <div className="container-custom relative py-20 sm:py-28 lg:py-36"><div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Núcleo de serviços</p><h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[96px]">Estratégia que<br /><span className="text-[#FFF200]">vira execução.</span></h1></motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="border-l border-[#FFF200] pl-6"><p className="text-lg leading-relaxed text-white/65">Conectamos negócio, marca, marketing e tecnologia para resolver o que realmente limita o seu crescimento.</p><a href="#catalogo" className="mt-7 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition hover:text-[#FFF200]">Explorar soluções <ArrowDown className="h-4 w-4" /></a></motion.div>
        </div></div>
      </section>

      <section id="catalogo" className="container-custom relative z-10 py-16 sm:py-24">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FFF200]">O que fazemos</p><h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Escolha o desafio. Nós conectamos a solução.</h2></div><p className="max-w-md text-sm leading-relaxed text-white/50">Cada frente pode ser contratada separadamente ou combinada em uma operação sob medida para o momento da sua empresa.</p></div>
        <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.55fr)] lg:gap-14">
          <nav aria-label="Catálogo de serviços" className="border-t border-white/15">{serviceCatalog.map((service, index) => <button key={service.slug} type="button" onClick={() => setActiveIndex(index)} className={`group flex w-full items-center gap-4 border-b px-1 py-4 text-left transition sm:py-5 ${activeIndex === index ? 'border-[#FFF200] text-white' : 'border-white/10 text-white/45 hover:border-white/30 hover:text-white'}`}><span className={`w-7 text-xs font-bold ${activeIndex === index ? 'text-[#FFF200]' : 'text-white/25'}`}>{String(index + 1).padStart(2, '0')}</span><span className="flex-1 text-base font-semibold sm:text-lg">{service.title}</span><ChevronRight className={`h-4 w-4 transition ${activeIndex === index ? 'text-[#FFF200]' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} /></button>)}</nav>

          <motion.article key={activeService.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative min-h-[600px] overflow-hidden rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22),0_0_28px_rgba(255,242,0,0.04)] backdrop-blur-md transition-colors hover:border-[#FFF200]/60 sm:p-10 lg:p-12">
            <span className="pointer-events-none absolute -right-3 -top-12 text-[180px] font-black leading-none text-white/[0.025] sm:text-[260px]">{String(activeIndex + 1).padStart(2, '0')}</span>
            <div className="relative flex h-full flex-col"><div className="flex flex-wrap items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FFF200]">{activeService.eyebrow}</p><span className="border border-[#FFF200]/45 bg-[#FFF200]/10 px-4 py-2 text-sm font-black text-[#FFF200] shadow-[0_0_24px_rgba(255,242,0,0.08)]">{priceLabel(activeService)}</span></div>
              <h3 className="mt-10 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl">{activeService.hero}</h3><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">{activeService.outcome}</p>
              <div className="mt-10 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2"><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/35">O que entregamos</p><ul className="space-y-4">{activeService.deliverables.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FFF200]" />{item}</li>)}</ul></div><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/35">Como avançamos</p><ol className="space-y-4">{activeService.process.map((step, index) => <li key={step.title} className="grid grid-cols-[28px_1fr] gap-3"><span className="text-xs font-bold text-[#FFF200]">0{index + 1}</span><div><strong className="text-sm">{step.title}</strong><p className="mt-1 text-sm leading-relaxed text-white/45">{step.description}</p></div></li>)}</ol></div></div>
              <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row"><Link to={`/servicos/${activeService.slug}`} className="inline-flex items-center justify-center gap-2 bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Ver solução completa <MoveUpRight className="h-4 w-4" /></Link><Link to="/contato" className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-4 text-sm font-bold transition hover:border-[#FFF200] hover:text-[#FFF200]">Falar com especialista <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="relative z-10 bg-[#FFF200] text-black">
        <div className="container-custom grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.92fr)] lg:items-center lg:gap-16 lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] sm:text-sm">Antes de indicar uma solução</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.2vw,3.75rem)] font-black leading-[1.05] tracking-[-0.045em]">
              <span className="block">Primeiro, precisamos</span>
              <span className="mt-2 block whitespace-nowrap">entender o <span className="inline-block bg-black px-3 py-1 text-white sm:px-4 sm:py-1.5">problema.</span></span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/65 sm:text-xl">Diagnóstico, análise e direção para descobrir o que seu negócio realmente precisa.</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#161616] to-[#070707] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="text-4xl font-black tracking-[-0.05em] sm:text-5xl"><span className="text-white">Orienta</span><span className="text-[#FFF200]">+</span></div>
            <h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">Comece pelo diagnóstico.</h3>

            <div className="mt-8 grid grid-cols-4 gap-2">
              {[
                { label: 'Diagnóstico', icon: Search },
                { label: 'Análise', icon: BarChart3 },
                { label: 'Discovery', icon: ClipboardList },
                { label: 'Plano de ação', icon: Target },
              ].map((step, index) => {
                const Icon = step.icon;
                return <div key={step.label} className="relative flex min-w-0 flex-col items-center text-center">
                  {index < 3 && <span className="absolute left-[68%] top-7 h-px w-[64%] bg-white/35" />}
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.07] text-[#FFF200]"><Icon className="h-6 w-6" /></span>
                  <span className="mt-3 text-[10px] font-bold leading-tight text-white/80 sm:text-xs">{step.label}</span>
                </div>;
              })}
            </div>

            <a href="https://consultoria.orientohub.com.br" target="_blank" rel="noopener noreferrer" className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FFF200] px-5 py-4 text-xs font-black uppercase tracking-[0.08em] text-black transition hover:bg-white sm:text-sm">Quero analisar meu negócio <ArrowRight className="h-5 w-5" /></a>
          </div>
        </div>
      </section>
    </main>
  </>;
};

export default ServicesCatalogPage;
