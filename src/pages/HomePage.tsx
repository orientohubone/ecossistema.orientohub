import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Zap, ArrowRight, Play, Users, BarChart2, Award, Target, CheckCircle, TrendingUp, Brain } from 'lucide-react';

// Componente de texto rotativo -->>
      
const RotatingText = () => {
  const words = ['metodologia', 'inovação', 'tecnologia', 'agilidade'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent transition-all duration-500 ${
        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
      style={{ paddingBottom: '0.15em', lineHeight: '1.2' }}
    >
      com {words[currentIndex]}
    </span>
  );
};

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Orientohub - {t('home.hero.title')}</title>
        <meta name="description" content={t('home.hero.subtitle')} />
      </Helmet>

     {/* Hero Section */}
<section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse [animation-delay:700ms]" />
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
  </div>

  {/* Grid pattern overlay */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }} />
  </div>

  {/* Content */}
  <div className="relative z-10 container-custom pt-32 pb-24">
    <div className="max-w-5xl mx-auto">
      {/* Badge */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary-500/30 bg-primary-500/10 text-primary-500 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">O hub para quem constrói o futuro das startups</span>
        </div>
      </motion.div>

      {/* Main heading */}
<motion.h1
  className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-tight"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <span className="block text-white mb-2">
    Construa sua startup
  </span>
  <RotatingText />
  <span className="block text-white mt-2">
    e diversão
  </span>
</motion.h1>

      {/* Description */}
      <motion.p
        className="text-xl sm:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-12 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Plataforma imersiva e gamificada para construção de startups. 
        Ideal para aceleradoras, incubadoras, fundadores e aspirantes.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <a
          href="/cadastro"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg rounded-lg shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
        >
          <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Comece sua jornada
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <a
          href="#saiba-mais"
          className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 hover:bg-primary-500/10 text-primary-500 font-bold text-lg rounded-lg backdrop-blur-sm transition-all duration-300"
        >
          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Saiba mais
        </a>
      </motion.div>

      {/* Subtext */}
      <motion.p
        className="text-center text-sm text-gray-400 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Zap className="w-4 h-4 text-primary-500" />
        Comece gratuitamente, sem cartão de crédito
      </motion.p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
        {[
          {
            icon: Sparkles,
            title: 'Gamificada',
            description: 'Aprenda construindo de forma divertida e engajante',
            delay: 0.1
          },
          {
            icon: Rocket,
            title: 'Metodologia',
            description: 'Frameworks validados por aceleradoras de sucesso',
            delay: 0.2
          },
          {
            icon: Zap,
            title: 'Imersiva',
            description: 'Experiência prática desde o primeiro dia',
            delay: 0.3
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="group relative p-6 rounded-2xl border border-primary-500/20 bg-gray-900/50 backdrop-blur-sm hover:bg-primary-500/10 hover:border-primary-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: feature.delay }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
              <feature.icon className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
<section className="py-20 bg-white dark:bg-gray-900">
  <div className="container-custom">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.features.title')}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.features.subtitle')}</p>
      </motion.div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FeatureCard 
        icon={<Users className="w-8 h-8" />}
        title="Ecossistema Colaborativo"
        description="Conecte-se com mentores, investidores e outros fundadores para acelerar sua jornada."
        delay={0.1}
      />
      <FeatureCard 
        icon={<BarChart2 className="w-8 h-8" />}
        title="Frameworks Validados"
        description="Utilize ferramentas como Business Model Canvas, Mapa de Empatia e Jornada do Cliente."
        delay={0.2}
      />
      <FeatureCard 
        icon={<Zap className="w-8 h-8" />}
        title="Gamificação Engajadora"
        description="Ganhe pontos, desbloqueie conquistas e acompanhe seu progresso de forma divertida."
        delay={0.3}
      />
      <FeatureCard 
        icon={<Award className="w-8 h-8" />}
        title="Metodologia Comprovada"
        description="Siga um processo estruturado baseado nas melhores práticas de empreendedorismo."
        delay={0.4}
      />
      <FeatureCard 
        icon={<Target className="w-8 h-8" />}
        title="Objetivos Claros"
        description="Defina metas específicas e acompanhe seu progresso em cada fase do desenvolvimento."
        delay={0.5}
      />
      <FeatureCard 
        icon={<CheckCircle className="w-8 h-8" />}
        title="Templates Prontos"
        description="Economize tempo com modelos pré-formatados para pitch decks, planos de negócios e mais."
        delay={0.6}
      />
    </div>
  </div>
</section>

     {/* Testimonials Section */}
<section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
  </div>

  <div className="container-custom relative z-10">
    <motion.div
      className="text-center max-w-3xl mx-auto mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
        <Sparkles className="w-4 h-4 text-primary-500" />
        <span className="text-primary-500 font-semibold text-sm">DEPOIMENTOS</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('home.testimonials.title')}</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.testimonials.subtitle')}</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <TestimonialCard 
        quote="O Orientohub transformou completamente a forma como desenvolvemos nossa startup. A metodologia gamificada manteve toda a equipe engajada."
        author="Ana Silva"
        role="CEO, TechStart"
        image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        delay={0.1}
      />
      <TestimonialCard 
        quote="Como mentor de startups, o Orientohub se tornou minha ferramenta essencial. Consigo acompanhar o progresso de todos os meus mentorados de forma eficiente."
        author="Carlos Mendes"
        role="Mentor, Startup Brasil"
        image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        delay={0.2}
      />
      <TestimonialCard 
        quote="Nossa aceleradora adotou o Orientohub e vimos um aumento de 40% na taxa de sucesso das startups do nosso portfólio. Simplesmente incrível!"
        author="Juliana Costa"
        role="Diretora, Acelera Ventures"
        image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        delay={0.3}
      />
    </div>
  </div>
</section>

     {/* CTA Section */}
<section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
  </div>

  {/* Grid pattern overlay */}
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
      transition={{ duration: 0.8 }}
    >
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Rocket className="w-4 h-4 text-primary-500" />
        <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
          Comece agora
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {t('home.cta.title')}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {t('home.cta.subtitle')}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/cadastro"
          className="group inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          {t('home.cta.button')}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
      </motion.div>

      {/* Additional info */}
      <motion.p
        className="mt-12 text-sm text-gray-400 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <Zap className="w-4 h-4 text-primary-500" />
        Grátis para começar • Sem cartão de crédito • Cancele quando quiser
      </motion.p>
    </motion.div>
  </div>
</section>
</>
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
      className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image: string;
  delay: number;
}

const TestimonialCard = ({ quote, author, role, image, delay }: TestimonialCardProps) => {
  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      {/* Quote icon */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic text-lg">
        "{quote}"
      </p>

      {/* Author info */}
      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
          <img 
            src={image} 
            alt={author}
            className="relative w-14 h-14 rounded-full object-cover border-2 border-primary-500"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{author}</h4>
          <p className="text-sm text-primary-500 font-medium">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
