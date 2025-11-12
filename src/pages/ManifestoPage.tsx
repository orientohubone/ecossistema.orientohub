import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Compass,
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
    <>
      <Helmet>
        <title>Manifesto - Orientohub</title>
        <meta name="description" content="O Campo de Batalha da Estratégia. Conheça os princípios e valores que guiam o Orientohub na transformação de ideias em startups de sucesso." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Compass className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Nosso Manifesto
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              O Campo de Batalha da{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Estratégia
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Somos feitos de propósito, não de acaso.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-1 w-20 bg-primary-500 rounded-full" />
              <Sparkles className="w-6 h-6 text-primary-500" />
              <div className="h-1 w-20 bg-primary-500 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Manifesto Content */}
      <section className="py-24 bg-white dark:bg-gray-900">
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
                <strong className="text-primary-500">Mas nós escolhemos outro caminho — o da estratégia.</strong>
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
                  content: 'Acreditamos que inovação sem direção é ruído. Por isso, construímos um campo fértil para mentes que pensam com clareza e agem com propósito. Não somos apenas um hub de soluções — somos o laboratório dos estrategistas modernos.',
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
                  content: 'Acreditamos no poder da coparticipação. Crescemos juntos, dividindo riscos e multiplicando vitórias. A Orientohub é um ecossistema vivo — feito de conexões, aprendizado e propósito.',
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
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-8">
              <Award className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-semibold text-sm">NOSSO PROPÓSITO</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              E o propósito é simples:
              <br />
              <span className="text-primary-500">
                transformar inteligência em vantagem competitiva.
              </span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-24 bg-white dark:bg-gray-900">
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
      <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <Compass className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Porque o futuro não pertence aos mais rápidos,
              <br />
              <span className="text-primary-500">
                mas aos mais estratégicos.
              </span>
            </h2>

            <div className="inline-block bg-primary-500/20 border-2 border-primary-500 px-8 py-4 rounded-xl backdrop-blur-sm mt-8">
              <p className="text-2xl md:text-3xl font-bold text-primary-500">
                Orientohub — estratégia é o novo poder.
              </p>
            </div>

            <div className="mt-16">
              <a
                href="/cadastro"
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-6 h-6" />
                Junte-se ao Movimento
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
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
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-black to-gray-900 rounded-xl flex items-center justify-center border-2 border-primary-500/30 group-hover:border-primary-500 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-primary-500" />
        </div>
        
        <div className="flex-1 pt-2">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary-500 transition-colors">
            {title}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 to-transparent -z-10" />
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
      className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <div className="relative w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <div className="absolute inset-0 bg-primary-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="relative w-8 h-8 text-primary-500" />
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default ManifestoPage;
