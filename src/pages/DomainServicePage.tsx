import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FolderKey, Globe2, ListTree, ShieldCheck } from 'lucide-react';
import DomainPortfolio from '../components/DomainPortfolio';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

const DomainServicePage = ({ service }: { service: ServiceCatalogItem }) => {
  const processIcons = [ListTree, FolderKey, ShieldCheck];

  return (
    <>
      <Helmet>
        <title>Domínio | Serviços OrientoHub</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <main className="relative isolate overflow-x-clip bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <section className="relative z-10 border-b border-white/10">
          <div className="container-custom py-14 sm:py-20 lg:py-28">
            <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Todos os serviços</Link>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Propriedade digital</p>
                <h1 className="mt-6 text-[clamp(2.75rem,5.4vw,4.75rem)] font-black leading-[0.94] tracking-[-0.05em]"><span className="block">Seu domínio precisa estar</span><span className="mt-2 block text-[#FFF200]">seguro e sob controle.</span></h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">{service.outcome}</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/contato?service=Domínio" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Organizar meus domínios <ArrowRight className="h-4 w-4" /></Link><a href="#gestao-dominios" className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-bold transition hover:border-[#FFF200] hover:text-[#FFF200]">Ver o que gerenciamos</a></div>
              </motion.div>

              <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-7 backdrop-blur-md sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200] text-black"><Globe2 className="h-6 w-6" /></span>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Registros a partir de</p>
                <p className="mt-2 text-5xl font-black text-[#FFF200]">R$ 40,00</p>
                <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/50">O valor varia conforme extensão, registrador, disponibilidade e serviços de configuração ou gestão necessários.</p>
              </motion.aside>
            </div>
          </div>
        </section>

        <section className="relative z-10 container-custom py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Mais que registrar</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Domínio é acesso, continuidade e propriedade.</h2><p className="mt-5 text-lg leading-relaxed text-white/50">Registro, DNS, e-mail e responsáveis precisam estar organizados para evitar indisponibilidade, perda de acesso e dependência de terceiros.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{service.deliverables.map((item, index) => <motion.article key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/70 p-6"><span className="text-xs font-black text-[#FFF200]">0{index + 1}</span><p className="mt-8 text-lg font-bold">{item}</p></motion.article>)}</div>
          </div>
        </section>

        <section className="relative z-10 border-y border-white/10 bg-black/35">
          <div className="container-custom py-16 sm:py-24">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Como organizamos</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Mapear, organizar e proteger.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">{service.process.map((step, index) => { const Icon = processIcons[index] || Globe2; return <article key={step.title} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7 transition hover:-translate-y-1 hover:border-[#FFF200]/65"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-[#FFF200]" /><span className="text-sm font-black text-white/20">0{index + 1}</span></div><h3 className="mt-9 text-2xl font-black">{step.title}</h3><p className="mt-3 leading-relaxed text-white/50">{step.description}</p></article>; })}</div>
          </div>
        </section>

        <div id="gestao-dominios" className="relative z-10 scroll-mt-20"><DomainPortfolio /></div>

        <section className="relative z-10 bg-[#FFF200] text-black">
          <div className="container-custom py-14 sm:py-16"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.22em]">Evite perder um ativo digital</p><h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl">Organize registros, acessos e renovações.</h2></div><Link to="/contato?service=Domínio" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-neutral-800">Falar sobre meus domínios <ArrowRight className="h-4 w-4" /></Link></div></div>
        </section>
      </main>
    </>
  );
};

export default DomainServicePage;
