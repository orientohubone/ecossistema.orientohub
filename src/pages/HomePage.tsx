import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, Users, Target, Lightbulb, ExternalLink, Component, MonitorPlay, Maximize2, X, TrendingUp, Rocket, Brain, BarChart3, Compass, Code, GraduationCap, Mic, Briefcase, BookOpen } from 'lucide-react';
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
  shortDescription?: string;
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
    shortDescription: 'O coração do ecossistema e marca-mãe, centralizando a governança e fundadores.',
    description: 'Núcleo representa a raiz de toda marca, sendo marca-mãe, tendo nosso founder como orquestrador do ecossistema e suas soluções e conectando sua marca pessoal como canal de aquisição.',
    icon: Target,
    color: 'from-amber-500 to-orange-600',
  },
  {
    number: '02',
    title: 'Plataforma',
    shortDescription: 'Ferramentas integrativas para executar seus projetos de forma ágil',
    description: 'A Plataforma OrientoHub consolida metodologias e ferramentas práticas em um único lugar, permitindo que você conduza sua startup através de toda a Jornada Empreendedora, desde a ideação até a escala.',
    icon: Lightbulb,
    color: 'from-teal-500 to-cyan-600',
    href: '/plataforma',
    ctaLabel: 'Abrir',
  },
  {
    number: '03',
    title: 'MVPs',
    shortDescription: 'Soluções em ideação dentro do ecossistema',
    description: 'Um laboratório prático onde aplicamos frameworks de validação em projetos reais. Acompanhe a esteira de produtos que o hub vem testando e escalando no mercado.',
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
    href: '/ecossistema#mvps',
    ctaLabel: 'Explorar',
  },
  {
    number: '04',
    title: 'Verticais',
    shortDescription: 'Iniciativas para fomentar a inovação, educação e empreendedorismo',
    description: 'Nossas verticais de expansão representam produtos e iniciativas focadas no fortalecimento da comunidade e na monetização do conhecimento proprietário do hub.',
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
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!presentationOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPresentationOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [presentationOpen]);

  const openFullscreen = async () => {
    const element = modalContentRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
  };

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
      <section className="relative min-h-[100svh] w-full flex items-center">
        <div className="relative z-10 container-custom pt-6 sm:pt-8 lg:pt-14 xl:pt-16 pb-0 flex items-center min-h-[100svh]">
          <motion.div
            className="w-full max-w-4xl mx-auto -mt-2 sm:-mt-8 lg:-mt-4 xl:-mt-6 px-1 sm:px-0 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex justify-center mb-6 sm:mb-8"
              variants={itemVariants}
            >
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                  OrientoHub
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-6 tracking-tight leading-[1.08] flex flex-col items-center"
              variants={itemVariants}
            >
              <span className="block text-white mb-2">
                Orientação e Conexão
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                = Aceleração.
              </span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Um hub de ideias, produtos e estratégia conectados em quatro camadas — do núcleo institucional aos MVPs em construção.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full"
              variants={itemVariants}
            >
              <Link
                to="/plataforma"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105"
              >
                Conheça nossa plataforma
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setPresentationOpen(true)}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 hover:bg-primary-500/10 text-primary-500 font-bold text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Ver apresentação
                <MonitorPlay className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>



            <div className="lg:hidden mt-10 sm:mt-12">
              <SectionDivider />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="hidden lg:block mt-0 xl:-mt-2">
        <SectionDivider />
      </div>

      {presentationOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
          onClick={() => setPresentationOpen(false)}
        >
          <div
            ref={modalContentRef}
            className="relative w-[min(98vw,1600px)] h-[min(95vh,980px)] overflow-hidden rounded-[32px] bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-px shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-full w-full flex-col overflow-hidden rounded-[31px] bg-[#0b0b0b]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
                    <MonitorPlay className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Apresentação OrientoHub</div>
                    <div className="text-xs text-gray-400">Visualização do deck em tela central</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openFullscreen}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-primary-500 hover:bg-primary-500/10"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Tela cheia
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresentationOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:border-primary-500 hover:bg-primary-500/10"
                    aria-label="Fechar apresentação"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded-b-[31px] bg-black">
                <iframe
                  title="Apresentação OrientoHub"
                  src="/orientohub_pitch_deck_html.html"
                  className="block h-full w-full bg-black border-0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ecosystem overview */}
      <section className="relative pt-4 xl:pt-2 pb-8 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="mb-11">
            <SectionHeader
              icon={Component}
              label="02 | Ecossistema"
              title="As 4 Camadas do Ecossistema OrientoHub"
              description="Uma arquitetura pensada para apoiar empreendedores em cada etapa da jornada"
              titleClassName="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              descriptionClassName="text-xl text-gray-600 dark:text-gray-300"
              containerClassName="max-w-4xl mx-auto"
            />
          </div>

          {expandedLayer ? (
            <div className="max-w-6xl mx-auto space-y-5 md:space-y-6">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <EcosystemCard
                  layer={ecosystemLayers.find(l => l.number === expandedLayer)!}
                  expanded
                  onToggleExpand={() => setExpandedLayer(null)}
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {ecosystemLayers.filter(l => l.number !== expandedLayer).map((layer) => (
                  <EcosystemCard
                    key={layer.number}
                    layer={layer}
                    onToggleExpand={() => setExpandedLayer(layer.number)}
                  />
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto items-stretch"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {ecosystemLayers.map((layer) => (
                <EcosystemCard
                  key={layer.number}
                  layer={layer}
                  onToggleExpand={() => setExpandedLayer((current) => (current === layer.number ? null : layer.number))}
                />
              ))}
            </motion.div>
          )}
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


