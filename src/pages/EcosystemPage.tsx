import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Layers,
  Lightbulb,
  Mic2,
  Rocket,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';

type Layer = {
  number: string;
  id: string;
  title: string;
  role: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const layers: Layer[] = [
  { number: '01', id: 'nucleo', title: 'Núcleo', role: 'Estratégia e execução', description: 'Serviços que entendem o desafio, definem a direção e constroem a solução.', icon: Target },
  { number: '02', id: 'plataforma', title: 'Plataforma', role: 'Método e continuidade', description: 'Tecnologia que organiza projetos, decisões e a jornada empreendedora.', icon: Lightbulb },
  { number: '03', id: 'mvps', title: 'MVPs', role: 'Experimentação e produtos', description: 'Problemas reais transformados em soluções que podem ser testadas e evoluídas.', icon: Rocket },
  { number: '04', id: 'verticais', title: 'Verticais', role: 'Conhecimento e expansão', description: 'Iniciativas que ampliam o alcance da Orientohub e criam novas conexões.', icon: TrendingUp },
];

const mvps = [
  { name: 'Humansys + BrainSys', label: 'Gestão de pessoas', preview: '/sites/Site-humansys.png', href: 'https://humansys.com.br' },
  { name: 'Intentia', label: 'Estratégia de mídia B2B', preview: '/sites/Site-intentia.png', href: 'https://intentia.com.br' },
  { name: 'Forgether', label: 'Educação tecnológica', preview: '/sites/Site-forgether.png', href: 'https://forgether.vercel.app/' },
  { name: 'Penttia', label: 'Cybersecurity', preview: '/sites/Site-penttia.jpg', href: 'https://penttiacybersecurity.vercel.app' },
];

const verticals = [
  { name: 'Oriento Academy', label: 'Educação prática', icon: GraduationCap, href: '/academy' },
  { name: 'Oriento Expertise', label: 'Consultoria, mentoria e workshops', icon: BookOpen, href: '/servicos' },
  { name: 'Oriento Ventures', label: 'Oportunidades e novos negócios', icon: Briefcase },
  { name: 'Orientados', label: 'Conteúdo e conversas', icon: Mic2 },
];

const servicePillars = [
  { number: '01', title: 'Estratégia', description: 'Direção, prioridades e posicionamento para orientar o crescimento.', icon: Target, services: [['Estratégia', 'estrategia'], ['Inovação', 'inovacao']] },
  { number: '02', title: 'Marketing & demanda', description: 'Presença, autoridade e aquisição conectadas ao objetivo do negócio.', icon: TrendingUp, services: [['Marketing', 'marketing'], ['Mídia paga', 'midia-paga'], ['Google Meu Negócio', 'google-meu-negocio']] },
  { number: '03', title: 'Marca & ativos', description: 'Identidade e propriedades que tornam a empresa reconhecível e protegida.', icon: Lightbulb, services: [['Design', 'design'], ['Marcas', 'marcas'], ['Naming', 'naming'], ['Domínio', 'dominio']] },
  { number: '04', title: 'Produtos digitais', description: 'Tecnologia e canais digitais construídos para operar, vender e evoluir.', icon: Rocket, services: [['Sistemas inteligentes', 'sistemas-inteligentes'], ['Sites', 'sites'], ['E-commerce', 'e-commerce']] },
];

const journeyPhases = [
  { name: 'Ideação', description: 'Validação inicial da sua ideia de negócio', icon: Lightbulb, missions: [['Definir problema a resolver', 'Lean Canvas · Customer Development', 100], ['Identificar público-alvo', 'Mapa de Empatia', 100], ['Levantamento de hipóteses', 'Hipóteses validáveis', 150], ['Proposta de valor única', 'Value Proposition Canvas', 150]] },
  { name: 'Validação', description: 'Teste e validação da sua solução no mercado', icon: Target, missions: [['Criar MVP (Produto Mínimo Viável)', 'Startup Enxuta (Lean)', 200], ['Entrevistar potenciais clientes', 'Jobs to be Done', 150], ['Testar hipóteses principais', 'Experimentos', 200], ['Ajustar produto baseado em feedback', 'Product-Market Fit', 150]] },
  { name: 'Estruturação', description: 'Construção da estrutura do negócio', icon: Users, missions: [['Formalizar a empresa', 'Estrutura empresarial', 200], ['Montar time inicial', 'Pessoas e competências', 250], ['Definir processos operacionais', 'OKRs', 200], ['Criar modelo de negócio', 'Business Model Canvas', 250]] },
  { name: 'Tração', description: 'Crescimento e conquista de mercado', icon: TrendingUp, missions: [['Alcançar primeiros 100 clientes', 'Aquisição inicial', 300], ['Estabelecer canais de aquisição', 'Canais de crescimento', 250], ['Otimizar funil de vendas', 'SaaS B2B Estratégia', 200], ['Atingir Product-Market Fit', 'PMF Survey', 350]] },
  { name: 'Escala', description: 'Crescimento exponencial e expansão', icon: Rocket, missions: [['Captar investimento Anjo/Seed', 'Captação', 400], ['Expandir equipe', 'SAFe · Scrum · Agile', 300], ['Escalar operações', 'Operação', 350], ['Expandir novos mercados', 'Expansão', 450]] },
];

const reveal = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 } };

