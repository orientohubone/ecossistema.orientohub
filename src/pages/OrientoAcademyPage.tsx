import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Star, 
  Award, 
  BookOpen, 
  Users, 
  Trophy, 
  CheckCircle, 
  Play,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Lock,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

const mockCourses = [
  {
    id: 1,
    title: 'Validação de Ideias na Prática',
    description: 'Aprenda metodologias comprovadas para validar sua ideia de negócio antes de investir tempo e dinheiro.',
    level: 'Iniciante',
    badge: 'Validador',
    rating: 4.8,
    reviews: 120,
    students: 850,
    lessons: 12,
    duration: '4h 30min',
    completed: false,
    progress: 0,
    thumbnail: '/course-validation.jpg',
    instructor: 'João Silva',
    category: 'validation',
    tags: ['Lean Startup', 'MVP', 'Entrevistas'],
    isPremium: false,
  },
  {
    id: 2,
    title: 'Growth Hacking Avançado',
    description: 'Estratégias práticas de crescimento acelerado utilizadas por startups de sucesso.',
    level: 'Intermediário',
    badge: 'Growth Master',
    rating: 4.9,
    reviews: 98,
    students: 650,
    lessons: 15,
    duration: '6h 15min',
    completed: true,
    progress: 100,
    thumbnail: '/course-growth.jpg',
    instructor: 'Maria Santos',
    category: 'growth',
    tags: ['Marketing', 'Métricas', 'Automação'],
    isPremium: true,
  },
  {
    id: 3,
    title: 'Liderança para Founders',
    description: 'Desenvolva habilidades essenciais de liderança para construir e gerenciar times de alta performance.',
    level: 'Avançado',
    badge: 'Líder',
    rating: 4.7,
    reviews: 76,
    students: 420,
    lessons: 10,
    duration: '5h 20min',
    completed: false,
    progress: 30,
    thumbnail: '/course-leadership.jpg',
    instructor: 'Pedro Costa',
    category: 'leadership',
    tags: ['Gestão', 'Cultura', 'Team Building'],
    isPremium: true,
  },
  {
    id: 4,
    title: 'Captação de Investimento',
    description: 'Prepare sua startup para rodadas de investimento e aprenda a negociar com investidores.',
    level: 'Avançado',
    badge: 'Investidor',
    rating: 4.9,
    reviews: 54,
    students: 380,
    lessons: 8,
    duration: '4h 45min',
    completed: false,
    progress: 0,
    thumbnail: '/course-investment.jpg',
    instructor: 'Ana Rodrigues',
    category: 'finance',
    tags: ['Pitch', 'Valuation', 'Term Sheet'],
    isPremium: true,
  },
];

const categories = [
  { id: 'all', name: 'Todos', icon: BookOpen },
  { id: 'validation', name: 'Validação', icon: Target },
  { id: 'growth', name: 'Growth', icon: TrendingUp },
  { id: 'leadership', name: 'Liderança', icon: Users },
  { id: 'finance', name: 'Finanças', icon: Trophy },
];

const OrientoAcademyPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<typeof mockCourses[0] | null>(null);

  const filteredCourses = mockCourses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    totalCourses: mockCourses.length,
    completedCourses: mockCourses.filter(c => c.completed).length,
    totalHours: mockCourses.reduce((acc, c) => acc + parseFloat(c.duration.split('h')[0]), 0),
    avgRating: (mockCourses.reduce((acc, c) => acc + c.rating, 0) / mockCourses.length).toFixed(1),
  };

  return (
    <>
      <Helmet>
        <title>Oriento Academy - Cursos Premium</title>
        <meta name="description" content="Cursos exclusivos para founders e empreendedores que querem acelerar o crescimento de suas startups." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent" />
          
          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-6">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Oriento Academy</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                Aprenda com quem já{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">
                  construiu
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Cursos práticos e certificações criadas por founders experientes para acelerar sua jornada empreendedora.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-3xl font-bold text-primary-500">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cursos</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-3xl font-bold text-primary-500">{stats.totalHours.toFixed(0)}h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">De conteúdo</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-3xl font-bold text-primary-500">{stats.avgRating}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avaliação</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-3xl font-bold text-primary-500">2.3k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Alunos</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={[
                        "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap",
                        activeCategory === category.id
                          ? "bg-primary-500 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      ].join(" ")}
                    >
                      <Icon size={18} />
                      {category.name}
                    </motion.button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="container-custom">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400">Nenhum curso encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                        {course.isPremium && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
                            <Zap size={14} />
                            Premium
                          </div>
                        )}
                        <BookOpen className="w-20 h-20 text-primary-500/40" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full">
                            {course.level}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{course.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <BookOpen size={16} />
                            <span>{course.lessons} aulas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Progress or CTA */}
                        {course.completed ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                                <CheckCircle size={16} />
                                Concluído
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">100%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                          </div>
                        ) : course.progress > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-primary-600 dark:text-primary-400 font-semibold">Em andamento</span>
                              <span className="text-gray-600 dark:text-gray-400">{course.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCourse(course)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                            >
                              Continuar
                              <Play size={18} />
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCourse(course)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                          >
                            Começar Curso
                            <ChevronRight size={18} />
                          </motion.button>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {course.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedCourse.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold rounded-full">
                        {selectedCourse.badge}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{selectedCourse.rating}</span>
                        <span className="text-gray-600 dark:text-gray-400">({selectedCourse.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCourse(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-2xl text-gray-600 dark:text-gray-400">×</span>
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-lg">{selectedCourse.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <BookOpen className="w-6 h-6 text-primary-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse.lessons}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Aulas</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Clock className="w-6 h-6 text-primary-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse.duration}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duração</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Users className="w-6 h-6 text-primary-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse.students}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Alunos</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Trophy className="w-6 h-6 text-primary-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse.level}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Nível</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">O que você vai aprender</h3>
                  <ul className="space-y-2">
                    {[
                      'Metodologias práticas e aplicáveis no dia a dia',
                      'Frameworks utilizados por startups de sucesso',
                      'Cases reais e exemplos práticos',
                      'Certificado de conclusão reconhecido',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instrutor</h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedCourse.instructor[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{selectedCourse.instructor}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Founder & Mentor</div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
                >
                  Iniciar Curso Agora
                  <Play size={20} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrientoAcademyPage;
