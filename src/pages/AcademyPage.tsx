import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, CheckCircle2, Users, BookOpen, Award, Star, Lightbulb, ArrowRight } from 'lucide-react';

const AcademyPage = () => {
  return (
    <>
      <Helmet>
        <title>Oriento Academy - Orientohub</title>
        <meta name="description" content="Conheça a Oriento Academy: plataforma premium de cursos, certificações e aprendizagem gamificada para founders e inovadores." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" style={{ animationDelay: '2400ms' }} />
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
              <GraduationCap className="w-5 h-5 text-primary-500 animate-bounce" style={{ animationDuration: '2.5s' }} />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Oriento Academy
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              O futuro da aprendizagem para founders
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl font-semibold mb-8 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              Premium, Gamificada, Real
            </motion.p>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Cursos, certificações, badges e uma experiência gamificada para founders, inovadores e quem quer transformar o futuro dos negócios.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/academy"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-2xl shadow-lg shadow-primary-500/30 transition"
              >
                Explorar catálogo
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/academy/login"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition"
              >
                Sou founder da Academy
                <Sparkles size={18} />
              </Link>
            </motion.div>
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

      {/* Sobre Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-primary-500" />
              <span className="text-primary-500 font-semibold text-sm">SOBRE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">O que é a Oriento Academy?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Uma plataforma de aprendizagem inovadora, criada para acelerar o desenvolvimento de founders, líderes e equipes de startups. Aqui, você encontra conteúdos práticos, certificações reconhecidas e uma jornada gamificada que transforma conhecimento em conquistas reais.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AcademyFeature
              icon={<BookOpen className="w-10 h-10 text-primary-500" />}
              title="Conteúdo Premium"
              description="Cursos e trilhas desenvolvidos por especialistas do mercado, focados em inovação, negócios e tecnologia."
              delay={0.1}
            />
            <AcademyFeature
              icon={<Award className="w-10 h-10 text-primary-500" />}
              title="Certificações Reconhecidas"
              description="Comprove seu conhecimento e destaque-se no mercado com certificações exclusivas."
              delay={0.2}
            />
            <AcademyFeature
              icon={<Sparkles className="w-10 h-10 text-primary-500" />}
              title="Gamificação e Badges"
              description="Conquiste badges, suba de nível e participe de rankings enquanto aprende."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <GraduationCap className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Pronto para acelerar sua jornada?
              <br />
              <span className="text-primary-500">
                Aprenda com os melhores.
              </span>
            </h2>
            <div className="inline-block bg-primary-500/20 border-2 border-primary-500 px-8 py-4 rounded-xl backdrop-blur-sm mt-8">
              <p className="text-2xl md:text-3xl font-bold text-primary-500">
                Oriento Academy — onde founders se tornam referência.
              </p>
            </div>
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/cadastro"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-6 h-6" />
                  Quero fazer parte
                </a>
                <Link
                  to="/academy/login"
                  className="inline-flex items-center gap-3 px-10 py-5 border border-white/30 text-white font-semibold text-xl rounded-xl hover:bg-white/10 transition"
                >
                  Acesso do founder
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};


interface AcademyFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const AcademyFeature = ({ icon, title, description, delay }: AcademyFeatureProps) => (
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
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

export default AcademyPage;
