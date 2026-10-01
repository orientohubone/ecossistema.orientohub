import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, BookOpen, Award, ArrowRight } from 'lucide-react';

const AcademyPage = () => {
  return (
    <div className="dark min-h-screen">
      {/* Shared fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-50" />
      {/* Global dot grid */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none -z-40"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <Helmet>
        <title>Oriento Academy - Orientohub</title>
        <meta name="description" content="Conheça a Oriento Academy: plataforma premium de cursos, certificações e aprendizagem gamificada para founders e inovadores." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] w-full overflow-hidden flex items-center">
        {/* Animated background elements */}
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container-custom relative z-10 pt-24 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-[#FFF200]/60 bg-gradient-to-b from-white/10 to-black/80 px-3.5 py-2 shadow-none backdrop-blur-md mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF200]/15 ring-1 ring-[#FFF200]/25">
                <GraduationCap className="h-4 w-4 text-[#FFF200]" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
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
              className="text-lg md:text-2xl font-semibold mb-8 bg-gradient-to-r from-[#FFF200] via-[#FFF200] to-[#FFF200] bg-clip-text text-transparent tracking-tight"
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
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-semibold rounded-2xl shadow-none shadow-none transition"
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
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="pt-12 pb-16">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#FFF200]/25 bg-[#FFF200]/[0.08] px-4 py-2 shadow-sm shadow-none backdrop-blur-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF200]/15">
                <GraduationCap className="h-3.5 w-3.5 text-[#FFF200]" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">Sobre a Academy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">O que é a Oriento Academy?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Uma plataforma de aprendizagem inovadora, criada para acelerar o desenvolvimento de founders, líderes e equipes de startups. Aqui, você encontra conteúdos práticos, certificações reconhecidas e uma jornada gamificada que transforma conhecimento em conquistas reais.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AcademyFeature
              icon={<BookOpen className="w-10 h-10 text-[#FFF200]" />}
              title="Conteúdo Premium"
              description="Cursos e trilhas desenvolvidos por especialistas do mercado, focados em inovação, negócios e tecnologia."
              delay={0.1}
            />
            <AcademyFeature
              icon={<Award className="w-10 h-10 text-[#FFF200]" />}
              title="Certificações Reconhecidas"
              description="Comprove seu conhecimento e destaque-se no mercado com certificações exclusivas."
              delay={0.2}
            />
            <AcademyFeature
              icon={<Sparkles className="w-10 h-10 text-[#FFF200]" />}
              title="Gamificação e Badges"
              description="Conquiste badges, suba de nível e participe de rankings enquanto aprende."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)',
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
              <GraduationCap className="w-16 h-16 text-[#FFF200] mx-auto mb-6" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Pronto para acelerar sua jornada?
              <br />
              <span className="text-[#FFF200]">
                Aprenda com os melhores.
              </span>
            </h2>
            <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[#FFF200]/30 bg-gradient-to-r from-[#FFF200]/[0.08] via-[#FFF200]/[0.16] to-[#FFF200]/[0.08] px-6 py-6 shadow-none backdrop-blur-md sm:px-10 sm:py-7">
              <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent" />
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFF200]/25 bg-black/30 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FFF200]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFF200]">Oriento Academy</span>
              </div>
              <p className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Onde founders se tornam <span className="text-[#FFF200]">referência.</span>
              </p>
            </div>
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/cadastro"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-bold text-xl rounded-xl shadow-none shadow-none hover:shadow-none transition-all duration-300 hover:scale-105"
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
    </div>
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
    className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#FFF200] dark:hover:border-[#FFF200] transition-all duration-300 hover:shadow-none hover:shadow-none"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
  >
    <div className="relative w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-none">
      <div className="absolute inset-0 bg-[#FFF200]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 group-hover:text-[#FFF200] transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

export default AcademyPage;
