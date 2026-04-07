import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, Users, Target, Lightbulb, ExternalLink } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import type { ComponentType } from 'react';

type IconType = ComponentType<{
  className?: string;
}>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

type EcosystemLayer = {
  number: string;
  title: string;
  description: string;
  icon: IconType;
  color: string;
  href?: string;
  ctaLabel?: string;
};

type QuickAction = {
  title: string;
  description: string;
  link: string;
  icon: IconType;
};

type SectionHeaderProps = {
  icon: IconType;
  label: string;
  title: string;
  description?: string;
  titleClassName: string;
  descriptionClassName?: string;
  containerClassName?: string;
};

// Shared page background texture used by the hero and all sections.
const heroBackgroundStyle = {
  backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
  backgroundSize: '40px 40px',
  pointerEvents: 'none' as const,
};

const ecosystemLayers: EcosystemLayer[] = [
  {
    number: '01',
    title: 'Núcleo',
    description: 'Uma marca que respira criação de soluções empresariais e inovadoras',
    icon: Target,
    color: 'from-amber-500 to-orange-600',
  },
  {
    number: '02',
    title: 'Plataforma',
    description: 'Ferramentas integrativas para executar seus projetos de forma ágil',
    icon: Lightbulb,
    color: 'from-teal-500 to-cyan-600',
    href: '/plataforma',
    ctaLabel: 'Abrir',
  },
  {
    number: '03',
    title: 'MVPs',
    description: 'Soluções em ideação dentro do ecossistema',
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
    href: '/ecossistema#mvps',
    ctaLabel: 'Explorar',
  },
  {
    number: '04',
    title: 'Verticais',
    description: 'Iniciativas para fomentar a inovação, educação e empreendedorismo',
    icon: Layers,
    color: 'from-purple-500 to-pink-600',
    href: '/ecossistema#verticais',
    ctaLabel: 'Explorar',
  },
];

