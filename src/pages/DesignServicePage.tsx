import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Layers3, MousePointer2, Palette, PenTool, Shapes } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

const portfolioProjects: Record<string, Array<{ title: string; projectId: string }>> = {
  'Identidade visual': [
    { title: 'Penttia Cyber Security', projectId: '256669131' },
    { title: 'FK Marcenaria', projectId: '225190655' },
    { title: 'Complep', projectId: '168125181' },
    { title: 'OrientoHub', projectId: '163511823' },
    { title: 'Acácias Imóveis', projectId: '159432677' },
    { title: 'Encanto Fashion', projectId: '159431637' },
    { title: 'Igreja Templo Nacional de Missões', projectId: '167644407' },
  ],
  'Design system': [
    { title: 'Penttia Cyber Security', projectId: '256678215' },
    { title: 'Intentia', projectId: '256562827' },
    { title: 'SaaS Humansys', projectId: '256566141' },
    { title: 'TIA — IA Conversacional', projectId: '256574877' },
  ],
  'Peças publicitárias': [
    { title: 'Social Media — OrientoHub', projectId: '163513195' },
    { title: 'Social Media — Cofisc', projectId: '150475965' },
    { title: 'Acelerar — Infoproduto', projectId: '162869683' },
  ],
};

const DesignServicePage = ({ service }: { service: ServiceCatalogItem }) => {
  const processIcons = [MousePointer2, PenTool, Layers3];
  const [openPortfolio, setOpenPortfolio] = useState<string | null>(null);
  const [loadedPortfolios, setLoadedPortfolios] = useState<Set<string>>(() => new Set());
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPortfolio) return;
    const frame = requestAnimationFrame(() => portfolioSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [openPortfolio]);

  return (
    <>
      <Helmet>
        <title>Design | Serviços OrientoHub</title>
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
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Design estratégico</p>
                <h1 className="mt-6 text-[clamp(2.75rem,5.4vw,4.75rem)] font-black leading-[0.94] tracking-[-0.05em]"><span className="block">Bonito chama atenção.</span><span className="mt-2 block text-[#FFF200]">Clareza gera decisão.</span></h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">{service.outcome}</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/contato?service=Design" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Quero elevar meu design <ArrowRight className="h-4 w-4" /></Link><a href="#solucoes-design" className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-bold transition hover:border-[#FFF200] hover:text-[#FFF200]">Ver soluções</a></div>
              </motion.div>

              <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-7 backdrop-blur-md sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200] text-black"><Palette className="h-6 w-6" /></span>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">O foco</p>
                <p className="mt-3 text-2xl font-black leading-snug">{service.description}</p>
              </motion.aside>
            </div>
          </div>
        </section>

        <section className="relative z-10 container-custom py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Design com propósito</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Cada elemento precisa cumprir uma função.</h2><p className="mt-5 text-lg leading-relaxed text-white/50">Não criamos apenas uma aparência. Construímos sistemas visuais que organizam mensagens, facilitam escolhas e dão consistência à experiência da marca.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{service.deliverables.map((item, index) => <motion.article key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/70 p-6"><div className="flex items-center justify-between"><Shapes className="h-6 w-6 text-[#FFF200]" /><span className="text-xs font-black text-white/20">0{index + 1}</span></div><p className="mt-10 text-lg font-bold">{item}</p></motion.article>)}</div>
          </div>
        </section>

        {service.options && service.options.length > 0 && (
          <section id="solucoes-design" className="relative z-10 border-y border-white/10 bg-black/35">
            <div className="container-custom py-16 sm:py-24">
              <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Soluções de design</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Escolha o ponto que sua marca precisa resolver agora.</h2><p className="mt-5 text-lg text-white/50">Escopos objetivos para necessidades diferentes, mantendo direção visual e qualidade em cada entrega.</p></div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {service.options.map((option, index) => (
                  <motion.article key={option.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className={`group flex min-h-[330px] flex-col rounded-2xl border bg-gray-900/80 p-6 transition hover:-translate-y-1 hover:border-[#FFF200] ${openPortfolio === option.title ? 'border-[#FFF200] ring-1 ring-[#FFF200]/35' : 'border-[#FFF200]/30'}`}>
                    <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF200] text-sm font-black text-black">0{index + 1}</span><span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">{option.suffix ? 'Por peça' : 'Projeto'}</span></div>
                    <h3 className="mt-7 text-2xl font-black">{option.title}</h3>
                    {option.description && <p className="mt-3 text-sm leading-relaxed text-white/50">{option.description}</p>}
                    <div className="mt-auto border-t border-white/10 pt-5">{option.prefix && <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">{option.prefix}</p>}<p className="mt-1 text-3xl font-black text-[#FFF200]">{formatPrice(option.price)}{option.suffix && <span className="text-sm text-white/45">{option.suffix}</span>}</p><div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3"><Link to={`/contato?service=Design&message=${encodeURIComponent(`Olá, tenho interesse em ${option.title}.`)}`} className="inline-flex items-center gap-2 text-sm font-black uppercase text-white transition group-hover:text-[#FFF200]">Tenho interesse <ArrowRight className="h-4 w-4" /></Link>{portfolioProjects[option.title]?.length > 0 && <button type="button" onClick={() => { setLoadedPortfolios(current => new Set(current).add(option.title)); setOpenPortfolio(current => current === option.title ? null : option.title); }} aria-expanded={openPortfolio === option.title} className="text-sm font-black uppercase text-[#FFF200] underline decoration-[#FFF200]/40 underline-offset-4 transition hover:decoration-[#FFF200]">{openPortfolio === option.title ? 'Recolher projetos' : 'Ver projetos'}</button>}</div></div>
                  </motion.article>
                ))}
              </div>
              {Array.from(loadedPortfolios).map(portfolioName => (
                <motion.div ref={openPortfolio === portfolioName ? portfolioSectionRef : undefined} key={portfolioName} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={openPortfolio === portfolioName ? 'scroll-mt-24 overflow-hidden' : 'hidden'}>
                  <div className="mt-8 border-t border-[#FFF200]/25 pt-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Projetos selecionados</p><h3 className="mt-2 text-3xl font-black">{portfolioName}</h3></div><a href="https://www.behance.net/fernandoramalho1" target="_blank" rel="noreferrer" className="text-sm font-bold text-white/55 transition hover:text-[#FFF200]">Ver portfólio completo no Behance</a></div>
                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {portfolioProjects[portfolioName].map(project => (
                        <div key={project.projectId} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                          <iframe src={`https://www.behance.net/embed/project/${project.projectId}?ilo0=1`} title={project.title} className="block aspect-[404/316] w-full overflow-hidden" allowFullScreen loading="eager" frameBorder="0" scrolling="no" allow="clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="relative z-10 container-custom py-16 sm:py-24">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Do contexto ao sistema</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Entender, desenhar e refinar.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{service.process.map((step, index) => { const Icon = processIcons[index] || PenTool; return <article key={step.title} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7 transition hover:-translate-y-1 hover:border-[#FFF200]/65"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-[#FFF200]" /><span className="text-sm font-black text-white/20">0{index + 1}</span></div><h3 className="mt-9 text-2xl font-black">{step.title}</h3><p className="mt-3 leading-relaxed text-white/50">{step.description}</p></article>; })}</div>
        </section>

        <section className="relative z-10 bg-[#FFF200] text-black">
          <div className="container-custom py-14 sm:py-16"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.22em]">Sua marca também fala pela forma</p><h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl">Dê forma ao valor que você entrega.</h2><div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">{['Mais clareza', 'Mais consistência', 'Mais reconhecimento'].map(item => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4" />{item}</span>)}</div></div><Link to="/contato?service=Design" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-neutral-800">Quero melhorar meu design <ArrowRight className="h-4 w-4" /></Link></div></div>
        </section>
      </main>
    </>
  );
};

export default DesignServicePage;
