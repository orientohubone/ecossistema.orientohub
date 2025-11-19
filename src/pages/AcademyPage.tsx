import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Sparkles, CheckCircle2, Users, BookOpen, Award, Star, Lightbulb } from 'lucide-react';

const AcademyPage = () => {
  return (
    <>
      <Helmet>
        <title>Oriento Academy - Orientohub</title>
        <meta name="description" content="Conheça a Oriento Academy: plataforma premium de cursos, certificações e aprendizagem gamificada para founders e inovadores." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-yellow-400/10 dark:via-gray-900 dark:to-yellow-900 flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD600 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="relative z-10 container-custom py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-400/30 bg-yellow-400/10 text-yellow-700 dark:text-yellow-200 backdrop-blur-sm">
                <GraduationCap className="w-5 h-5 animate-bounce" style={{ animationDuration: '2.5s' }} />
                <span className="text-sm font-semibold">Oriento Academy</span>
              </div>
            </motion.div>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-yellow-700 dark:text-yellow-200 mb-2">
                Aprenda. Conquiste. Inove.
              </span>
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                A Plataforma de Aprendizagem Premium
              </span>
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 text-center max-w-2xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Cursos, certificações, badges e uma experiência gamificada para founders, inovadores e quem quer transformar o futuro dos negócios.
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="#cursos" className="group px-6 py-3 bg-yellow-400/10 border-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-700 font-semibold">Cursos</span>
                </div>
              </a>
              <a href="#certificacoes" className="group px-6 py-3 bg-pink-400/10 border-2 border-pink-400/50 hover:border-pink-400 hover:bg-pink-400/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-500" />
                  <span className="text-pink-600 font-semibold">Certificações</span>
                </div>
              </a>
              <a href="#gamificacao" className="group px-6 py-3 bg-purple-400/10 border-2 border-purple-400/50 hover:border-purple-400 hover:bg-purple-400/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-purple-600 font-semibold">Gamificação</span>
                </div>
              </a>
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
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-700 font-semibold text-sm">SOBRE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">O que é a Oriento Academy?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Uma plataforma de aprendizagem inovadora, criada para acelerar o desenvolvimento de founders, líderes e equipes de startups. Aqui, você encontra conteúdos práticos, certificações reconhecidas e uma jornada gamificada que transforma conhecimento em conquistas reais.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AcademyFeature
              icon={<BookOpen className="w-10 h-10 text-yellow-500" />}
              title="Conteúdo Premium"
              description="Cursos e trilhas desenvolvidos por especialistas do mercado, focados em inovação, negócios e tecnologia."
              delay={0.1}
            />
            <AcademyFeature
              icon={<Award className="w-10 h-10 text-pink-500" />}
              title="Certificações Reconhecidas"
              description="Comprove seu conhecimento e destaque-se no mercado com certificações exclusivas."
              delay={0.2}
            />
            <AcademyFeature
              icon={<Sparkles className="w-10 h-10 text-purple-500" />}
              title="Gamificação e Badges"
              description="Conquiste badges, suba de nível e participe de rankings enquanto aprende."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-yellow-400/10 dark:via-gray-900 dark:to-yellow-900">
        <div className="container-custom text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-yellow-700 dark:text-yellow-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Pronto para acelerar sua jornada?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Inscreva-se na Oriento Academy e tenha acesso a conteúdos exclusivos, certificações e uma experiência de aprendizagem única.
          </motion.p>
          <motion.a
            href="/cadastro"
            className="inline-block px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl text-lg shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Quero fazer parte
          </motion.a>
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
    className="group bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900 dark:to-gray-900 p-8 rounded-xl border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
  >
    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-yellow-700 dark:text-yellow-200">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </motion.div>
);

export default AcademyPage;
