import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, Award, BookOpen, Users, MessageCircle, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const mockCourses = [
  {
    id: 1,
    title: 'Jornada do Founder',
    description: 'Do zero à validação: aprenda a criar, validar e acelerar sua startup com metodologia Orientohub.',
    level: 'Iniciante',
    badge: 'Founder Starter',
    rating: 4.8,
    reviews: 120,
    lessons: 12,
    completed: false,
    color: 'from-primary-500 to-purple-500',
  },
  {
    id: 2,
    title: 'Growth & Tração',
    description: 'Estratégias práticas de growth hacking, marketing digital e tração para startups.',
    level: 'Intermediário',
    badge: 'Growth Hacker',
    rating: 4.7,
    reviews: 98,
    lessons: 10,
    completed: true,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    title: 'Liderança & Cultura',
    description: 'Desenvolva habilidades de liderança, cultura organizacional e gestão de times inovadores.',
    level: 'Avançado',
    badge: 'Líder Inovador',
    rating: 4.9,
    reviews: 76,
    lessons: 8,
    completed: false,
    color: 'from-yellow-500 to-orange-500',
  },
];

const OrientoAcademyPage = () => {
  type Course = {
    id: number;
    title: string;
    description: string;
    level: string;
    badge: string;
    rating: number;
    reviews: number;
    lessons: number;
    completed: boolean;
    color: string;
  };

  // Correção: hook fora de JSX
  // Hook de autenticação corretamente posicionado
  const user = useAuthStore.getState().user;
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <>
      <Helmet>
        <title>Oriento Academy - Cursos</title>
        <meta name="description" content="Área de cursos premium, gamificada e lúdica da Oriento Academy." />
      </Helmet>
      <section className="min-h-screen bg-gradient-to-br from-primary-900 via-gray-900 to-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-primary-500/40 bg-primary-500/10 text-primary-500 backdrop-blur-sm mb-4">
];
              <Sparkles className="w-5 h-5 animate-pulse" />
const initialCourses = [...mockCourses]; // Initialize with mockCourses
              <span className="font-bold text-lg tracking-wide">Oriento Academy</span>
            </div>
  const isFounder = user?.role === 'founder' || user?.isFounder;
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Cursos, badges, comentários, ranking e experiências de aprendizagem premium para founders e inovadores.</p>
          </motion.div>

  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
          {/* Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mockCourses.map(course => (
              <motion.div
                key={course.id}
                className={`relative bg-gradient-to-br ${course.color} p-1 rounded-2xl shadow-xl group hover:scale-105 transition-transform duration-300`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * course.id }}
              >
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-primary-500" />
                    <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">{course.badge}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{course.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    <span className="text-sm text-gray-500">{course.lessons} aulas</span>
                    <Users className="w-5 h-5 text-primary-500 ml-4" />
                    <span className="text-sm text-gray-500">{course.reviews} avaliações</span>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-gray-500 font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    {course.completed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                        <CheckCircle className="w-4 h-4" /> Concluído
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg shadow transition"
                      >
                        Iniciar Curso <Trophy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modal de Curso Selecionado */}
          {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-primary-500 text-2xl"
                  onClick={() => setSelectedCourse(null)}
                  aria-label="Fechar"
                >
                  ×
                </button>
                <h2 className="text-3xl font-bold mb-2 text-primary-500">{selectedCourse.title}</h2>
                <span className="inline-block mb-4 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">{selectedCourse.badge}</span>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedCourse.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-500">{selectedCourse.lessons} aulas</span>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(selectedCourse.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-500 font-semibold">{selectedCourse.rating}</span>
                </div>
                {/* Comentários (mock) */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary-500" /> Comentários</h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <span className="font-semibold text-primary-500">@founderbr</span> <span className="text-gray-600 dark:text-gray-300">Excelente didática e muito prático!</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <span className="font-semibold text-primary-500">@inovador</span> <span className="text-gray-600 dark:text-gray-300">A gamificação motiva a concluir cada etapa!</span>
                    </div>
                  </div>
                  <form className="mt-4 flex gap-2">
                    <input type="text" placeholder="Deixe seu comentário..." className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200" />
                    <button type="submit" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold">Enviar</button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default OrientoAcademyPage;