const EcosystemPage = () => (
  <div className="relative isolate min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
    <Helmet>
      <title>Ecossistema Orientohub | Quatro camadas conectadas</title>
      <meta name="description" content="Conheça as quatro camadas do ecossistema Orientohub: Núcleo, Plataforma, MVPs e Verticais." />
    </Helmet>
    <div className="pointer-events-none fixed inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

    <main className="relative z-10">
      <section className="border-b border-white/10">
        <div className="container-custom flex min-h-[620px] flex-col items-center justify-center py-20 text-center sm:min-h-[680px]">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-[#FFF200]/40 bg-[#FFF200]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FFF200]">
            <Layers className="h-4 w-4" /> Arquitetura do ecossistema
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-7 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Quatro camadas. <span className="text-[#FFF200]">Um ecossistema conectado.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="mt-6 max-w-3xl text-base leading-relaxed text-white/65 sm:text-xl">
            Serviços, tecnologia, produtos e iniciativas de expansão trabalhando como uma única estrutura.
          </motion.p>
          <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} href="#mapa" className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-[#FFF200]">
            Entenda as camadas <ArrowDown className="h-4 w-4" />
          </motion.a>
        </div>
      </section>

      <section id="mapa" className="container-custom py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Mapa do ecossistema</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Uma estrutura. Quatro funções.</h2>
          <p className="mt-4 leading-relaxed text-white/55">As camadas não competem entre si. Cada uma resolve uma parte diferente da jornada e fortalece as demais.</p>
        </div>

        <motion.nav {...reveal} aria-label="Camadas do ecossistema" className="relative mt-12 grid gap-0 lg:grid-cols-4">
          <span className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-[#FFF200]/55 to-transparent lg:block" />
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <a key={layer.id} href={`#${layer.id}`} className="group relative flex min-w-0 items-center gap-4 border-l border-white/10 py-5 pl-5 lg:flex-col lg:border-l-0 lg:px-4 lg:py-0 lg:text-center">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#FFF200]/45 bg-[#0d131d] text-[#FFF200] transition group-hover:bg-[#FFF200] group-hover:text-black"><Icon className="h-5 w-5" /></span>
                <div className="min-w-0 lg:mt-5"><span className="text-[10px] font-black tracking-[0.2em] text-[#FFF200]/60">{layer.number}</span><h3 className="mt-1 text-lg font-black">{layer.title}</h3><p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">{layer.role}</p></div>
              </a>
            );
          })}
        </motion.nav>
      </section>

      <NucleusLayer />

      <PlatformLayer />

      <MvpLayer />

      <VerticalLayer />

      <section className="container-custom py-16 sm:py-24">
        <motion.div {...reveal} className="relative overflow-hidden rounded-2xl border border-[#FFF200]/30 bg-[#0d131d] px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200] to-transparent" />
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Seu ponto de entrada</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Qual desafio trouxe sua empresa até aqui?</h2><p className="mt-4 max-w-xl leading-relaxed text-white/55">A conversa começa pelo contexto. A camada certa vem depois.</p></div>
          <Link to="/contato" className="mt-8 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-3.5 text-sm font-black text-black transition hover:opacity-90 lg:mt-0">Conversar com a Orientohub <ArrowRight className="h-4 w-4" /></Link>
        </motion.div>
      </section>
    </main>
  </div>
);

