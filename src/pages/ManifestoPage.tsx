import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 

  Target, 
  Lightbulb,
  TrendingUp,
  Users,
  Zap,
  Brain,
  Award,
  Rocket,
  Shield,
  Sparkles
} from 'lucide-react';

const ManifestoPage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Global dot grid */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <Helmet>
        <title>Manifesto - Orientohub</title>
        <meta name="description" content="O Campo de Batalha da Estratégia. Conheça os princípios e valores que guiam o Orientohub na transformação de ideias em startups de sucesso." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative w-full flex items-center">




        <div className="container-custom relative z-10 pt-32 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-white/10 to-black/80 backdrop-blur-xl border border-[#FFF200]/60 px-3 py-1.5 text-white shadow-none max-w-full mb-8 gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >

              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
                Nosso manifesto
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              O Campo de Batalha da{' '}
              <span className="bg-gradient-to-r from-[#FFF200] via-[#FFF200] to-[#FFF200]/80 bg-clip-text text-transparent">
                Estratégia
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Somos feitos de propósito, não de acaso.
            </motion.p>


          </div>
        </div>
      </section>

      {/* Main Manifesto Content */}
      <section className="relative z-10 py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                Vivemos em uma era onde o improviso veste terno e a pressa é confundida com progresso.
                <br />
                <strong className="text-[#FFF200]">Mas nós escolhemos outro caminho: o da estratégia.</strong>
              </p>
            </motion.div>

            {/* Core Principles */}
            <div className="space-y-12">
              {[
                {
                  icon: Target,
                  title: 'Propósito Acima do Acaso',
                  content: 'A Orientohub nasceu para ser o elo entre inteligência, método e ação. Um ecossistema onde ideias deixam de ser apenas faíscas e se tornam motores de crescimento real. Aqui, cada decisão é pensada, cada passo é calculado e cada erro é transformado em conhecimento.',
                  delay: 0.1
                },
                {
                  icon: Brain,
                  title: 'Inovação com Direção',
                  content: 'Acreditamos que inovação sem direção é ruído. Por isso, construímos um campo fértil para mentes que pensam com clareza e agem com propósito. Não somos apenas um hub de soluções: somos o laboratório dos estrategistas modernos.',
                  delay: 0.2
                },
                {
                  icon: Lightbulb,
                  title: 'Método e Criatividade',
                  content: 'Na Orientohub, método e criatividade caminham juntos. Cada startup, cada founder e cada ideia é desenvolvida com base em dados, experiência e aprendizado contínuo. Trabalhamos com a mente analítica de quem mede resultados e o olhar visionário de quem cria o futuro.',
                  delay: 0.3
                },
                {
                  icon: Users,
                  title: 'O Poder da Coparticipação',
                  content: 'Acreditamos no poder da coparticipação. Crescemos juntos, dividindo riscos e multiplicando vitórias. A Orientohub é um ecossistema vivo feito de conexões, aprendizado e propósito.',
                  delay: 0.4
                }
              ].map((principle, index) => (
                <ManifestoPrinciple key={index} {...principle} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Statement */}
      <section className="relative z-10 py-12">


        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-white/10 to-black/80 backdrop-blur-xl border border-[#FFF200]/60 px-3 py-1.5 text-white shadow-none max-w-full mb-8 gap-2">
              <Award className="h-3.5 w-3.5 text-[#FFF200]" aria-hidden="true" />
              <span className="h-3 w-px bg-[#FFF200]/40" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">Nosso propósito</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              E o propósito é simples:
              <br />
              <span className="text-[#FFF200]">
                transformar inteligência em vantagem competitiva.
              </span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="relative z-10 py-12">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que nos define
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Os pilares que sustentam nossa estratégia e visão de futuro.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Inteligência Estratégica',
                description: 'Cada decisão é baseada em dados, análise profunda e experiência de mercado.',
                delay: 0.1
              },
              {
                icon: Target,
                title: 'Foco em Resultados',
                description: 'Medimos sucesso por impacto real, não por atividades ou métricas vazias.',
                delay: 0.2
              },
              {
                icon: Users,
                title: 'Ecossistema Colaborativo',
                description: 'Crescemos juntos, compartilhando conhecimento e multiplicando sucessos.',
                delay: 0.3
              },
              {
                icon: Lightbulb,
                title: 'Inovação com Propósito',
                description: 'Criatividade direcionada por método e validada por resultados concretos.',
                delay: 0.4
              },
              {
                icon: Shield,
                title: 'Aprendizado Contínuo',
                description: 'Transformamos cada erro em conhecimento e cada vitória em lição.',
                delay: 0.5
              },
              {
                icon: Zap,
                title: 'Ação Calculada',
                description: 'Velocidade é importante, mas direção é essencial para o sucesso.',
                delay: 0.6
              }
            ].map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Final Statement */}
      <section className="relative z-10 py-16">

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Porque o futuro não pertence aos mais rápidos,
              <br />
              <span className="text-[#FFF200]">
                mas aos mais estratégicos.
              </span>
            </h2>

            <div className="inline-block bg-[#FFF200]/100/20 border-2 border-[#FFF200] px-8 py-4 rounded-xl backdrop-blur-sm mt-8">
              <p className="text-2xl md:text-3xl font-bold text-[#FFF200]">
                Orientohub: estratégia é o novo poder.
              </p>
            </div>

            <div className="mt-16">
              <a
                href="/cadastro"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-bold text-xl rounded-xl shadow-none hover:shadow-none transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-6 h-6" />
                Junte-se ao Movimento
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Manifesto Principle Component
interface ManifestoPrincipleProps {
  icon: React.ElementType;
  title: string;
  content: string;
  delay: number;
}

const ManifestoPrinciple = ({ icon: Icon, title, content, delay }: ManifestoPrincipleProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="flex items-start gap-6 group">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-black to-gray-900 rounded-xl flex items-center justify-center border-2 border-[#FFF200]/30 group-hover:border-[#FFF200] transition-all duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-[#FFF200]" />
        </div>
        
        <div className="flex-1 pt-2">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#FFF200] transition-colors">
            {title}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-[#FFF200]/50 to-transparent -z-10" />
    </motion.div>
  );
};

// Value Card Component
interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const ValueCard = ({ icon: Icon, title, description, delay }: ValueCardProps) => {
  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#FFF200] dark:hover:border-[#FFF200] transition-all duration-300 hover:shadow-2xl hover:shadow-none"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <div className="relative w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <div className="absolute inset-0 bg-[#FFF200]/100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="relative w-8 h-8 text-[#FFF200]" />
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-[#FFF200] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default ManifestoPage;
