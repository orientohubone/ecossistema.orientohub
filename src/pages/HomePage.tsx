import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, BarChart2, Zap, Award, Target } from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Orientohub - {t('home.hero.title')}</title>
        <meta name="description" content={t('home.hero.subtitle')} />
      </Helmet>

      {/* Hero Section - Premium Edition */}
<section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 to-purple-100/10 dark:from-blue-900/5 dark:to-purple-900/5 rounded-full blur-3xl"></div>
  </div>

  <div className="container-custom relative z-10 py-20 md:py-32">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Content */}
      <motion.div
        className="lg:col-span-6 xl:col-span-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-100 dark:border-blue-900/50 backdrop-blur-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            ✨ Construa sua startup com metodologia e diversão
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {t('home.hero.title')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl"
        >
          {t('home.hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link
            to="/cadastro"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('home.hero.cta')}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link
            to="/sobre"
            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:scale-105"
          >
            <span className="flex items-center gap-2">
              {t('common.learnMore')}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </Link>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-3 text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/30">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Comece gratuitamente</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sem cartão de crédito necessário</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Visual */}
      <motion.div
        className="lg:col-span-6 xl:col-span-7 relative"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Main Image Container */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          
          {/* Image Card */}
          <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Orientohub Dashboard"
              className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex items-end p-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Ao Vivo</span>
                </div>
                <p className="text-white text-xl font-bold">Dashboard interativo e gamificado</p>
                <p className="text-gray-300 text-sm">Transforme ideias em resultados mensuráveis</p>
              </div>
            </div>
          </div>

          {/* Floating Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Target size={24} className="text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">Acompanhe seu progresso</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Metodologia passo a passo</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Mini Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -top-6 -right-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-4"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">250+</p>
              <p className="text-xs text-purple-100">Startups criadas</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.2, duration: 0.8 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
  >
    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
      <span className="text-xs uppercase tracking-wider font-medium">Role para explorar</span>
      <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-full p-1">
        <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  </motion.div>
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.testimonials.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="O Orientohub transformou completamente a forma como desenvolvemos nossa startup. A metodologia gamificada manteve toda a equipe engajada."
              author="Ana Silva"
              role="CEO, TechStart"
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            <TestimonialCard 
              quote="Como mentor de startups, o Orientohub se tornou minha ferramenta essencial. Consigo acompanhar o progresso de todos os meus mentorados de forma eficiente."
              author="Carlos Mendes"
              role="Mentor, Startup Brasil"
              image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            <TestimonialCard 
              quote="Nossa aceleradora adotou o Orientohub e vimos um aumento de 40% na taxa de sucesso das startups do nosso portfólio. Simplesmente incrível!"
              author="Juliana Costa"
              role="Diretora, Acelera Ventures"
              image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">{t('home.cta.title')}</h2>
            <p className="text-xl text-black/80 mb-8">{t('home.cta.subtitle')}</p>
            <Link to="/cadastro" className="btn bg-black text-white hover:bg-gray-900 focus:ring-black text-lg px-8 py-3">
              {t('home.cta.button')} <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
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
}

const TestimonialCard = ({ quote, author, role, image }: TestimonialCardProps) => {
  return (
    <motion.div 
      className="card animated-card p-6"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="mb-6">
        <div className="text-primary-500">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-xl">★</span>
          ))}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{quote}</p>
      <div className="flex items-center">
        <img src={image} alt={author} className="h-12 w-12 rounded-full object-cover" />
        <div className="ml-4">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