const NucleusLayer = () => (
  <section id="nucleo" className="scroll-mt-24 border-t border-white/10">
    <motion.div {...reveal} className="container-custom py-16 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10"><Target className="h-5 w-5 text-[#FFF200]" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFF200]">Camada 01</p><p className="text-sm font-bold text-white/45">Estratégia e execução</p></div></div><h2 className="mt-7 text-3xl font-black tracking-tight sm:text-5xl">O Núcleo de serviços da Orientohub.</h2></div>
        <div><p className="max-w-2xl leading-relaxed text-white/55">Uma operação multidisciplinar organizada em quatro frentes. O diagnóstico define quais competências entram no projeto e como elas trabalham juntas.</p><TextLink to="/servicos">Conhecer todos os serviços</TextLink></div>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {servicePillars.map((pillar) => { const Icon = pillar.icon; return <article key={pillar.title} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FFF200]/30 bg-[#FFF200]/10"><Icon className="h-5 w-5 text-[#FFF200]" /></span><span className="text-xs font-black tracking-[0.18em] text-[#FFF200]/40">{pillar.number}</span></div><h3 className="mt-6 text-xl font-black">{pillar.title}</h3><p className="mt-2 min-h-[60px] text-sm leading-relaxed text-white/45">{pillar.description}</p><div className="mt-5 border-t border-white/10 pt-2">{pillar.services.map(([name, slug]) => <Link key={slug} to={`/servicos/${slug}`} className="group flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 text-sm font-semibold text-white/70 last:border-0"><span>{name}</span><ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/20 transition group-hover:translate-x-1 group-hover:text-[#FFF200]" /></Link>)}</div></article>; })}
      </div>
    </motion.div>
  </section>
);

const PlatformLayer = () => {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const phase = journeyPhases[selectedPhase];
  const PhaseIcon = phase.icon;
  return (
    <section id="plataforma" className="scroll-mt-24 border-t border-white/10">
      <motion.div {...reveal} className="container-custom py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10"><Lightbulb className="h-5 w-5 text-[#FFF200]" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFF200]">Camada 02</p><p className="text-sm font-bold text-white/45">Método e continuidade</p></div></div><h2 className="mt-7 text-3xl font-black tracking-tight sm:text-5xl">A Jornada Empreendedora dentro da plataforma.</h2></div>
          <div><p className="max-w-2xl leading-relaxed text-white/55">A mesma estrutura disponível no produto: cinco cards de fase, missões, frameworks e XP para orientar o avanço do negócio.</p><TextLink to="/dashboard/jornada">Acessar a Jornada Empreendedora</TextLink></div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {journeyPhases.map((item, index) => { const Icon = item.icon; const active = selectedPhase === index; return <button key={item.name} type="button" onClick={() => setSelectedPhase(index)} className={`relative min-h-[220px] rounded-2xl border-2 p-5 text-left transition duration-300 ${active ? 'border-[#FFF200]/70 bg-[#FFF200]/10 shadow-[0_18px_50px_rgba(255,242,0,0.08)]' : 'border-white/10 bg-[#0d131d] hover:border-[#FFF200]/35 hover:bg-[#111925]'}`}><span className={`flex h-12 w-12 items-center justify-center rounded-xl ${active ? 'bg-[#FFF200] text-black' : 'bg-[#FFF200]/10 text-[#FFF200]'}`}><Icon className="h-6 w-6" /></span><p className="mt-6 text-[10px] font-black uppercase tracking-[0.16em] text-[#FFF200]/65">Fase {index + 1}</p><h3 className="mt-1 text-lg font-black">{item.name}</h3><p className="mt-2 text-xs leading-relaxed text-white/45">{item.description}</p><p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-white/30">4 missões</p></button>; })}
        </div>

        <motion.div key={phase.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-white/10 bg-[#0d131d] p-5 sm:p-7">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF200]/10"><PhaseIcon className="h-7 w-7 text-[#FFF200]" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FFF200]">Fase {selectedPhase + 1} de 5</p><h3 className="mt-1 text-2xl font-black">{phase.name}</h3><p className="mt-1 text-sm text-white/45">{phase.description}</p></div></div><span className="text-xs font-bold text-white/35">Missões da fase</span></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{phase.missions.map(([mission, framework, xp]) => <div key={String(mission)} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#151f2b] p-4"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#FFF200]" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-white/85">{mission}</p><p className="mt-1 truncate text-xs text-white/40">{framework}</p></div><span className="shrink-0 rounded-full bg-[#FFF200]/10 px-2.5 py-1 text-[10px] font-black text-[#FFF200]">+{xp} XP</span></div>)}</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const MvpLayer = () => (
  <section id="mvps" className="scroll-mt-24 border-t border-white/10">
    <motion.div {...reveal} className="container-custom py-16 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10"><Rocket className="h-5 w-5 text-[#FFF200]" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFF200]">Camada 03</p><p className="text-sm font-bold text-white/45">Experimentação e produtos</p></div></div><h2 className="mt-7 text-3xl font-black tracking-tight sm:text-5xl">Aprendizado transformado em produto.</h2></div>
        <p className="max-w-2xl leading-relaxed text-white/55">Soluções próprias em diferentes momentos de validação e evolução. Cada projeto nasce de um problema concreto e amplia a capacidade de experimentação do ecossistema.</p>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {mvps.map((item) => <MvpShowcase key={item.name} {...item} />)}
      </div>
    </motion.div>
  </section>
);

const MvpShowcase = ({ name, label, preview, href }: { name: string; label: string; preview?: string; href: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d] transition duration-300 hover:-translate-y-1 hover:border-[#FFF200]/45">
    <div className="relative aspect-[16/8] overflow-hidden border-b border-white/10 bg-[#111925]">
      {preview ? <img src={preview} alt={`Preview de ${name}`} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,242,0,0.14),_transparent_65%)]"><Rocket className="h-10 w-10 text-[#FFF200]" /></div>}
    </div>
    <div className="p-4">
      <h3 className="truncate text-lg font-black">{name}</h3>
      <div className="mt-2 flex items-end justify-between gap-3"><p className="min-w-0 truncate text-[9px] font-black uppercase tracking-[0.14em] text-[#FFF200]">{label}</p><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition group-hover:border-[#FFF200]/40 group-hover:text-[#FFF200]"><ArrowRight className="h-3.5 w-3.5" /></span></div>
    </div>
  </a>
);

const VerticalLayer = () => (
  <section id="verticais" className="scroll-mt-24 border-t border-white/10">
    <motion.div {...reveal} className="container-custom py-16 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10"><TrendingUp className="h-5 w-5 text-[#FFF200]" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFF200]">Camada 04</p><p className="text-sm font-bold text-white/45">Conhecimento e expansão</p></div></div><h2 className="mt-7 text-3xl font-black tracking-tight sm:text-5xl">Novas formas de compartilhar e crescer.</h2></div>
        <p className="max-w-2xl leading-relaxed text-white/55">Iniciativas com propósitos distintos em educação, conhecimento aplicado, novos negócios e conteúdo.</p>
      </div>
      <div className="relative mt-12 grid gap-0 lg:grid-cols-4">
        <span className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-[#FFF200]/45 to-transparent lg:block" />
        {verticals.map((item, index) => <VerticalItem key={item.name} {...item} index={index} />)}
      </div>
    </motion.div>
  </section>
);

const VerticalItem = ({ name, label, icon: Icon, href, index }: { name: string; label: string; icon: ComponentType<{ className?: string }>; href?: string; index: number }) => {
  const body = <><span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#FFF200]/45 bg-[#0d131d] text-[#FFF200] transition group-hover:bg-[#FFF200] group-hover:text-black"><Icon className="h-5 w-5" /></span><div className="min-w-0 lg:mt-5"><span className="text-[10px] font-black tracking-[0.2em] text-[#FFF200]/60">0{index + 1}</span><h3 className="mt-1 text-lg font-black">{name}</h3><p className="mt-1 text-xs uppercase leading-relaxed tracking-[0.1em] text-white/40">{label}</p></div></>;
  const classes = 'group relative flex min-w-0 items-center gap-4 border-l border-white/10 py-5 pl-5 transition lg:flex-col lg:border-l-0 lg:px-4 lg:py-0 lg:text-center';
  return href ? <Link to={href} className={classes}>{body}</Link> : <div className={classes}>{body}</div>;
};

const TextLink = ({ to, children }: { to: string; children: ReactNode }) => <Link to={to} className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#FFF200] transition hover:text-white">{children} <ArrowRight className="h-4 w-4" /></Link>;

export default EcosystemPage;
