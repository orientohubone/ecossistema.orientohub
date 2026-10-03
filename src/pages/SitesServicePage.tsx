import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Code2, LayoutTemplate, MousePointerClick, Rocket, Search, Smartphone } from 'lucide-react';
import SitePortfolio from '../components/SitePortfolio';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

const SitesServicePage = ({ service }: { service: ServiceCatalogItem }) => {
  const processIcons = [LayoutTemplate, Code2, Rocket];

  return (
    <>
      <Helmet>
        <title>Criação de Sites | Serviços OrientoHub</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <main className="relative isolate overflow-x-clip bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <section className="relative z-10 border-b border-white/10">
          <div className="container-custom py-14 sm:py-20 lg:py-28">
            <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Todos os serviços</Link>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFF200]"><span className="h-px w-10 bg-[#FFF200]" />Sites orientados à conversão</p>
                <h1 className="mt-6 text-[clamp(2.75rem,5.4vw,4.75rem)] font-black leading-[0.94] tracking-[-0.05em]"><span className="block">Bonito não basta.</span><span className="mt-2 block text-[#FFF200]">Seu site precisa funcionar.</span></h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">{service.outcome}</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/contato?service=Sites" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-white">Quero criar meu site <ArrowRight className="h-4 w-4" /></Link><a href="#portfolio-sites" className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-bold transition hover:border-[#FFF200] hover:text-[#FFF200]">Ver projetos publicados</a></div>
              </motion.div>

              <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-[#FFF200]/35 bg-gray-900/85 p-7 backdrop-blur-md sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF200] text-black"><MousePointerClick className="h-6 w-6" /></span>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Projetos a partir de</p>
                <p className="mt-2 text-5xl font-black text-[#FFF200]">R$ 997</p>
                <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/50">O investimento varia conforme número de páginas, conteúdo, integrações, funcionalidades e complexidade do projeto. A proposta final é definida após o escopo.</p>
              </motion.aside>
            </div>
          </div>
        </section>

        <div id="portfolio-sites" className="relative z-10 scroll-mt-20"><SitePortfolio /></div>

        <section className="relative z-10 container-custom py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Da mensagem à publicação</p><h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Cada página precisa conduzir uma decisão.</h2><p className="mt-5 text-lg leading-relaxed text-white/50">Organizamos conteúdo, navegação e pontos de conversão para o visitante entender a empresa, reconhecer valor e saber qual é o próximo passo.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{service.deliverables.map((item, index) => <motion.article key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/70 p-6"><span className="text-xs font-black text-[#FFF200]">0{index + 1}</span><p className="mt-8 text-lg font-bold">{item}</p></motion.article>)}</div>
          </div>
        </section>

        <section className="relative z-10 border-y border-white/10 bg-black/35">
          <div className="container-custom py-16 sm:py-24">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Como construímos</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Planejar, desenvolver e publicar.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">{service.process.map((step, index) => { const Icon = processIcons[index] || Code2; return <article key={step.title} className="rounded-2xl border border-[#FFF200]/30 bg-gray-900/75 p-7 transition hover:-translate-y-1 hover:border-[#FFF200]/65"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-[#FFF200]" /><span className="text-sm font-black text-white/20">0{index + 1}</span></div><h3 className="mt-9 text-2xl font-black">{step.title}</h3><p className="mt-3 leading-relaxed text-white/50">{step.description}</p></article>; })}</div>
          </div>
        </section>

        <section className="relative z-10 container-custom py-16 sm:py-24">
          <div className="grid gap-8 rounded-2xl border border-[#FFF200]/35 bg-gray-900/80 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Pronto para receber pessoas</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Uma presença digital que não depende só da aparência.</h2><p className="mt-5 max-w-2xl leading-relaxed text-white/55">O projeto considera experiência em diferentes telas, estrutura para mecanismos de busca e caminhos claros para contato ou conversão.</p></div>
            <ul className="space-y-4">{[
              { Icon: Smartphone, text: 'Experiência responsiva em celular, tablet e desktop' },
              { Icon: Search, text: 'Estrutura técnica e conteúdo preparados para SEO' },
              { Icon: MousePointerClick, text: 'Chamadas para ação alinhadas ao objetivo do projeto' },
              { Icon: Rocket, text: 'Validação e publicação do ambiente final' },
            ].map(({ Icon, text }) => <li key={text} className="flex gap-3 border-b border-white/10 pb-4 text-sm font-semibold text-white/75 last:border-0 last:pb-0"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#FFF200]" />{text}</li>)}</ul>
          </div>
        </section>

        <section className="relative z-10 bg-[#FFF200] text-black">
          <div className="container-custom py-14 sm:py-16"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.22em]">Seu site é parte da operação</p><h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl">Transforme visitas em próximas conversas.</h2><div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">{['Mensagem clara', 'Navegação responsiva', 'Conversão planejada'].map(item => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4" />{item}</span>)}</div></div><Link to="/contato?service=Sites" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-neutral-800">Solicitar proposta <ArrowRight className="h-4 w-4" /></Link></div></div>
        </section>
      </main>
    </>
  );
};

export default SitesServicePage;
