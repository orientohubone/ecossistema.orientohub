import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Award,
  BookOpen,
  Users,
  Trophy,
  CheckCircle,
  Play,
  Clock,
  Lock,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { academyCategories, type Course } from '../data/academyCourses';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { isFounderUser, DEFAULT_FOUNDER_SECRET } from '../utils/founderAccess';
import { supabase } from '../config/supabase';

const OrientoAcademyPage = () => {
  const courses = useCourseStore((state) => state.courses);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [founderSecretInput, setFounderSecretInput] = useState<string>(() => (
    typeof window !== 'undefined' ? sessionStorage.getItem('founderSecret') ?? '' : ''
  ));
  const [secretStatus, setSecretStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [secretRefreshToken, setSecretRefreshToken] = useState<number>(0);

  const selectedCourse: Course | null = selectedCourseId ? courses.find(course => course.id === selectedCourseId) ?? null : null;

  const filteredCourses = useMemo<Course[]>(() => {
    return courses.filter((course) => {
      const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(course => course.completed).length;
    const totalHours = courses.reduce((acc, course) => {
      const [hours] = course.duration.split('h');
      return acc + (parseFloat(hours) || 0);
    }, 0);
    const avgRating = totalCourses ? (courses.reduce((acc, course) => acc + course.rating, 0) / totalCourses).toFixed(1) : '0.0';

    return {
      totalCourses,
      completedCourses,
      totalHours: Number(totalHours.toFixed(1)),
      avgRating,
    };
  }, [courses]);

  const founderUnlocked = useMemo(() => isFounderUser(user, { requireSecret: true }), [user, secretRefreshToken]);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('founderSecret')) {
      setSecretRefreshToken((prev: number) => prev + 1);
    }
  }, []);

  const instructionalPillars = [
    {
      title: 'Percursos guiados',
      description: 'Cada trilha possui objetivos claros, com checkpoints e métricas de avanço.',
    },
    {
      title: 'Aplicação prática',
      description: 'Planos de ação, frameworks e rubricas alinhados ao dia a dia do founder.',
    },
    {
      title: 'Evidências de aprendizagem',
      description: 'Materiais, registros e avaliações documentam o progresso real.',
    },
  ];

  const youtubeEmbedUrl = getYoutubeEmbedUrl(selectedCourse?.modules?.[0]?.lessons?.[0]?.videoUrl);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };



  const handleFounderSecretSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSecret = founderSecretInput.trim();
    if (!normalizedSecret) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('founderSecret');
      }
      setSecretRefreshToken((prev: number) => prev + 1);
      setSecretStatus('error');
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('founderSecret', normalizedSecret);
    }

    // Persist to Supabase to link the key to the user account
    try {
      await supabase.auth.updateUser({
        data: { founder_secret: normalizedSecret }
      });
    } catch (error) {
      console.error('Failed to link founder secret:', error);
    }

    setSecretRefreshToken((prev: number) => prev + 1);

    const unlocksPanel = isFounderUser(useAuthStore.getState().user, { requireSecret: true });
    if (unlocksPanel) {
      setSecretStatus('success');
      navigate('/dashboard/pedagogico');
    } else {
      setSecretStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Oriento Academy - Cursos Premium</title>
        <meta name="description" content="Cursos exclusivos para founders e empreendedores que querem acelerar o crescimento de suas startups." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* Hero Section */}
        <section className="py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container-custom grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 px-4 py-1 text-sm font-semibold text-amber-800 dark:text-amber-400">
                <Award className="h-4 w-4" />
                Oriento Academy
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Formação instrucional para founders que aplicam o que aprendem
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                Estruturamos trilhas com objetivos claros, rubricas e materiais aplicáveis para garantir profundidade e execução.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3 font-semibold text-black shadow-sm shadow-primary-500/40 transition hover:bg-primary-400"
                >
                  Explorar trilhas
                </a>
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40"
                >
                  Ver catálogo
                </a>
              </div>
            </motion.div>

            <div className="space-y-6">
              {/* Pedagogic Panel Card - Only visible to authenticated users */}
              {user && (
                <div id="painel-pedagogico" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary-500">
                    <Lock size={14} /> Painel pedagógico
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold">Governança da Academy</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Área exclusiva para founders Orientohub e tutores pedagógicos.
                  </p>

                  {isFounderUser(user, { requireSecret: false }) ? (
                    // Is a Founder/Tutor (Base Access)
                    founderUnlocked ? (
                      // Has Valid Key
                      <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-green-400/40 bg-green-500/10 p-4 text-sm text-green-200 dark:text-green-100">
                          Acesso liberado. Você pode administrar currículos, materiais e checklists do painel pedagógico.
                        </div>
                        <div className="flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={() => navigate('/dashboard/pedagogico')}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Entrar no painel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Pending Key
                      <form onSubmit={handleFounderSecretSubmit} className="mt-6 space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Chave pedagógica</label>
                          <input
                            type="password"
                            value={founderSecretInput}
                            onChange={(event) => {
                              setFounderSecretInput(event.target.value);
                              setSecretStatus('idle');
                            }}
                            placeholder="Digite a chave de acesso..."
                            className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Validar acesso
                        </button>
                        {secretStatus === 'error' && (
                          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                            Chave incorreta. Tente novamente.
                          </div>
                        )}
                        {secretStatus === 'success' && (
                          <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">
                            Chave validada. Abrindo painel…
                          </div>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Caso não possua a chave, fale com o founder Orientohub.
                        </p>
                      </form>
                    )
                  ) : (
                    // Not a Founder
                    <div className="mt-6 space-y-4">
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-semibold mb-1">Acesso Restrito</p>
                        Este painel é reservado para a equipe pedagógica da Orientohub.
                      </div>
                      <a
                        href="#catalogo"
                        className="inline-flex items-center justify-center w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40"
                      >
                        Acessar catálogo
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8">
                <dl className="grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm text-slate-500">Cursos ativos</dt>
                    <dd className="text-3xl font-bold">{stats.totalCourses}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Avaliação média</dt>
                    <dd className="text-3xl font-bold">{stats.avgRating}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Horas desenhadas</dt>
                    <dd className="text-3xl font-bold">{stats.totalHours}h</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Trilhas concluídas</dt>
                    <dd className="text-3xl font-bold">{stats.completedCourses}</dd>
                  </div>
                </dl>
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-4 text-sm text-slate-600 dark:text-slate-300">
                  Atualizamos conteúdos com base em evidências de aprendizagem e métricas reais dos founders.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructional pillars */}
        <section className="py-10 bg-slate-100 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <div className="container-custom grid gap-6 md:grid-cols-3">
            {instructionalPillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">Pilar {idx + 1}</p>
                <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {academyCategories.map((category) => {
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
                          ? "bg-slate-900 text-white shadow"
                          : "bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900"
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section id="catalogo" className="py-14">
          <div className="container-custom">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-xl text-slate-600 dark:text-slate-400">Nenhum curso encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course: Course, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex h-full"
                  >
                    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm transition hover:-translate-y-1 hover:shadow-md w-full">
                      <div className="relative h-40 overflow-hidden rounded-t-2xl border-b border-slate-100 dark:border-slate-800">
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" loading="lazy" />
                        {course.isPremium && (
                          <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            <Lock size={14} /> Premium
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                          <span>{course.level}</span>
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <Star className="h-4 w-4 text-yellow-400" /> {course.rating}
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{course.description}</p>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <BookOpen size={16} /> {course.lessonsCount} aulas
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={16} /> {course.duration}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users size={16} /> {course.students}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {course.tags.map((tag: string) => (
                            <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 space-y-3">
                          {course.completed ? (
                            <div>
                              <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                                <span className="inline-flex items-center gap-1 font-semibold">
                                  <CheckCircle size={16} /> Concluído
                                </span>
                                <span>100%</span>
                              </div>
                              <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                <div className="h-full rounded-full bg-green-500" style={{ width: '100%' }} />
                              </div>
                            </div>
                          ) : course.progress > 0 ? (
                            <div>
                              <div className="flex items-center justify-between text-sm text-slate-500">
                                <span className="font-semibold text-primary-600 dark:text-primary-400">Em andamento</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${course.progress}%` }} />
                              </div>
                            </div>
                          ) : null}

                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setSelectedCourseId(course.id)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            {course.completed ? 'Revisar conteúdo' : course.progress > 0 ? 'Retomar curso' : 'Começar agora'}
                          </motion.button>
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
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              key="course-modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-950 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
              >
                <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-primary-500">Curso</p>
                    <h2 className="mt-2 text-3xl font-bold">{selectedCourse.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-900/50 px-3 py-1 font-semibold text-slate-700 dark:text-slate-200">
                        {selectedCourse.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Star className="h-4 w-4 text-yellow-400" /> {selectedCourse.rating} ({selectedCourse.reviews})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCourseId(null)}
                    className="rounded-full border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    aria-label="Fechar modal"
                  >
                        <p className="font-semibold">{selectedCourse.instructor}</p>
                        <p className="text-sm text-slate-500">Founder & Mentor</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-primary-500 px-6 py-4 text-lg font-semibold text-black shadow-lg shadow-primary-500/30 transition hover:bg-primary-400"
                  >
                    Iniciar Curso Agora
                    <Play size={20} />
                  </motion.button>
                </div>
    </motion.div >
            </motion.div >
          )}
        </AnimatePresence >
      </div >
    </>
  );
};

const getYoutubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  try {
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    return null;
  }
};

export default OrientoAcademyPage;
