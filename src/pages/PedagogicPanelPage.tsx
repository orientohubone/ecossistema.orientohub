import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle,
  Layers,
  Lock,
  Plus,
  Target,
  ShieldCheck,
  Trash2,
  GripVertical,
  Video,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { academyCategories, type Course, type Module, type Lesson, type Attachment } from '../data/academyCourses';
import { useCourseStore } from '../stores/courseStore';

interface CourseFormState {
  title: string;
  description: string;
  level: Course['level'];
  category: string;
  isPremium: boolean;
  thumbnail: string;
}

const PedagogicPanelPage = () => {
  // Force refresh
  const {
    courses,
    addCourse,
    updateCourse,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson
  } = useCourseStore();

  const [editingCourseId, setEditingCourseId] = useState<number | 'new'>(() => courses[0]?.id ?? 0);

  // Derived state for the currently selected course
  const editingCourse = useMemo(() =>
    editingCourseId === 'new'
      ? null
      : courses.find(c => c.id === editingCourseId) ?? null
    , [courses, editingCourseId]);

  const [courseForm, setCourseForm] = useState<CourseFormState>({
    title: '',
    description: '',
    level: 'Iniciante',
    category: 'validation',
    isPremium: false,
    thumbnail: '',
  });

  // Curriculum State
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string, lesson: Lesson } | null>(null);

  // Initialize form when switching courses
  useEffect(() => {
    if (editingCourseId === 'new') {
      setCourseForm({
        title: 'Novo Curso',
        description: '',
        level: 'Iniciante',
        category: 'validation',
        isPremium: false,
        thumbnail: '',
      });
      setExpandedModules({});
    } else if (editingCourse) {
      setCourseForm({
        title: editingCourse.title,
        description: editingCourse.description,
        level: editingCourse.level,
        category: editingCourse.category,
        isPremium: editingCourse.isPremium,
        thumbnail: editingCourse.thumbnail,
      });
      // Expand first module by default
      if (editingCourse.modules?.length > 0) {
        setExpandedModules({ [editingCourse.modules[0].id]: true });
      }
    }
  }, [editingCourseId, editingCourse]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const premiumCourses = courses.filter(course => course.isPremium).length;
    const avgRating = totalCourses
      ? (courses.reduce((acc, course) => acc + course.rating, 0) / totalCourses).toFixed(1)
      : '0.0';

    // Calculate total duration roughly (mock logic)
    const totalHours = courses.reduce((acc, course) => {
      const [hours] = course.duration.split('h');
      return acc + (parseFloat(hours) || 0);
    }, 0);

    return {
      totalCourses,
      premiumCourses,
      avgRating,
      totalHours: Number(totalHours.toFixed(1)),
    };
  }, [courses]);

  const handleCourseFormChange = <K extends keyof CourseFormState>(field: K, value: CourseFormState[K]) => {
    setCourseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateOrUpdateCourse = (event: FormEvent) => {
    event.preventDefault();

    if (editingCourseId === 'new') {
      const newCourse: Course = {
        id: Date.now(),
        ...courseForm,
        badge: 'Novo',
        rating: 0,
        reviews: 0,
        students: 0,
        lessonsCount: 0,
        duration: '0h 0min',
        completed: false,
        progress: 0,
        instructor: 'Founder', // Default
        tags: [],
        modules: []
      };
      addCourse(newCourse);
      setEditingCourseId(newCourse.id);
    } else {
      updateCourse(editingCourseId, courseForm);
    }
  };

  // --- Module Management ---

  const handleAddModule = () => {
    if (editingCourseId === 'new') return;

    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: 'Novo Módulo',
      lessons: []
    };

    addModule(editingCourseId, newModule);
    setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
  };

  const handleUpdateModuleTitle = (moduleId: string, newTitle: string) => {
    if (editingCourseId === 'new') return;
    updateModule(editingCourseId, moduleId, { title: newTitle });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (editingCourseId === 'new') return;
    if (!confirm('Tem certeza que deseja excluir este módulo e todas as suas aulas?')) return;
    deleteModule(editingCourseId, moduleId);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // --- Lesson Management ---

  const handleAddLesson = (moduleId: string) => {
    if (editingCourseId === 'new') return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: 'Nova Aula',
      duration: '00:00',
      videoUrl: '',
      attachments: []
    };

    addLesson(editingCourseId, moduleId, newLesson);

    // Automatically open editor for new lesson
    setEditingLesson({ moduleId, lesson: newLesson });
  };

  const handleUpdateLessonLocal = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    if (editingCourseId === 'new') return;
    updateLesson(editingCourseId, moduleId, lessonId, updates);

    // Update local editing state if currently editing this lesson
    if (editingLesson?.lesson.id === lessonId) {
      setEditingLesson(prev => prev ? { ...prev, lesson: { ...prev.lesson, ...updates } } : null);
    }
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (editingCourseId === 'new') return;
    if (!confirm('Excluir esta aula?')) return;
    deleteLesson(editingCourseId, moduleId, lessonId);
    if (editingLesson?.lesson.id === lessonId) setEditingLesson(null);
  };

  // --- Attachment Management ---

  const handleAddAttachment = () => {
    if (!editingLesson || editingCourseId === 'new') return;
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: 'Novo Material',
      url: '',
      type: 'link'
    };

    const currentAttachments = editingLesson.lesson.attachments || [];
    handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, {
      attachments: [...currentAttachments, newAttachment]
    });
  };

  const handleUpdateAttachment = (attachmentId: string, field: keyof Attachment, value: string) => {
    if (!editingLesson || editingCourseId === 'new') return;
    const currentAttachments = editingLesson.lesson.attachments || [];
    const updatedAttachments = currentAttachments.map(a =>
      a.id === attachmentId ? { ...a, [field]: value } : a
    );
    handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, {
      attachments: updatedAttachments
    });
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    if (!editingLesson || editingCourseId === 'new') return;
    const currentAttachments = editingLesson.lesson.attachments || [];
    const updatedAttachments = currentAttachments.filter(a => a.id !== attachmentId);
    handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, {
      attachments: updatedAttachments
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Helmet>
        <title>Painel Pedagógico - Oriento Academy</title>
      </Helmet>

      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container-custom py-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 px-4 py-1 text-sm font-semibold text-amber-800 dark:text-amber-400">
            <ShieldCheck size={16} /> Acesso restrito ao founder
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Governança pedagógica da Oriento Academy</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
            Gerencie cursos, módulos e aulas. Estruture o conhecimento que será entregue aos empreendedores.
          </p>
        </div>
      </div>

      <div className="container-custom py-12 space-y-12">
        {/* Stats Section */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Cursos ativos" value={stats.totalCourses} icon={<Layers className="h-5 w-5 text-primary-500" />} />
          <StatCard label="Premium" value={stats.premiumCourses} icon={<Lock className="h-5 w-5 text-primary-500" />} />
          <StatCard label="Horas desenhadas" value={`${stats.totalHours}h`} icon={<Target className="h-5 w-5 text-primary-500" />} />
          <StatCard label="Avaliação média" value={stats.avgRating} icon={<CheckCircle className="h-5 w-5 text-primary-500" />} />
        </section>

        <div className="grid gap-10 lg:grid-cols-[350px_1fr]">

          {/* Sidebar: Course List */}
          <aside className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Meus Cursos</h3>
              <button
                onClick={() => setEditingCourseId('new')}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <Plus size={14} /> NOVO
              </button>
            </div>

            <div className="space-y-3">
              {courses.map(course => (
                <div
                  key={course.id}
                  onClick={() => setEditingCourseId(course.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition hover:border-primary-500 ${editingCourseId === course.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                >
                  <h4 className="font-semibold">{course.title}</h4>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded-full ${course.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {course.isPremium ? 'Premium' : 'Gratuito'}
                    </span>
                    <span>{course.modules?.length || 0} módulos</span>
                  </div>
                </div>
              ))}

              {editingCourseId === 'new' && (
                <div className="rounded-xl border border-dashed border-primary-500 bg-primary-50 dark:bg-primary-900/10 p-4">
                  <h4 className="font-semibold text-primary-700 dark:text-primary-400">Criando novo curso...</h4>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content: Editor */}
          <main className="space-y-8">

            {/* Course Settings */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Configurações do Curso</h2>
              <form onSubmit={handleCreateOrUpdateCourse} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Título</label>
                    <input
                      value={courseForm.title}
                      onChange={(e) => handleCourseFormChange('title', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                      placeholder="Ex: Validação de Startups"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Categoria</label>
                    <select
                      value={courseForm.category}
                      onChange={(e) => handleCourseFormChange('category', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                    >
                      {academyCategories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => handleCourseFormChange('description', e.target.value)}
                    className="mt-2 h-24 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseForm.isPremium}
                      onChange={(e) => handleCourseFormChange('isPremium', e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Conteúdo Premium (Exclusivo Assinantes)</span>
                  </label>

                  <button type="submit" className="ml-auto rounded-xl bg-primary-600 px-6 py-2.5 text-white font-semibold shadow-sm hover:bg-primary-500 transition">
                    {editingCourseId === 'new' ? 'Criar Curso' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </section>

            {/* Curriculum Builder (Only visible if not creating new course) */}
            {editingCourseId !== 'new' && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Grade Curricular</h2>
                    <p className="text-sm text-slate-500">Gerencie módulos e aulas do curso</p>
                  </div>
                  <button
                    onClick={handleAddModule}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <Plus size={16} /> Adicionar Módulo
                  </button>
                </div>

                <div className="space-y-4">
                  {(!editingCourse?.modules || editingCourse.modules.length === 0) && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      <Layers className="mx-auto h-10 w-10 text-slate-300" />
                      <p className="mt-2 text-slate-500">Nenhum módulo criado ainda.</p>
                    </div>
                  )}

                  {editingCourse?.modules?.map((module, index) => (
                    <div key={module.id} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      {/* Module Header */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex items-center gap-3">
                        <button onClick={() => toggleModule(module.id)} className="text-slate-400 hover:text-slate-600">
                          {expandedModules[module.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <div className="flex-1">
                          <input
                            value={module.title}
                            onChange={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                            className="bg-transparent font-semibold text-slate-900 dark:text-white w-full focus:outline-none focus:border-b border-primary-500"
                          />
                          <span className="text-xs text-slate-500">{module.lessons.length} aulas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddLesson(module.id)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                            title="Adicionar Aula"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteModule(module.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Excluir Módulo"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Lessons List */}
                      {expandedModules[module.id] && (
                        <div className="p-2 space-y-1 bg-white dark:bg-slate-950">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer border border-transparent ${editingLesson?.lesson.id === lesson.id ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/10 dark:border-primary-800' : ''
                                }`}
                              onClick={() => setEditingLesson({ moduleId: module.id, lesson })}
                            >
                              <GripVertical size={16} className="text-slate-300 cursor-move" />
                              <div className={`p-1.5 rounded-md ${lesson.videoUrl ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Video size={14} />
                              </div>
                              <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                              <span className="text-xs text-slate-400">{lesson.duration}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteLesson(module.id, lesson.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          {module.lessons.length === 0 && (
                            <p className="text-center text-xs text-slate-400 py-4">Nenhuma aula neste módulo.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Lesson Editor Modal/Drawer */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <h3 className="font-bold text-lg">Editando Aula</h3>
              <button
                onClick={() => setEditingLesson(null)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Fechar
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Título da Aula</label>
                <input
                  value={editingLesson.lesson.title}
                  onChange={(e) => handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, { title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Duração (MM:SS)</label>
                  <input
                    value={editingLesson.lesson.duration}
                    onChange={(e) => handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, { duration: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-transparent"
                    placeholder="00:00"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLesson.lesson.isFree}
                      onChange={(e) => handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, { isFree: e.target.checked })}
                      className="rounded border-slate-300 text-primary-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Aula Gratuita (Preview)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">URL do Vídeo (YouTube/Vimeo)</label>
                <div className="flex gap-2">
                  <input
                    value={editingLesson.lesson.videoUrl}
                    onChange={(e) => handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, { videoUrl: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-transparent"
                    placeholder="https://..."
                  />
                </div>
                {editingLesson.lesson.videoUrl && (
                  <div className="mt-3 aspect-video rounded-lg bg-slate-100 overflow-hidden">
                    <iframe
                      src={editingLesson.lesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      title="Preview"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Descrição / Resumo</label>
                <textarea
                  value={editingLesson.lesson.description}
                  onChange={(e) => handleUpdateLessonLocal(editingLesson.moduleId, editingLesson.lesson.id, { description: e.target.value })}
                  className="w-full h-32 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-transparent"
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold">Materiais Complementares</label>
                  <button
                    onClick={handleAddAttachment}
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    + ADICIONAR MATERIAL
                  </button>
                </div>

                <div className="space-y-3">
                  {editingLesson.lesson.attachments?.map((att) => (
                    <div key={att.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <FileText size={16} className="mt-1 text-slate-400" />
                      <div className="flex-1 space-y-2">
                        <input
                          value={att.name}
                          onChange={(e) => handleUpdateAttachment(att.id, 'name', e.target.value)}
                          className="w-full bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-primary-300"
                          placeholder="Nome do arquivo"
                        />
                        <input
                          value={att.url}
                          onChange={(e) => handleUpdateAttachment(att.id, 'url', e.target.value)}
                          className="w-full bg-transparent text-xs text-slate-500 focus:outline-none border-b border-transparent focus:border-primary-300"
                          placeholder="URL do arquivo (Google Drive, Notion, etc)"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteAttachment(att.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(!editingLesson.lesson.attachments || editingLesson.lesson.attachments.length === 0) && (
                    <p className="text-xs text-slate-400 italic">Nenhum material anexado.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button
                onClick={() => setEditingLesson(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-white font-semibold shadow-sm hover:bg-slate-800"
              >
                Concluir Edição
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: JSX.Element }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm">
    <div className="flex items-center gap-3 text-sm text-slate-500">
      {icon}
      <span className="font-semibold uppercase tracking-[0.3em]">{label}</span>
    </div>
    <p className="mt-3 text-3xl font-bold">{value}</p>
  </div>
);

export default PedagogicPanelPage;
