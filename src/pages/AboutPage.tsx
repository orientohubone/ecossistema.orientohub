import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Rocket,
  Sparkles,
  Zap,
  Heart,
  TrendingUp,
  Shield,
  Lightbulb,
  User
} from 'lucide-react';
import fernandoSelecao6 from '../assets/fernando-selecao6.png';

const AboutPage = () => {

  return (
    <div className="dark min-h-screen">
      {/* Shared fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-50" />
      {/* Global dot grid */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none -z-40"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <Helmet>
        <title>Sobre Nós - Orientohub</title>
        <meta name="description" content="Conheça a história, missão e valores do Orientohub. Estamos transformando a forma como startups são construídas no Brasil." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center">




        <div className="container-custom relative z-10 py-16 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#FFF200]/60 bg-gradient-to-b from-white/10 to-black/80 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-none backdrop-blur-md mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Rocket className="h-3.5 w-3.5 text-[#FFF200] shrink-0" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white">
                Sobre o Orientohub
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 text-white leading-tight px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transformando{' '}
              <span className="bg-gradient-to-r from-[#FFF200] via-[#FFF200] to-[#FFF200] bg-clip-text text-transparent">
                ideias
              </span>
              {' '}em{' '}
              <span className="bg-gradient-to-r from-[#FFF200] via-[#FFF200] to-[#FFF200] bg-clip-text text-transparent">
                negócios
              </span>
              {' '}de sucesso
            </motion.h1>

            <motion.p
              className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Nascemos da necessidade de democratizar o acesso a metodologias comprovadas,
              tornando o processo de construção de startups mais estruturado e eficiente.
            </motion.p>

            {/* Evolution Message */}
            <motion.div
              className="max-w-2xl mx-auto px-1 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-[#FFF200]/10 to-[#FFF200]/5 backdrop-blur-sm border-2 border-[#FFF200]/30 overflow-hidden">
                {/* Animated background glow */}
                

                <div className="relative z-10 text-center space-y-3.5 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#FFF200]/60 bg-gradient-to-b from-white/10 to-black/80 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-none backdrop-blur-md mb-1">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#FFF200] shrink-0" aria-hidden="true" />
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white">EM CONSTRUÇÃO</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                    Estamos evoluindo nosso ecossistema
                  </h3>

                  <p className="text-sm sm:text-lg text-gray-300 leading-relaxed">
                    Estamos construindo uma base sólida com metodologias comprovadas e MVPs conectados.
                    Em breve, estaremos 100% operacionais para transformar sua jornada empreendedora.
                  </p>

                  {/* Progress indicator */}
                  <div className="pt-3 sm:pt-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-2">
                      <span>Progresso do Ecossistema</span>
                      <span className="text-[#FFF200] font-bold">Em desenvolvimento</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#FFF200] to-[#FFF200]"
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#FFF200]/60 bg-gradient-to-b from-white/10 to-black/80 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-none backdrop-blur-md mb-4 sm:mb-6">
                <Target className="h-3.5 w-3.5 text-[#FFF200] shrink-0" aria-hidden="true" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white">NOSSA MISSÃO</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Democratizar o acesso ao{' '}
                <span className="text-[#FFF200]">empreendedorismo</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Nossa missão é tornar o processo de construção de startups acessível para todos,
                fornecendo metodologias comprovadas, ferramentas eficientes e uma comunidade
                engajada que apoia o crescimento de cada empreendedor.
              </p>

              <div className="space-y-3.5 sm:space-y-4">
                {[
                  { icon: Target, text: 'Metodologia estruturada e comprovada' },
                  { icon: Users, text: 'Comunidade ativa de empreendedores' },
                  { icon: Award, text: 'Gamificação para maior engajamento' },
                  { icon: Zap, text: 'Ferramentas ágeis e eficientes' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3.5 sm:gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF200]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FFF200]/20 transition-colors">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF200]" />
                    </div>
                    <div className="pt-1.5 sm:pt-2">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative mt-4 lg:mt-0"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF200]/20 to-transparent z-10" />
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Equipe Orientohub"
                  className="w-full h-auto max-h-[450px] object-cover"
                />
              </div>

              {/* Floating card */}
              <motion.div
                className="relative sm:absolute -bottom-4 sm:-bottom-8 left-0 sm:-left-8 mt-4 sm:mt-0 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-none border-2 border-[#FFF200]/20 w-full sm:max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF200] rounded-full flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[#FFF200]">100+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">empresas atendidas</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-24 relative overflow-hidden">
  

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#FFF200]/60 bg-gradient-to-b from-white/10 to-black/80 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-none backdrop-blur-md mb-4 sm:mb-6">
              <Heart className="h-3.5 w-3.5 text-[#FFF200] shrink-0" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white">NOSSOS VALORES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
              Princípios que nos guiam
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 px-2">
              Os valores que norteiam nossas decisões e moldam nossa cultura todos os dias.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[
              {
                icon: Rocket,
                title: 'Inovação Constante',
                description: 'Buscamos sempre as melhores práticas e tecnologias para ajudar nossos usuários a alcançarem seus objetivos.',
                delay: 0.1
              },
              {
                icon: Users,
                title: 'Comunidade em Primeiro Lugar',
                description: 'Construímos um ambiente colaborativo onde todos podem aprender, crescer e se conectar.',
                delay: 0.2
              },
              {
                icon: Target,
                title: 'Foco em Resultados',
                description: 'Comprometidos com o sucesso dos empreendedores que confiam em nossa plataforma.',
                delay: 0.3
              },
              {
                icon: Shield,
                title: 'Transparência Total',
                description: 'Mantemos comunicação clara e honesta com nossa comunidade em todas as situações.',
                delay: 0.4
              },
              {
                icon: Lightbulb,
                title: 'Aprendizado Contínuo',
                description: 'Incentivamos a evolução constante através de experimentação e compartilhamento de conhecimento.',
                delay: 0.5
              },
              {
                icon: TrendingUp,
                title: 'Crescimento Sustentável',
                description: 'Priorizamos o crescimento saudável e de longo prazo para nossa comunidade e parceiros.',
                delay: 0.6
              }
            ].map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-12 sm:py-24">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#FFF200]/60 bg-gradient-to-b from-white/10 to-black/80 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-none backdrop-blur-md mb-4 sm:mb-6">
              <User className="h-3.5 w-3.5 text-[#FFF200] shrink-0" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white">FUNDADOR</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
              Quem está por trás do Orientohub
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 px-2">
              Conheça a visão e a paixão que deu origem à plataforma.
            </p>
          </motion.div>

          {/* Founder Card - Destacado */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black p-6 sm:p-12 rounded-3xl border-2 border-[#FFF200]/30 shadow-none overflow-hidden">


              {/* Content */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
                {/* Image */}
                <div className="md:col-span-1 flex justify-center">
                  <div className="relative group mb-4 md:mb-0">
                    <div className="absolute inset-0 bg-[#FFF200]/35 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    <img
                      src={fernandoSelecao6}
                      alt="Fernando Ramalho"
                      className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-[2rem] object-cover object-top border-4 border-[#FFF200]/80 shadow-none"
                    />
                    {/* Badge */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 overflow-hidden rounded-full border border-[#FFF200]/70 bg-gradient-to-r from-[#FFF200] via-yellow-300 to-[#FFF200] px-4 py-1.5 sm:px-5 sm:py-2 text-black shadow-[0_10px_30px_rgba(255,215,0,0.35)] whitespace-nowrap">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_60%)]" />
                      <span className="relative text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em]">
                        Fundador
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-2 text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                    Fernando Ramalho
                  </h3>

                  <p className="text-sm sm:text-lg text-gray-300 mb-5 sm:mb-6 leading-relaxed">
                    Formado em Administração, Marketing, Inovação, Criatividade, Neurociência e Aprendizagem.
                    Apaixonado por transformar o ecossistema de startups através de metodologia e gamificação.
                  </p>

                  {/* Credentials/Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start mb-5 sm:mb-6">
                    {[
                      'Administração',
                      'Marketing',
                      'Inovação',
                      'Criatividade',
                      'Neurociência',
                      'Aprendizagem'
                    ].map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-[#FFF200]/20 border border-[#FFF200]/40 text-[#FFF200] rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative bg-white/5 border-l-4 border-[#FFF200] p-3.5 sm:p-4 rounded-r-lg text-left">
                    <svg className="absolute top-2 left-2 w-5 h-5 sm:w-6 sm:h-6 text-[#FFF200]/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-300 italic text-xs sm:text-base pl-5 sm:pl-6 leading-relaxed">
                      "Acredito que todo empreendedor merece acesso a ferramentas e metodologias que aumentem suas chances de sucesso. O Orientohub nasceu dessa missão."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">


        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8">
              Junte-se a centenas de founders que já estão construindo suas startups com o Orientohub.
            </p>
            <a
              href="/cadastro"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-bold text-lg sm:text-xl rounded-xl shadow-none shadow-none hover:shadow-none hover:scale-105 transition-all duration-300"
            >
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
              Comece Gratuitamente
            </a>
          </motion.div>
        </div>
      </section>
    </div>
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
      className="group relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#FFF200] dark:hover:border-[#FFF200] transition-all duration-300 hover:shadow-none hover:shadow-none"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      {/* Icon with black background */}
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-none">
        <div className="absolute inset-0 bg-[#FFF200]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="relative w-6 h-6 sm:w-8 sm:h-8 text-[#FFF200]" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-[#FFF200] transition-colors">
        {title}
      </h3>
      <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default AboutPage;
