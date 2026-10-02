import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Blocks, Bot, Check, Code2, Gauge, Workflow } from 'lucide-react';
import { useState } from 'react';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

const IntelligentSystemsServicePage = ({ service }: { service: ServiceCatalogItem }) => {
  const deliveryIcons = [Blocks, Code2, Workflow, Gauge];
  const processIcons = [Workflow, Code2, Gauge];
  const [showDigitalProjects, setShowDigitalProjects] = useState(false);
  const [digitalProjectsLoaded, setDigitalProjectsLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>Sistemas Inteligentes | Serviços OrientoHub</title>
        <meta name="description" content={service.description} />
        <link rel="preconnect" href="https://www.behance.net" />
      </Helmet>

      <main className="relative isolate overflow-x-clip bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <section className="relative z-10 border-b border-white/10">
          <div className="container-custom py-14 sm:py-20 lg:py-28">
            <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Todos os serviços</Link>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Tecnologia aplicada ao negócio</p>
                <h1 className="mt-6 text-[clamp(2.75rem,5.4vw,4.75rem)] font-black leading-[0.94] tracking-[-0.05em]"><span className="block">Sistemas que reduzem</span><span className="mt-2 block text-[#FFF200]">trabalho e ampliam capacidade.</span></h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">{service.outcome}</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/contato?service=Sistemas%20inteligentes" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Falar sobre meu sistema <ArrowRight className="h-4 w-4" /></Link><a href="#como-construimos" className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-bold transition hover:border-[#FFF200] hover:text-[#FFF200]">Como construímos</a></div>
              </motion.div>

              <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-7 backdrop-blur-md sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200] text-black"><Bot className="h-6 w-6" /></span>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Projetos a partir de</p>
                <p className="mt-2 text-4xl font-black text-[#FFF200]">R$ 2.549</p>
                <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/50">O valor final varia conforme o escopo, a complexidade e as integrações necessárias. O orçamento é definido após o diagnóstico do projeto.</p>
              </motion.aside>
            </div>
          </div>
        </section>

        <section className="relative z-10 container-custom py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Tecnologia útil</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">O sistema começa pelo problema, não pela ferramenta.</h2><p className="mt-5 text-lg leading-relaxed text-white/50">Entendemos onde a operação perde tempo, informação ou capacidade. A partir disso, definimos uma solução enxuta que possa ser usada e evoluída.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{service.deliverables.map((item, index) => { const Icon = deliveryIcons[index] || Blocks; return <motion.article key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/70 p-6"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-[#FFF200]" /><span className="text-xs font-black text-white/20">0{index + 1}</span></div><p className="mt-10 text-lg font-bold">{item}</p></motion.article>; })}</div>
          </div>
        </section>

        <section className="relative z-10 border-y border-white/10 bg-black/35">
          <div className="container-custom py-16 sm:py-24">
            <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Onde aplicamos</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Soluções conectadas à rotina da empresa.</h2></div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7"><Workflow className="h-7 w-7 text-[#FFF200]" /><h3 className="mt-8 text-2xl font-black">Processos internos</h3><p className="mt-3 leading-relaxed text-white/50">Centralização de etapas, responsáveis e informações que hoje ficam dispersas.</p></article>
              <article className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7"><Bot className="h-7 w-7 text-[#FFF200]" /><h3 className="mt-8 text-2xl font-black">Automações</h3><p className="mt-3 leading-relaxed text-white/50">Execução automática de tarefas repetitivas e conexão entre ferramentas já utilizadas.</p></article>
              <article className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7"><Blocks className="h-7 w-7 text-[#FFF200]" /><h3 className="mt-8 text-2xl font-black">Produtos digitais</h3><p className="mt-3 leading-relaxed text-white/50">Protótipos e sistemas personalizados para validar e operar novas soluções.</p><button type="button" onClick={() => { setDigitalProjectsLoaded(true); setShowDigitalProjects(current => !current); }} aria-expanded={showDigitalProjects} className="mt-6 text-sm font-black uppercase text-[#FFF200] underline decoration-[#FFF200]/40 underline-offset-4 transition hover:decoration-[#FFF200]">{showDigitalProjects ? 'Recolher projetos' : 'Ver projetos'}</button></article>
            </div>
            {digitalProjectsLoaded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={showDigitalProjects ? 'overflow-hidden' : 'hidden'}>
                <div className="mt-8 border-t border-[#FFF200]/25 pt-8">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Projetos selecionados</p>
                  <h3 className="mt-2 text-3xl font-black">Produtos digitais</h3>
                  <div className="mt-6 grid max-w-[1252px] gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      <iframe src="https://www.behance.net/embed/project/256562827?ilo0=1" title="Intentia" className="block aspect-[404/316] w-full overflow-hidden" allowFullScreen loading="eager" frameBorder="0" scrolling="no" allow="clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      <iframe src="https://www.behance.net/embed/project/256566141?ilo0=1" title="SaaS Humansys" className="block aspect-[404/316] w-full overflow-hidden" allowFullScreen loading="eager" frameBorder="0" scrolling="no" allow="clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      <iframe src="https://www.behance.net/embed/project/256574877?ilo0=1" title="TIA — IA Conversacional" className="block aspect-[404/316] w-full overflow-hidden" allowFullScreen loading="eager" frameBorder="0" scrolling="no" allow="clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <section id="como-construimos" className="relative z-10 container-custom py-16 sm:py-24">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Evolução controlada</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Definir, construir e aprender.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{service.process.map((step, index) => { const Icon = processIcons[index] || Code2; return <article key={step.title} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7 transition hover:-translate-y-1 hover:border-[#FFF200]/65"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-[#FFF200]" /><span className="text-sm font-black text-white/20">0{index + 1}</span></div><h3 className="mt-9 text-2xl font-black">{step.title}</h3><p className="mt-3 leading-relaxed text-white/50">{step.description}</p></article>; })}</div>
        </section>

        <section className="relative z-10 bg-[#FFF200] text-black">
          <div className="container-custom py-14 sm:py-16"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.22em]">Existe um processo travando sua operação?</p><h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl">Transforme o gargalo em um sistema utilizável.</h2><div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">{['Escopo orientado ao problema', 'Primeira versão utilizável', 'Evolução baseada no uso'].map(item => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4" />{item}</span>)}</div></div><Link to="/contato?service=Sistemas%20inteligentes" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-neutral-800">Quero avaliar meu projeto <ArrowRight className="h-4 w-4" /></Link></div></div>
        </section>
      </main>
    </>
  );
};

export default IntelligentSystemsServicePage;