const quickActions: QuickAction[] = [
  {
    title: 'Explorar o Ecossistema',
    description: 'Conheça todas as camadas, ferramentas e recursos disponíveis',
    link: '/ecossistema',
    icon: Layers,
  },
  {
    title: 'Entrar em Contato',
    description: 'Fale com nosso time para tirar dúvidas e agendar uma demo',
    link: '/contato',
    icon: Users,
  },
  {
    title: 'Acessar Projetos',
    description: 'Veja cases de sucesso e histórias de empreendedores',
    link: '/projetos',
    icon: Target,
  },
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>OrientoHub - O hub para quem constrói o futuro das startups</title>
        <meta name="description" content="Construa sua startup com metodologia, inovação, tecnologia e diversão. OrientoHub é a plataforma completa para empreendedores." />
      </Helmet>

      {/* Shared background that spans the whole page */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-50" />
      <div className="fixed inset-0 opacity-20 -z-50" style={heroBackgroundStyle} />

      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center">
        <div className="relative z-10 container-custom pt-4 sm:pt-6 pb-0 flex items-center min-h-screen">
          <motion.div
            className="w-full max-w-4xl mx-auto -mt-8 sm:-mt-10 lg:-mt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex justify-center mb-8"
              variants={itemVariants}
            >
              <HeroBadge />
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-8 tracking-tight leading-tight flex flex-col items-center"
              variants={itemVariants}
            >
              <span className="text-white block whitespace-nowrap">
                Orientação e Conexão
              </span>
              <span className="text-white block">
                <span className="text-[#FFD700] font-bold mr-3">=</span>
                Aceleração.
              </span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Um hub de ideias, produtos e estratégia conectados em quatro camadas — do núcleo institucional aos MVPs em construção.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              variants={itemVariants}
            >
              <Link
                to="/plataforma"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg rounded-lg shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
              >
                Explorar o ecossistema
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contato"
                className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 hover:bg-primary-500/10 text-primary-500 font-bold text-lg rounded-lg backdrop-blur-sm transition-all"
              >
                Fale Conosco
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider liftIntoHero />

      {/* Ecosystem overview */}
      <section className="relative pt-8 pb-8 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="mb-14">
            <SectionHeader
              icon={Layers}
              label="02 — Ecossistema"
              title="As 4 Camadas do Ecossistema OrientoHub"
              description="Uma arquitetura pensada para apoiar empreendedores em cada etapa da jornada"
              titleClassName="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              descriptionClassName="text-xl text-gray-600 dark:text-gray-300"
            />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {ecosystemLayers.map((layer) => (
              <EcosystemCard key={layer.number} layer={layer} />
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Founder story */}
      <section className="relative pt-2 pb-8 overflow-hidden">
        <div className="container-custom relative z-10">
          <SectionHeader
            icon={Sparkles}
            label="03 — O Founder"
            title="Criado por quem vive o ecossistema"
            titleClassName="text-4xl md:text-5xl font-bold mb-6 text-white"
          />

          <motion.div
            className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-xl backdrop-blur-sm hover:bg-white/10 transition-all"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Fernando Ramalho
            </h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Empreendedor, inovador e construtor de ecossistemas. Fernando dedica sua vida a preparar a próxima geração de founders através de metodologias práticas, mentorias intensas e um compromisso genuíno com o sucesso de cada startup que passa pelo OrientoHub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://fernandoramalhobuilder.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-lg transition-all"
              >
                Conheça Fernando
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/sobre"
                className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-500/50 hover:border-primary-500 hover:bg-primary-500/10 text-primary-500 font-bold rounded-lg backdrop-blur-sm transition-all"
              >
                Saiba mais
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Manifesto */}
      <section className="relative pt-4 pb-10 overflow-hidden">
        <div className="container-custom relative z-10">
          <SectionHeader
            icon={Sparkles}
            label="04 — Manifesto"
            title="Pense. Crie. Acelere."
            titleClassName="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
            containerClassName="max-w-4xl mx-auto"
          />

          <motion.p
            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Método, ambição e execução conectados para transformar ideias em negócios de impacto.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-lg transition-all"
            >
              Leia o Manifesto Completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Final actions */}
      <section className="relative pt-2 pb-8 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="mb-14">
            <SectionHeader
              icon={Sparkles}
              label="05 — Próximos Passos"
              title="Sua jornada começa aqui"
              description="Escolha como você quer explorar o OrientoHub e começar a transformar suas ideias em realidade"
              titleClassName="text-4xl md:text-5xl font-bold mb-6 text-white"
              descriptionClassName="text-xl text-gray-300"
            />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {quickActions.map((action) => (
              <QuickActionCard key={action.link} action={action} />
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-400 mb-6">Pronto para começar sua transformação?</p>
            <Link
              to="/plataforma"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Comece Grátis
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

const SectionHeader = ({
  icon: Icon,
  label,
  title,
  description,
  titleClassName,
  descriptionClassName = 'text-xl text-gray-600 dark:text-gray-300',
  containerClassName = 'max-w-3xl mx-auto',
}: SectionHeaderProps) => {
  return (
    <motion.div
      className={`text-center ${containerClassName}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
        <Icon className="w-4 h-4 text-[#FFD700]" />
        <span className="text-[#FFD700] font-semibold text-sm uppercase tracking-wider">
          {label}
        </span>
      </div>
      <h2 className={titleClassName}>{title}</h2>
      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </motion.div>
  );
};

const HeroBadge = () => {
  return (
    <div className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-primary-400/35 bg-white/6 px-5 py-2.5 text-primary-300 shadow-[0_10px_35px_rgba(255,215,0,0.12)] backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.18),transparent_55%)] opacity-95" />
      <div className="absolute inset-[1px] rounded-full bg-gradient-to-r from-black/70 via-gray-900/75 to-black/70" />
      <div className="relative mr-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#FFD700]/35 bg-[#FFD700]/18 shadow-[0_0_18px_rgba(255,215,0,0.35)]">
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-[#FFD700]" />
      </div>
      <span className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
        OrientoHub
      </span>
    </div>
  );
};

const EcosystemCard = ({ layer }: { layer: EcosystemLayer }) => {
  const Icon = layer.icon;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-900/85 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-md hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
    >
      {/* Soft hover wash */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${layer.color} transition-opacity duration-300`} />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl font-bold text-[#FFD700]/55">{layer.number}</span>
          <Icon className="w-8 h-8 text-[#FFD700] group-hover:scale-110 transition-transform" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          {layer.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {layer.description}
        </p>
        {layer.ctaLabel ? (
          <Link
            to={layer.href ?? '/ecossistema'}
            className="mt-auto inline-flex items-center gap-2 text-[#FFD700] font-semibold transition-colors"
          >
            {layer.ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        ) : null}
      </div>
    </motion.div>
  );
};

const QuickActionCard = ({ action }: { action: QuickAction }) => {
  const Icon = action.icon;

  return (
    <motion.div className="group relative" variants={itemVariants}>
      <Link
        to={action.link}
        className="block h-full p-8 rounded-2xl border border-primary-500/30 bg-white/90 dark:bg-gray-900/85 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-md hover:bg-white/[0.98] dark:hover:bg-gray-900 transition-all duration-300 hover:border-primary-500"
      >
        <Icon className="w-8 h-8 text-[#FFD700] mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{action.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{action.description}</p>
        <span className="inline-flex items-center gap-2 text-[#FFD700] font-semibold group-hover:gap-3 transition-all">
          Ir agora <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </motion.div>
  );
};
