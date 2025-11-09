import { useTranslation } from 'react-i18next';
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
  Globe,
  Shield,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Sobre Nós - Orientohub</title>
        <meta name="description" content="Conheça a história, missão e valores do Orientohub. Estamos transformando a forma como startups são construídas no Brasil." />
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
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Sobre o Orientohub
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transformando{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                ideias
              </span>
              {' '}em startups de sucesso
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Nascemos da necessidade de democratizar o acesso a metodologias comprovadas,
              tornando o processo de construção de startups mais estruturado e eficiente.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { value: '500+', label: 'Startups' },
                { value: '1000+', label: 'Founders' },
                { value: '95%', label: 'Satisfação' },
                { value: 'R$ 50M+', label: 'Investidos' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-primary-500/20">
                  <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
                <Target className="w-4 h-4 text-primary-500" />
                <span className="text-primary-500 font-semibold text-sm">NOSSA MISSÃO</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Democratizar o acesso ao{' '}
                <span className="text-primary-500">empreendedorismo</span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Nossa missão é tornar o processo de construção de startups acessível para todos,
                fornecendo metodologias comprovadas, ferramentas eficientes e uma comunidade
                engajada que apoia o crescimento de cada empreendedor.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Target, text: 'Metodologia estruturada e comprovada' },
                  { icon: Users, text: 'Comunidade ativa de empreendedores' },
                  { icon: Award, text: 'Gamificação para maior engajamento' },
                  { icon: Zap, text: 'Ferramentas ágeis e eficientes' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent z-10" />
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Equipe Orientohub"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating card */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-primary-500/20 max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-500">500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Startups Aceleradas</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
<section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
  </div>

  <div className="container-custom relative z-10">
    <motion.div
      className="text-center max-w-3xl mx-auto mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
        <Heart className="w-4 h-4 text-primary-500" />
        <span className="text-primary-500 font-semibold text-sm">NOSSOS VALORES</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Princípios que nos guiam
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        Os valores que norteiam nossas decisões e moldam nossa cultura todos os dias.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
<section className="py-24 bg-white dark:bg-gray-900">
  <div className="container-custom">
    <motion.div
      className="text-center max-w-3xl mx-auto mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
        <User className="w-4 h-4 text-primary-500" />
        <span className="text-primary-500 font-semibold text-sm">FUNDADOR</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Quem está por trás do Orientohub
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300">
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
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black p-12 rounded-3xl border-2 border-primary-500/30 shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Image */}
          <div className="md:col-span-1 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <img
                src="/fernando-ramalho.jpg"
                alt="Fernando Ramalho"
                className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-primary-500 shadow-2xl"
              />
              {/* Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg whitespace-nowrap">
                CEO & Fundador
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 text-center md:text-left">
            <h3 className="text-4xl font-bold text-white mb-4">
              Fernando Ramalho
            </h3>
            
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Formado em Administração, Marketing, Inovação, Criatividade, Neurociência e Aprendizagem. 
              Apaixonado por transformar o ecossistema de startups através de metodologia e gamificação.
            </p>

            {/* Credentials/Tags */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
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
                  className="px-3 py-1 bg-primary-500/20 border border-primary-500/40 text-primary-500 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Quote */}
            <div className="relative bg-white/5 border-l-4 border-primary-500 p-4 rounded-r-lg">
              <svg className="absolute top-2 left-2 w-6 h-6 text-primary-500/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 italic pl-6">
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
      <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a centenas de founders que já estão construindo suas startups com o Orientohub.
            </p>
            <a
              href="/cadastro"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
            >
              <Rocket className="w-6 h-6" />
              Comece Gratuitamente
            </a>
          </motion.div>
        </div>
      </section>
    </>
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
      className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      {/* Icon with black background */}
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

// Team Member Component
interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  delay: number;
}

const TeamMember = ({ name, role, image, bio, delay }: TeamMemberProps) => {
  return (
    <motion.div
      className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        <img
          src={image}
          alt={name}
          className="relative w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500"
        />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <p className="text-primary-500 font-semibold mb-3">{role}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {bio}
        </p>
      </div>
    </motion.div>
  );
};

export default AboutPage;
