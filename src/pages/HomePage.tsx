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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        <div className="container-custom relative z-10 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 font-medium text-sm mb-6">
                ✨ Construa sua startup com metodologia e diversão
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cadastro" className="btn-primary text-base px-8 py-3">
                  {t('home.hero.cta')}
                </Link>
                <Link to="/sobre" className="btn-outline text-base px-8 py-3">
                  {t('common.learnMore')}
                </Link>
              </div>
              <div className="mt-8 flex items-center text-gray-500 dark:text-gray-400">
                <CheckCircle size={16} className="text-primary-500" />
                <span className="ml-2 text-sm">Comece gratuitamente, sem cartão de crédito</span>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Orientohub Dashboard" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white text-lg font-medium">Dashboard interativo e gamificado</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                    <Target size={20} className="text-black" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Acompanhe seu progresso</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Metodologia passo a passo</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.features.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.features.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users size={24} />}
              title="Ecossistema Colaborativo"
              description="Conecte-se com mentores, investidores e outros fundadores para acelerar sua jornada."
            />
            <FeatureCard 
              icon={<BarChart2 size={24} />}
              title="Frameworks Validados"
              description="Utilize ferramentas como Business Model Canvas, Mapa de Empatia e Jornada do Cliente."
            />
            <FeatureCard 
              icon={<Zap size={24} />}
              title="Gamificação Engajadora"
              description="Ganhe pontos, desbloqueie conquistas e acompanhe seu progresso de forma divertida."
            />
            <FeatureCard 
              icon={<Award size={24} />}
              title="Metodologia Comprovada"
              description="Siga um processo estruturado baseado nas melhores práticas de empreendedorismo."
            />
            <FeatureCard 
              icon={<Target size={24} />}
              title="Objetivos Claros"
              description="Defina metas específicas e acompanhe seu progresso em cada fase do desenvolvimento."
            />
            <FeatureCard 
              icon={<CheckCircle size={24} />}
              title="Templates Prontos"
              description="Economize tempo com modelos pré-formatados para pitch decks, planos de negócios e mais."
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
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div 
      className="card animated-card p-6"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
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