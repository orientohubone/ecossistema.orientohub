import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Check,
  Compass,
  Lightbulb,
  Network,
  Rocket,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
};

const commitments = [
  {
    number: '01',
    icon: Compass,
    title: 'Propósito acima do acaso',
    content: 'Ideias não avançam apenas porque são boas. Elas precisam de contexto, escolhas e direção. Existimos para transformar intenção em movimento consciente.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'Inovação com direção',
    content: 'Inovar não é acumular novidades. É enxergar o problema certo, desafiar o óbvio e construir uma resposta que faça diferença no mundo real.',
  },
  {
    number: '03',
    icon: Lightbulb,
    title: 'Método encontra criatividade',
    content: 'A imaginação abre caminhos. O método transforma caminhos em decisões. Unimos os dois para aprender rápido sem perder profundidade.',
  },
  {
    number: '04',
    icon: Network,
    title: 'Construção é coletiva',
    content: 'Nenhuma transformação relevante acontece isoladamente. Conectamos repertórios, competências e pessoas para multiplicar possibilidades.',
  },
];

const principles = [
  { icon: Target, title: 'Impacto antes de atividade', description: 'Movimento só importa quando produz avanço real.' },
  { icon: Brain, title: 'Clareza antes de velocidade', description: 'A pressa sem direção apenas acelera o erro.' },
  { icon: ShieldCheck, title: 'Evidência antes de certeza', description: 'Hipóteses são testadas, não tratadas como verdades.' },
  { icon: Lightbulb, title: 'Curiosidade antes de fórmula', description: 'Cada contexto pede perguntas e caminhos próprios.' },
  { icon: Network, title: 'Colaboração antes de ego', description: 'Conhecimento cresce quando circula e se conecta.' },
  { icon: Zap, title: 'Execução antes de discurso', description: 'Estratégia ganha valor quando muda a realidade.' },
];

const ManifestoPage = () => (
  <div className="relative min-h-screen overflow-x-hidden text-white">
    <Helmet>
      <title>Manifesto | Orientohub</title>
      <meta name="description" content="Conheça os princípios que orientam a OrientoHub: clareza, método, colaboração e execução para transformar ideias em avanço real." />
    </Helmet>

    <div className="fixed inset-0 -z-50 bg-gradient-to-br from-black via-gray-900 to-black" />
    <div className="pointer-events-none fixed inset-0 -z-50 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

    <main className="relative z-10">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#FFF200]/[0.06] blur-[120px]" />
        <div className="container-custom grid min-h-[720px] items-center gap-12 py-28 lg:grid-cols-[1.2fr_0.8fr] lg:py-32">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="liquid-glass" className="gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2">
              <Compass className="h-3.5 w-3.5 shrink-0 text-[#FFF200]" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-xs">
                Nosso manifesto
              </span>
            </Badge>
            <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.05em] sm:text-7xl lg:text-[5.5rem]">
              Ideias não mudam o mundo <span className="text-[#FFF200]">paradas.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              Entre intenção e impacto existe um campo de escolhas. É nele que colocamos clareza, método e capacidade de execução.
            </p>
          </motion.div>

          <motion.aside initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.7 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d]/90 p-6 backdrop-blur sm:p-8">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200] to-transparent" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">No que acreditamos</p>
            <blockquote className="mt-6 text-2xl font-black leading-snug sm:text-3xl">“Estratégia não é prever o futuro. É construir condições para avançar.”</blockquote>
            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              {['Pensar com profundidade', 'Decidir com clareza', 'Construir com propósito'].map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm font-semibold text-white/65"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#FFF200] text-black"><Check className="h-3.5 w-3.5" /></span>{item}</p>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <SectionDivider topSpacing="tight" />

      <section className="container-custom py-16 sm:py-24">
        <motion.div {...reveal} className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">O problema que recusamos</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Improviso disfarçado de progresso.</h2></div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/55">Vivemos em uma era em que fazer mais parece significar avançar. Mas volume não é direção, urgência não é prioridade e novidade não é inovação. Nós escolhemos outro caminho.</p>
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {commitments.map((item, index) => <CommitmentCard key={item.number} {...item} index={index} />)}
        </div>
      </section>

      <SectionDivider />

      <section className="container-custom py-16 sm:py-24">
        <motion.div {...reveal} className="relative overflow-hidden rounded-3xl border border-[#FFF200]/30 bg-[#0d131d] px-6 py-12 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,242,0,0.12),transparent_48%)]" />
          <p className="relative text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Nosso propósito</p>
          <h2 className="relative mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl">Transformar inteligência em <span className="text-[#FFF200]">capacidade de avançar.</span></h2>
          <p className="relative mx-auto mt-6 max-w-2xl leading-relaxed text-white/55">Da ideia à execução, criamos as conexões, os métodos e as estruturas que tornam o próximo movimento possível.</p>
        </motion.div>
      </section>

      <SectionDivider />

      <section className="container-custom py-16 sm:py-24">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Princípios em prática</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">O que orienta cada escolha.</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/55">Não são palavras para a parede. São critérios para decidir como pensamos, colaboramos e construímos.</p>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, index) => <PrincipleCard key={principle.title} {...principle} number={index + 1} />)}
        </div>
      </section>

      <SectionDivider />

      <section className="container-custom py-16 sm:py-28">
        <motion.div {...reveal} className="grid gap-10 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,242,0,0.09),rgba(13,19,29,0.96)_42%)] p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">O movimento começa agora</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl">O futuro não pertence a quem corre mais. Pertence a quem sabe <span className="text-[#FFF200]">para onde ir.</span></h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">Se existe algo que merece sair do campo da intenção, existe um próximo passo para construir.</p>
          </div>
          <Link to="/contato" className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#FFF200] px-7 py-4 font-black text-black transition hover:bg-[#fff76a]">
            Começar uma conversa <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  </div>
);

type CommitmentCardProps = (typeof commitments)[number] & { index: number };

const CommitmentCard = ({ number, icon: Icon, title, content, index }: CommitmentCardProps) => (
  <motion.article {...reveal} transition={{ delay: index * 0.06 }} className="group relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#FFF200]/45 sm:p-8">
    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent opacity-30 transition group-hover:opacity-100" />
    <div className="flex items-start justify-between gap-5"><span className="grid h-12 w-12 place-items-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10 text-[#FFF200]"><Icon className="h-5 w-5" /></span><span className="text-4xl font-black text-white/[0.07]">{number}</span></div>
    <h3 className="mt-10 text-2xl font-black">{title}</h3>
    <p className="mt-4 leading-relaxed text-white/50">{content}</p>
  </motion.article>
);

type PrincipleCardProps = (typeof principles)[number] & { number: number };

const PrincipleCard = ({ icon: Icon, title, description, number }: PrincipleCardProps) => (
  <motion.article {...reveal} transition={{ delay: number * 0.04 }} className="group relative min-h-[220px] bg-[#0d131d] p-6 transition hover:bg-[#111925] sm:p-7">
    <div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF200] text-black"><Icon className="h-5 w-5" /></span><span className="text-xs font-black tracking-[0.18em] text-[#FFF200]/35">0{number}</span></div>
    <h3 className="mt-8 text-xl font-black transition-colors group-hover:text-[#FFF200]">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-white/45">{description}</p>
  </motion.article>
);

export default ManifestoPage;
