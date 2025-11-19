import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
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
  TrendingUp,
  Target,
  Zap,
  Lock,
  ChevronRight,
  Search,
  Plus,
  X
} from 'lucide-react';

interface CourseMaterial {
  id: string;
  label: string;
  url: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  badge: string;
  rating: number;
  reviews: number;
  students: number;
  lessons: number;
  duration: string;
  completed: boolean;
  progress: number;
  thumbnail: string;
  instructor: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  youtubeUrl?: string;
  materials?: CourseMaterial[];
}

interface CourseFormState {
  title: string;
  description: string;
  youtubeUrl: string;
  level: Course['level'];
  category: string;
  isPremium: boolean;
}

const mockCourses: Course[] = [
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
    youtubeUrl: 'https://www.youtube.com/watch?v=123',
    materials: [
      { id: 'm11', label: 'Checklist de Validação', url: 'https://orientohub.notion.site/checklist' },
      { id: 'm12', label: 'Template de Entrevista', url: 'https://drive.google.com/template' }
    ]
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
    youtubeUrl: 'https://www.youtube.com/watch?v=456',
    materials: [
      { id: 'm21', label: 'Planilha North Star Metrics', url: 'https://orientohub.com/materials/north-star.xlsx' }
    ]
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
    youtubeUrl: 'https://www.youtube.com/watch?v=789'
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
    youtubeUrl: 'https://www.youtube.com/watch?v=101112'
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
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<number>(() => mockCourses[0]?.id ?? 0);
  const editingCourse = courses.find(course => course.id === editingCourseId) ?? courses[0];
  const [courseForm, setCourseForm] = useState<CourseFormState>(() => ({
    title: editingCourse?.title ?? '',
    description: editingCourse?.description ?? '',
    youtubeUrl: editingCourse?.youtubeUrl ?? '',
    level: editingCourse?.level ?? 'Iniciante',
    category: editingCourse?.category ?? 'validation',
    isPremium: editingCourse?.isPremium ?? false,
  }));
  const [newMaterial, setNewMaterial] = useState({ label: '', url: '' });

  useEffect(() => {
    if (editingCourse) {
      setCourseForm({
        title: editingCourse.title,
        description: editingCourse.description,
        youtubeUrl: editingCourse.youtubeUrl ?? '',
        level: editingCourse.level,
        category: editingCourse.category,
        isPremium: editingCourse.isPremium,
      });
      setNewMaterial({ label: '', url: '' });
    }
  }, [editingCourse]);

  const selectedCourse = selectedCourseId ? courses.find(course => course.id === selectedCourseId) ?? null : null;

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
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

  const handleCourseFormChange = (field: keyof CourseFormState, value: string | boolean) => {
    setCourseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCourseUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCourse) return;

    setCourses(prev => prev.map(course => (
      course.id === editingCourse.id
        ? {
            ...course,
            title: courseForm.title,
            description: courseForm.description,
            youtubeUrl: courseForm.youtubeUrl,
            level: courseForm.level,
            category: courseForm.category,
            isPremium: courseForm.isPremium,
          }
        : course
    )));
  };

  const handleMaterialAdd = () => {
    if (!editingCourse || !newMaterial.label.trim() || !newMaterial.url.trim()) return;

    const material: CourseMaterial = {
      id: `material-${editingCourse.id}-${Date.now()}`,
      label: newMaterial.label.trim(),
      url: newMaterial.url.trim(),
    };

    setCourses(prev => prev.map(course => (
      course.id === editingCourse.id
        ? { ...course, materials: [...(course.materials ?? []), material] }
        : course
    )));
    setNewMaterial({ label: '', url: '' });
  };

  const handleMaterialRemove = (materialId: string) => {
    if (!editingCourse) return;
    setCourses(prev => prev.map(course => (
      course.id === editingCourse.id
        ? { ...course, materials: (course.materials ?? []).filter(material => material.id !== materialId) }
        : course
    )));
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(selectedCourse?.youtubeUrl);

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
                  href="#admin-controls"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40"
                >
                  Gerenciar cursos
                </a>
              </div>
            </motion.div>

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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                {filteredCourses.map((course, index) => (
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
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
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
                            <BookOpen size={16} /> {course.lessons} aulas
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={16} /> {course.duration}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users size={16} /> {course.students}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {course.tags.map(tag => (
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
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <p className="text-lg text-slate-600 dark:text-slate-300">{selectedCourse.description}</p>

                  {youtubeEmbedUrl && (
                    <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                      <iframe
                        src={youtubeEmbedUrl}
                        title={selectedCourse.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={<BookOpen className="h-5 w-5 text-primary-500" />} label="Aulas" value={selectedCourse.lessons} />
                    <StatCard icon={<Clock className="h-5 w-5 text-primary-500" />} label="Duração" value={selectedCourse.duration} />
                    <StatCard icon={<Users className="h-5 w-5 text-primary-500" />} label="Alunos" value={selectedCourse.students} />
                    <StatCard icon={<Trophy className="h-5 w-5 text-primary-500" />} label="Nível" value={selectedCourse.level} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">O que você vai aprender</h3>
                    <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                      {[`Metodologias aplicáveis`, `Frameworks validados`, `Cases reais`, `Certificação Orientohub`].map(item => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Materiais</h3>
                    {selectedCourse.materials?.length ? (
                      <div className="mt-3 space-y-3">
                        {selectedCourse.materials.map(material => (
                          <a
                            key={material.id}
                            href={material.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                          >
                            <span>{material.label}</span>
                            <ChevronRight size={16} />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500">Nenhum material complementar cadastrado.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Instrutor</h3>
                    <div className="mt-3 flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                      <div className="h-14 w-14 rounded-full bg-primary-500 text-black text-xl font-bold flex items-center justify-center">
                        {selectedCourse.instructor[0]}
                      </div>
                      <div>
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Course management */}
        <section id="admin-controls" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container-custom grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Painel pedagógico</p>
              <h2 className="mt-3 text-3xl font-bold">Controle de cursos e conteúdos</h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Ajuste títulos, categorias e URLs de vídeo mantendo consistência com o design system da Orientohub. Todos os campos foram pensados para suportar fluxos de instructional design.
              </p>

              <form onSubmit={handleCourseUpdate} className="mt-8 space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Curso</label>
                  <select
                    value={editingCourseId}
                    onChange={event => setEditingCourseId(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Título</label>
                    <input
                      value={courseForm.title}
                      onChange={event => handleCourseFormChange('title', event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Categoria</label>
                    <select
                      value={courseForm.category}
                      onChange={event => handleCourseFormChange('category', event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                    >
                      {categories.filter(category => category.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nível</label>
                    <select
                      value={courseForm.level}
                      onChange={event => handleCourseFormChange('level', event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Curso Premium
                      <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm">
                        <input
                          type="checkbox"
                          checked={courseForm.isPremium}
                          onChange={event => handleCourseFormChange('isPremium', event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-slate-600 dark:text-slate-300">Restrinja o acesso aos assinantes</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label>
                  <textarea
                    value={courseForm.description}
                    onChange={event => handleCourseFormChange('description', event.target.value)}
                    className="mt-2 h-28 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">URL do vídeo (YouTube)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={courseForm.youtubeUrl}
                    onChange={event => handleCourseFormChange('youtubeUrl', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                  />
                  <p className="mt-1 text-xs text-slate-500">Transformamos automaticamente em embed para a área do curso.</p>
                </div>

                <button type="submit" className="w-full rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold shadow-sm hover:bg-slate-800">
                  Salvar alterações do curso
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Materiais</p>
                  <h3 className="mt-2 text-2xl font-semibold">Biblioteca do curso</h3>
                </div>
                <span className="text-sm text-slate-500">{editingCourse?.materials?.length ?? 0} itens</span>
              </div>

              <div className="mt-6 space-y-3">
                {editingCourse?.materials?.length ? (
                  editingCourse.materials.map(material => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{material.label}</p>
                        <a href={material.url} target="_blank" rel="noreferrer" className="text-xs text-primary-500">
                          {material.url}
                        </a>
                      </div>
                      <button type="button" onClick={() => handleMaterialRemove(material.id)} className="text-xs font-semibold text-red-500 hover:text-red-400">
                        remover
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-500">
                    Nenhum material cadastrado. Utilize o formulário abaixo para adicionar novos recursos.
                  </p>
                )}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome do material</label>
                  <input
                    value={newMaterial.label}
                    onChange={event => setNewMaterial(prev => ({ ...prev, label: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">URL do material</label>
                  <input
                    value={newMaterial.url}
                    onChange={event => setNewMaterial(prev => ({ ...prev, url: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm"
                    placeholder="https://orientohub.com/material"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleMaterialAdd}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              >
                <Plus size={16} />
                Adicionar material
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const StatCard = ({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-4">
    <div className="mb-2">{icon}</div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
  </div>
);

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
