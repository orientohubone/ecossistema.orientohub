import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Zap, ArrowRight, Lightbulb, FolderKanban, Blocks, BarChart2, Award, CheckCircle, MessageCircle } from 'lucide-react';
import VideoShowcase from '../components/ui/VideoShowcase';
import SectionDivider from '../components/SectionDivider';
import gamificacaoShowcase from '../assets/gamificação-showcase.png';

const PlatformaPage = () => {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Helmet>
        <title>Plataforma OrientoHub - Da ideia à execução</title>
        <meta name="description" content="Incube ideias, organize projetos, desenvolva soluções e aplique frameworks em um só lugar." />
      </Helmet>

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Content */}
        <div className="relative z-10 container-custom pt-24 sm:pt-32 pb-16 sm:pb-24">
          <div className="max-w-5xl mx-auto">
            {/* Main heading */}
            <motion.h1
              className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-bold text-center mb-4 sm:mb-6 tracking-tight leading-tight px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-white">Da ideia à execução,</span>
              <span className="block bg-gradient-to-r from-[#FFF200] via-[#FFF200] to-[#FFF200]/80 bg-clip-text pb-[0.12em] text-transparent">
                tudo ganha direção.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base sm:text-xl md:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-6 sm:mb-7 leading-relaxed px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Incube ideias, organize projetos, desenvolva soluções e aplique frameworks em um só lugar.
            </motion.p>

            {/* Showcases da plataforma */}
            <VideoShowcase
              items={[
                {
                  image: '/videos/dashboard-v2-click.png',
                  videoUrl: '/videos/dashboard.mp4',
                  alt: 'Demonstração do dashboard da OrientoHub',
                  title: 'Dashboard inteligente',
                  description: 'Tarefas, XP, frameworks e conquistas atualizados conforme você avança.',
                },
                {
                  image: '/videos/ideias-board-check.png',
                  videoUrl: '/videos/ideias.mp4',
                  alt: 'Demonstração da gestão de ideias da OrientoHub',
                  title: 'Ideias e incubação',
                  description: 'Organize oportunidades, teste hipóteses e amadureça ideias antes de transformá-las em projetos.',
                },
                {
                  image: gamificacaoShowcase,
                  videoUrl: '/videos/jornada-empreendedora.mp4',
                  alt: 'Demonstração da Jornada Empreendedora',
                  title: 'Jornada Empreendedora',
                  description: 'Etapas, missões e conquistas que orientam a evolução de cada iniciativa.',
                },
              ]}
            />

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href="/cadastro"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-bold text-base sm:text-lg rounded-xl shadow-none hover:shadow-none transition-all duration-300 active:scale-95"
              >
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Comece a construir
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/contato"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-[#FFF200]/50 hover:border-[#FFF200] hover:bg-[#FFF200]/100/10 text-[#FFF200] font-bold text-base sm:text-lg rounded-xl backdrop-blur-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Entre em contato
              </Link>
            </motion.div>

            {/* Subtext */}
            <motion.p
              className="text-center text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2 px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Zap className="w-4 h-4 text-[#FFF200] shrink-0" />
              Comece gratuitamente, sem cartão de crédito
            </motion.p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20 max-w-4xl mx-auto px-1 sm:px-0">
              {[
                {
                  icon: Sparkles,
                  title: 'Gamificada',
                  description: 'Transforme cada avanço em progresso visível e novas conquistas',
                  delay: 0.1
                },
                {
                  icon: Rocket,
                  title: 'Metodologia',
                  description: 'Aplique frameworks para investigar, decidir e construir com clareza',
                  delay: 0.2
                },
                {
                  icon: Zap,
                  title: 'Imersiva',
                  description: 'Concentre contexto, decisões e execução em um mesmo ambiente',
                  delay: 0.3
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-5 sm:p-6 rounded-2xl border border-[#FFF200]/20 bg-gray-900/50 backdrop-blur-sm hover:bg-[#FFF200]/100/10 hover:border-[#FFF200]/40 transition-all duration-300 hover:shadow-lg hover:shadow-none"
                  initial={{ y: 15 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: feature.delay * 0.3, ease: "easeOut" }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FFF200]/100/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#FFF200]/100/30 transition-colors">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF200]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider topSpacing="tight" />

      {/* Features Section */}
      <section className="relative py-12 sm:py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2 text-white">Um fluxo para tudo o que você quer construir</h2>
              <p className="text-base sm:text-xl text-white/55 px-2">Capture possibilidades, organize o trabalho e conduza cada iniciativa da descoberta à evolução.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            <FeatureCard
              icon={<Lightbulb className="h-5 w-5" strokeWidth={2.25} />}
              title="Incubação de ideias"
              description="Registre oportunidades, organize evidências e amadureça hipóteses antes de investir na execução."
              delay={0.1}
            />
            <FeatureCard
              icon={<FolderKanban className="h-5 w-5" strokeWidth={2.25} />}
              title="Gestão de projetos"
              description="Transforme ideias priorizadas em projetos com contexto, tarefas e próximos passos visíveis."
              delay={0.2}
            />
            <FeatureCard
              icon={<Blocks className="h-5 w-5" strokeWidth={2.25} />}
              title="Soluções em evolução"
              description="Estruture soluções, conecte decisões técnicas e acompanhe o avanço de cada construção."
              delay={0.3}
            />
            <FeatureCard
              icon={<BarChart2 className="h-5 w-5" strokeWidth={2.25} />}
              title="Frameworks aplicados"
              description="Use ferramentas práticas para investigar problemas, validar caminhos e tomar decisões melhores."
              delay={0.4}
            />
            <FeatureCard
              icon={<Award className="h-5 w-5" strokeWidth={2.25} />}
              title="Progresso visível"
              description="Avance por missões, acumule experiência e transforme trabalho realizado em evolução concreta."
              delay={0.5}
            />
            <FeatureCard
              icon={<CheckCircle className="h-5 w-5" strokeWidth={2.25} />}
              title="Visão centralizada"
              description="Acompanhe ideias, projetos, soluções e atividades sem perder o contexto entre as frentes."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 sm:py-32">
        <div className="container-custom relative z-10">
          <motion.div
            className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-[#FFF200]/20 bg-white/[0.04] px-4 sm:px-6 py-10 sm:py-14 text-center shadow-none backdrop-blur-md max-w-5xl mx-auto md:px-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)]" />
            {/* Badge */}
            <motion.div
              className="relative mb-6 sm:mb-8 inline-flex items-center gap-2.5 sm:gap-3 overflow-hidden rounded-full border border-[#FFF200]/35 bg-white/6 px-4 py-2 sm:px-5 sm:py-2.5 text-[#FFF200] shadow-none backdrop-blur-md max-w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)] opacity-80" />
              <div className="absolute inset-[1px] rounded-full bg-gradient-to-r from-black/70 via-gray-900/75 to-black/70" />
              <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border border-[#FFF200]/30 bg-[#FFF200]/100/15 shadow-none">
                <Rocket className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FFF200]" />
              </div>
              <span className="relative text-[#FFF200] font-bold text-xs sm:text-sm uppercase tracking-[0.16em] sm:tracking-[0.2em]">
                Comece agora
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="relative text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Pronto para dar direção ao que você quer construir?
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="relative text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto px-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Comece com uma ideia, organize o próximo passo e transforme aprendizado em evolução contínua.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/cadastro"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-bold text-lg sm:text-xl rounded-xl shadow-none hover:shadow-none hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
                Comece gratuitamente
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            {/* Additional info */}
            <motion.p
              className="relative mt-8 sm:mt-12 text-xs sm:text-sm text-gray-400 flex flex-wrap items-center justify-center gap-2 px-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <Zap className="w-4 h-4 text-[#FFF200] shrink-0" />
              <span>Grátis para começar</span>
              <span>•</span>
              <span>Sem cartão de crédito</span>
              <span>•</span>
              <span>Cancele quando quiser</span>
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFF200]/55 hover:bg-[#111925] hover:shadow-[0_20px_50px_rgba(0,0,0,0.24)]"
      initial={{ y: 15 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: delay * 0.3, ease: "easeOut" }}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent opacity-40 transition-opacity group-hover:opacity-100" />
      <div className="relative mb-6 h-12 w-12">
        <span className="absolute inset-1 rounded-xl bg-[#FFF200]/35 blur-md transition duration-300 group-hover:bg-[#FFF200]/55" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#fff76a] bg-[#FFF200] text-[#0c121b] shadow-[0_8px_22px_rgba(0,0,0,0.32)] transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
          {icon}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
    </motion.div>
  );
};

export default PlatformaPage;