type EcosystemCardProps = {
  layer: EcosystemLayer;
  compact?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
};

const EcosystemCard = ({ layer, compact = false, expanded = false, onToggleExpand }: EcosystemCardProps) => {
  const Icon = layer.icon;
  const isNucleus = layer.number === '01';
  const isPlataforma = layer.number === '02';
  const isMVPs = layer.number === '03';
  const isVerticais = layer.number === '04';
  const canExpand = (isNucleus || isPlataforma || isMVPs || isVerticais) && Boolean(onToggleExpand);
  const shellPadding = expanded ? 'p-6 sm:p-8 lg:p-10' : 'p-7 md:p-8';
  const is2ColumnLayout = expanded && isNucleus;
  const cardLayout = is2ColumnLayout
    ? 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'
    : 'flex h-full flex-col';

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border bg-white/90 dark:bg-gray-900/85 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 ${expanded
          ? 'border-primary-500/60 shadow-[0_28px_80px_rgba(0,0,0,0.16)]'
          : 'border-gray-200/80 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
        } ${shellPadding} h-full min-h-[320px] ${canExpand || expanded ? 'cursor-pointer' : 'cursor-default'}`}
      variants={itemVariants}
      role={canExpand ? 'button' : undefined}
      tabIndex={canExpand ? 0 : undefined}
      aria-expanded={canExpand ? expanded : undefined}
      onClick={canExpand ? onToggleExpand : undefined}
      onKeyDown={
        canExpand
          ? (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onToggleExpand?.();
            }
          }
          : undefined
      }
    >
      {/* Soft hover wash */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${layer.color} transition-opacity duration-300`} />

      <div className={`relative z-10 h-full ${cardLayout}`}>
        <div className={expanded ? 'flex flex-col justify-between gap-6' : 'flex h-full flex-col'}>
          {isNucleus || isPlataforma || isMVPs || isVerticais ? (
            expanded ? (
              <div className="flex items-start gap-4">
                <span className="text-4xl md:text-5xl font-bold text-[#FFD700]/55">
                  {layer.number}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-4xl font-bold text-[#FFD700]/55">
                  {layer.number}
                </span>
                {isNucleus ? (
                  <Component className="h-8 w-8 shrink-0 text-[#FFD700]" />
                ) : (
                  <Icon className="h-8 w-8 shrink-0 text-[#FFD700]" />
                )}
              </div>
            )
          ) : (
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className={`${expanded ? 'text-4xl md:text-5xl' : compact ? 'text-3xl' : 'text-4xl'} font-bold text-[#FFD700]/55`}>
                {layer.number}
              </span>
              <Icon className={`${compact ? 'w-7 h-7' : 'w-8 h-8'} text-[#FFD700] group-hover:scale-110 transition-transform`} />
            </div>
          )}

          <div className={expanded && isNucleus ? 'max-w-2xl' : expanded ? 'w-full' : ''}>
            <h3 className={`${expanded ? 'text-3xl md:text-4xl' : compact ? 'text-xl' : 'text-2xl'} font-bold mb-3 text-gray-900 dark:text-white`}>
              {layer.title}
            </h3>
            <p className={`${expanded ? 'text-base md:text-lg max-w-2xl' : compact ? 'text-sm md:text-[0.95rem]' : 'text-gray-600 dark:text-gray-400'} mb-6 leading-relaxed`}>
              {!expanded && layer.shortDescription ? layer.shortDescription : layer.description}
            </p>

            {isNucleus && expanded ? (
              <div className="flex flex-col gap-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {['Estratégia', 'Marca', 'Direção'].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium text-center"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                
                <a
                  href="https://fernandoramalhobuilder.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all w-fit group shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
                >
                  Conheça as possibilidades
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ) : isPlataforma && expanded ? (
              <div className="flex flex-col gap-6 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { id: 1, name: 'Ideação', icon: Lightbulb, color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-500/10' },
                    { id: 2, name: 'Validação', icon: Target, color: 'from-green-400 to-green-600', bgColor: 'bg-green-500/10' },
                    { id: 3, name: 'Estruturação', icon: Users, color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-500/10' },
                    { id: 4, name: 'Tração', icon: TrendingUp, color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-500/10' },
                    { id: 5, name: 'Escala', icon: Rocket, color: 'from-red-400 to-red-600', bgColor: 'bg-red-500/10' }
                  ].map((phase) => {
                    const PhaseIcon = phase.icon;
                    return (
                      <div
                        key={phase.name}
                        className="p-3 sm:p-4 lg:p-3 xl:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3"
                      >
                        <div className={`w-10 h-10 ${phase.bgColor} rounded-lg flex items-center justify-center`}>
                          <PhaseIcon className={`w-5 h-5 bg-gradient-to-br ${phase.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />
                        </div>
                        <h4 className="font-bold text-[13px] sm:text-sm tracking-tight text-gray-900 dark:text-white break-words w-full">{phase.name}</h4>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-900 dark:text-white font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    Caminho Integrado e Ferramentas Práticas
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                    Dashboard, recursos de criação de projetos, gestão de tarefas, soluções em fase de desenvolvimento, vincule com o Github e acompanhe toda evolução de forma centralizada e inteligente, frameworks variados para te ajudar em todas as fases da sua startup.
                  </p>
                </div>
              </div>
            ) : isMVPs && expanded ? (
              <div className="flex flex-col gap-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Humansys + BrainSys", type: "Gestão de Pessoas", status: "Ativo", icon: Brain, color: "text-blue-500", border: 'border-blue-500/20' },
                    { title: "Simples Metrics", type: "Growth & Analytics", status: "Ativo", icon: BarChart3, color: "text-emerald-500", border: 'border-emerald-500/20' },
                    { title: "Vo.ai", type: "Educação & IA", status: "Beta", icon: Compass, color: "text-purple-500", border: 'border-purple-500/20' },
                    { title: "Vibe Coding", type: "Tech & Automação", status: "Ativo", icon: Code, color: "text-orange-500", border: 'border-orange-500/20' },
                    { title: "Forgether", type: "Educação Web3", status: "Beta", icon: GraduationCap, color: "text-teal-500", border: 'border-teal-500/20' },
                    { title: "Custfly", type: "Customer Intelligence", status: "Ativo", icon: Users, color: "text-indigo-500", border: 'border-indigo-500/20' }
                  ].map((mvp, idx) => {
                    const MvpIcon = mvp.icon;
                    return (
                      <div key={idx} className={`p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all flex flex-col h-full group`}>
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 border ${mvp.border} group-hover:scale-105 transition-transform`}>
                            <MvpIcon className={`w-6 h-6 ${mvp.color}`} />
                          </div>
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${mvp.status === 'Beta' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'}`}>
                            {mvp.status}
                          </span>
                        </div>
                        
                        <div className="mt-auto">
                          <h4 className="font-bold text-[15px] xl:text-base text-gray-900 dark:text-white mb-1.5 leading-tight">{mvp.title}</h4>
                          <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                            {mvp.type}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/30 dark:from-blue-900/10 dark:to-transparent rounded-xl border border-blue-100 dark:border-gray-800">
                  <h4 className="text-gray-900 dark:text-white font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Laboratório Prático
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                    Testando hipóteses em tempo real. Cada MVP no ecossistema OrientoHub é desenvolvido seguindo metodologias ágeis com o objetivo de validar mercado de forma rápida e enxuta, e pivotar com inteligência.
                  </p>
                </div>
              </div>
            ) : isVerticais && expanded ? (
              <div className="flex flex-col gap-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { title: "Oriento Podcast", desc: "Podcast com founders e parceiros para difundir ideias.", status: "Em Breve", icon: Mic, color: "text-purple-500", border: 'border-purple-500/20' },
                    { title: "Oriento Academy", desc: "Plataforma de cursos voltados à inovação e negócios.", status: "Em Breve", icon: GraduationCap, color: "text-amber-500", border: 'border-amber-500/20' },
                    { title: "Oriento Ventures", desc: "Fundo interno de investimento anjo para alavancagem.", status: "Em Breve", icon: Briefcase, color: "text-gray-500", border: 'border-gray-500/20' },
                    { title: "Oriento Expertise", desc: "Conhecimento aplicado que gera resultado.", subItems: ["Consultoria estratégica", "Mentoria individual", "Aulas e workshops", "Palestras"], status: "Ativo", icon: BookOpen, color: "text-blue-500", border: 'border-blue-500/20' }
                  ].map((vert, idx) => {
                    const VertIcon = vert.icon;
                    return (
                      <div key={idx} className={`p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all flex flex-col h-full group`}>
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 border ${vert.border} group-hover:scale-105 transition-transform`}>
                            <VertIcon className={`w-6 h-6 ${vert.color}`} />
                          </div>
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${vert.status === 'Em Breve' ? 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400' : 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'}`}>
                            {vert.status}
                          </span>
                        </div>
                        
                        <div className="mt-auto flex flex-col">
                          <h4 className="font-bold text-[15px] xl:text-base text-gray-900 dark:text-white mb-1.5 leading-tight">{vert.title}</h4>
                          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                            {vert.desc}
                          </p>
                          
                          {vert.subItems && (
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {vert.subItems.map((item, itemIdx) => (
                                <span key={itemIdx} className={`text-[10px] font-semibold px-2 py-1 bg-gray-50 dark:bg-gray-900/50 border ${vert.border} rounded-md text-gray-600 dark:text-gray-300 text-center flex-1 whitespace-nowrap hover:bg-white dark:hover:bg-gray-800 transition-colors`}>
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {isNucleus && expanded && (
          <div className="flex items-start justify-center lg:justify-end pointer-events-none -mr-4 md:-mr-5 -mt-56 md:-mt-72 lg:-mt-80">
            <Component className="h-10 w-10 md:h-11 md:w-11 shrink-0 text-[#FFD700] opacity-80" />
          </div>
        )}
        {(isPlataforma || isMVPs || isVerticais) && expanded && (
          <div className="absolute top-1 lg:top-2 right-0 pointer-events-none">
            <Icon className="h-10 w-10 md:h-11 md:w-11 shrink-0 text-[#FFD700] opacity-30 md:opacity-80" />
          </div>
        )}

        {canExpand && !expanded ? (
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 mt-auto text-sm font-bold text-black bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:-translate-y-1 w-fit">
            Ver detalhes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        ) : layer.ctaLabel ? (
          <Link
            to={layer.href ?? '/ecossistema'}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-black bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1 w-fit group/btn ${expanded ? 'mt-6' : 'mt-auto'}`}
            onClick={(e) => {
              if (canExpand) e.stopPropagation();
            }}
          >
            {layer.ctaLabel} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
