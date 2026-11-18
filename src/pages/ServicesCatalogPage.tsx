import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, ArrowRight, BarChart3, ClipboardList, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceDeck from '../components/ServiceDeck';
import BlackFridaySeal from '../bf-2026/BlackFridaySeal';

const ServicesCatalogPage = () => {
  return <>
    <Helmet><title>Serviços | OrientoHub</title><meta name="description" content="Estratégia e execução conectadas para destravar o próximo movimento do seu negócio." /></Helmet>
    <main className="relative isolate overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <section className="relative z-10 overflow-hidden border-b border-white/10">
        <div className="container-custom relative py-20 sm:py-28 lg:py-36"><div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><div className="mb-3 inline-flex rounded-2xl bg-gradient-to-r from-[#b89b00] via-[#fff9a6] to-[#b89b00] p-[1px] shadow-[0_10px_35px_rgba(0,0,0,0.45)]"><div className="inline-flex items-center gap-3 rounded-[15px] bg-gradient-to-br from-[#2a2a2a] via-[#080808] to-[#1b1b1b] px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3"><BlackFridaySeal className="h-12 w-auto sm:h-16" /><span className="h-9 w-px bg-gradient-to-b from-transparent via-[#FFF200]/70 to-transparent sm:h-11" aria-hidden="true" /><span className="text-left text-lg font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-2xl">50% OFF<br /><span className="text-sm font-black tracking-normal text-[#FFF200] sm:text-base">em diversos serviços</span></span></div></div><div className="mb-6"><Link to="/regulamento-black-friday" className="text-xs font-semibold text-white/50 underline decoration-white/20 underline-offset-4 transition hover:text-[#FFF200] hover:decoration-[#FFF200]">Consulte o regulamento da campanha</Link></div><p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Núcleo de serviços</p><h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[96px]">Estratégia que<br /><span className="text-[#FFF200]">vira execução.</span></h1></motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="border-l border-[#FFF200] pl-6"><p className="text-lg leading-relaxed text-white/65">Conectamos negócio, marca, marketing e tecnologia para resolver o que realmente limita o seu crescimento.</p><a href="#catalogo" className="mt-7 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition hover:text-[#FFF200]">Explorar soluções <ArrowDown className="h-4 w-4" /></a></motion.div>
        </div></div>
      </section>

      <section id="catalogo" className="container-custom relative z-10 py-16 sm:py-24">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FFF200]">O que fazemos</p><h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Escolha o desafio. Nós conectamos a solução.</h2></div><p className="max-w-md text-sm leading-relaxed text-white/50">Cada frente pode ser contratada separadamente ou combinada em uma operação sob medida para o momento da sua empresa.</p></div>
        <ServiceDeck />
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
