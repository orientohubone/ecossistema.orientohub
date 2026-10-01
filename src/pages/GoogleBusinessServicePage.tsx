import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin, Search, Settings2, Star, TrendingUp } from 'lucide-react';
import type { ServiceCatalogItem } from '../data/serviceCatalog';
import LocalSearchSimulator from '../components/LocalSearchSimulator';

const GoogleBusinessServicePage = ({ service }: { service: ServiceCatalogItem }) => (
  <>
    <Helmet><title>Google Meu Negócio | Serviços OrientoHub</title><meta name="description" content={service.description} /></Helmet>
    <main className="relative z-10 isolate overflow-visible bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <section className="relative z-10 border-b border-white/10"><div className="container-custom py-14 sm:py-20 lg:py-28"><Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Todos os serviços</Link><div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Presença local</p><h1 className="mt-6 text-[clamp(2.75rem,5.4vw,4.75rem)] font-black leading-[0.94] tracking-[-0.05em]"><span className="block">Seja encontrado por</span><span className="mt-2 block whitespace-nowrap text-[#FFF200]">quem está por perto.</span></h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">{service.outcome}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#simulador-local" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Simular minha visibilidade <ArrowRight className="h-4 w-4" /></a><Link to="/contato?service=Google%20Meu%20Negócio" className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-bold hover:border-[#FFF200] hover:text-[#FFF200]">Quero otimizar meu perfil</Link></div></motion.div>
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-7 backdrop-blur-md sm:p-9"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200] text-black"><MapPin className="h-6 w-6" /></span><span className="rounded-full border border-[#FFF200]/35 bg-[#FFF200]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#FFF200]">Oferta especial</span></div><p className="mt-8 text-sm text-white/40 line-through">De R$ 499,00</p><p className="mt-1 text-5xl font-black text-[#FFF200]">R$ 249,00</p><p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/50">Diagnóstico e estruturação para tornar seu negócio mais confiável e fácil de encontrar nas buscas locais.</p></motion.aside>
      </div></div></section>

      <section className="relative z-10 container-custom py-16 sm:py-24"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Busca local</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">A decisão começa antes do contato.</h2><p className="mt-5 text-lg leading-relaxed text-white/50">Informações completas, reputação e consistência ajudam o cliente a encontrar, confiar e escolher o seu negócio.</p></div><div className="grid gap-4 sm:grid-cols-2">{service.deliverables.map((item, index) => <motion.div key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/70 p-6"><span className="text-xs font-black text-[#FFF200]">0{index + 1}</span><p className="mt-8 text-lg font-bold">{item}</p></motion.div>)}</div></div></section>

      <section id="simulador-local" className="relative z-10 border-y border-white/10 bg-black/25"><LocalSearchSimulator /></section>

      <section className="relative z-10 container-custom py-16 sm:py-24"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Como trabalhamos</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Diagnosticar, otimizar e evoluir.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{service.process.map((step, index) => { const Icon = [Search, Settings2, TrendingUp][index] || Star; return <article key={step.title} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7 transition hover:-translate-y-1 hover:border-[#FFF200]/65"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-[#FFF200]" /><span className="text-sm font-black text-white/20">0{index + 1}</span></div><h3 className="mt-9 text-2xl font-black">{step.title}</h3><p className="mt-3 leading-relaxed text-white/50">{step.description}</p></article>; })}</div></section>

      <div className="relative z-10 overflow-visible">
        <img
          src="/Logotipo G do Google em 3D Laminado.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-20 hidden w-52 -translate-y-1/2 -rotate-12 drop-shadow-[0_20px_24px_rgba(0,0,0,0.28)] 2xl:block"
        />
        <section className="bg-[#FFF200] text-black">
          <div className="container-custom pb-44 pt-10 sm:pb-64 sm:pt-12 md:pb-72 lg:min-h-[250px] lg:py-6 xl:py-4 2xl:py-7">
          <div className="relative z-30 lg:max-w-[46%] lg:translate-x-0 2xl:-translate-x-32">
            <p className="text-xs font-black uppercase tracking-[0.22em]">Sua região já está procurando</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.7vw,3rem)] font-black leading-[1.04] tracking-[-0.04em] lg:mt-2 lg:text-[40px] xl:text-[44px] 2xl:text-[48px]"><span className="block">Faça seu negócio</span><span className="mt-1 block sm:whitespace-nowrap">aparecer com <span className="inline-block bg-black px-3 py-1 text-white sm:px-4 sm:py-1.5">confiança.</span></span></h2>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold lg:mt-3"><span className="flex items-center gap-2"><Check className="h-4 w-4" />Perfil estruturado</span><span className="flex items-center gap-2"><Check className="h-4 w-4" />Presença otimizada</span></div>
            <Link to="/contato?service=Google%20Meu%20Negócio" className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-neutral-800 lg:mt-4 lg:py-3">Quero ser encontrado <ArrowRight className="h-4 w-4" /></Link>
          </div>
          </div>
        </section>
        <img src="/Vitrine Comparativa_ Loja Fechada e Vibrante.png" alt="Comparativo entre uma loja sem presença e uma loja visível e vibrante" className="absolute -bottom-12 left-1/2 z-20 w-[145%] max-w-none -translate-x-1/2 drop-shadow-[0_28px_30px_rgba(0,0,0,0.32)] sm:-bottom-16 sm:w-[120%] md:-bottom-20 md:w-[105%] lg:-top-2 lg:bottom-auto lg:left-auto lg:right-[1%] lg:w-[65%] lg:translate-x-0 xl:top-0 xl:w-[62%] 2xl:-top-10 2xl:right-0 2xl:w-[62%]" />
      </div>
    </main>
  </>
);

export default GoogleBusinessServicePage;
