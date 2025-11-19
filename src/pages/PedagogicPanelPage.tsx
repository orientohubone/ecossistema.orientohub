import { useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ClipboardList, FileText, Layers, Lock, Plus, Target } from 'lucide-react';
import { academyCategories, defaultCourses, type Course, type CourseMaterial } from '../data/academyCourses';

interface CourseFormState {
  title: string;
  description: string;
  youtubeUrl: string;
  level: Course['level'];
  category: string;
  isPremium: boolean;
}

const PedagogicPanelPage = () => {
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [editingCourseId, setEditingCourseId] = useState<number>(() => defaultCourses[0]?.id ?? 0);
  const editingCourse = courses.find(course => course.id === editingCourseId) ?? null;
  const [courseForm, setCourseForm] = useState<CourseFormState>(() => ({
    title: editingCourse?.title ?? '',
    description: editingCourse?.description ?? '',
    youtubeUrl: editingCourse?.youtubeUrl ?? '',
    level: editingCourse?.level ?? 'Iniciante',
    category: editingCourse?.category ?? academyCategories[1]?.id ?? 'validation',
    isPremium: editingCourse?.isPremium ?? false,
  }));
  const [newMaterial, setNewMaterial] = useState<{ label: string; url: string }>({ label: '', url: '' });

  useEffect(() => {
    if (!editingCourse) return;
    setCourseForm({
      title: editingCourse.title,
      description: editingCourse.description,
      youtubeUrl: editingCourse.youtubeUrl ?? '',
      level: editingCourse.level,
      category: editingCourse.category,
      isPremium: editingCourse.isPremium,
    });
    setNewMaterial({ label: '', url: '' });
  }, [editingCourse]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const premiumCourses = courses.filter(course => course.isPremium).length;
    const avgRating = totalCourses
      ? (courses.reduce((acc, course) => acc + course.rating, 0) / totalCourses).toFixed(1)
      : '0.0';
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

  const handleMaterialFieldChange = (field: 'label' | 'url') => (event: ChangeEvent<HTMLInputElement>) => {
    setNewMaterial(prev => ({ ...prev, [field]: event.target.value }));
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
            Ajuste currículos, materiais e streaming dos cursos com segurança. Toda alteração impacta imediatamente a vitrine pública
            e o cockpit dos alunos.
          </p>
        </div>
      </div>

      <div className="container-custom py-12 space-y-12">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Cursos ativos" value={stats.totalCourses} icon={<Layers className="h-5 w-5 text-primary-500" />} />
          <StatCard label="Premium" value={stats.premiumCourses} icon={<Lock className="h-5 w-5 text-primary-500" />} />
          <StatCard label="Horas desenhadas" value={`${stats.totalHours}h`} icon={<Target className="h-5 w-5 text-primary-500" />} />
          <StatCard label="Avaliação média" value={stats.avgRating} icon={<CheckCircle className="h-5 w-5 text-primary-500" />} />
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Configuração de curso</p>
            <h2 className="mt-3 text-3xl font-bold">Conteúdo e posicionamento</h2>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Sincronize a narrativa do curso, nível, categoria e streaming de vídeo. Esse formulário conversa com o catálogo público.
            </p>

            <form onSubmit={handleCourseUpdate} className="mt-8 space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Curso</label>
                <select
                  value={editingCourseId}
                  onChange={(event) => setEditingCourseId(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                >
                  {courses.map((course) => (
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
                    onChange={(event) => handleCourseFormChange('title', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Categoria</label>
                  <select
                    value={courseForm.category}
                    onChange={(event) => handleCourseFormChange('category', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                  >
                    {academyCategories.filter(category => category.id !== 'all').map(category => (
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
                    onChange={(event) => handleCourseFormChange('level', event.target.value as Course['level'])}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="w-full text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Curso Premium
                    <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={courseForm.isPremium}
                        onChange={(event) => handleCourseFormChange('isPremium', event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-slate-600 dark:text-slate-300">Restrinja a assinantes ativos</span>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Descrição</label>
                <textarea
                  value={courseForm.description}
                  onChange={(event) => handleCourseFormChange('description', event.target.value)}
                  className="mt-2 h-28 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">URL do vídeo (YouTube)</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={courseForm.youtubeUrl}
                  onChange={(event) => handleCourseFormChange('youtubeUrl', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">Geramos o embed automaticamente na vitrine.</p>
              </div>

              <button type="submit" className="w-full rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold shadow-sm hover:bg-slate-800">
                Salvar alterações
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Biblioteca</p>
                <h3 className="mt-2 text-2xl font-semibold">Materiais do curso</h3>
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
                      <a href={material.url} target="_blank" rel="noreferrer" className="text-xs text-primary-500 break-all">
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
                  Nenhum material cadastrado. Utilize o formulário abaixo.
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome do material</label>
                <input
                  value={newMaterial.label}
                  onChange={handleMaterialFieldChange('label')}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">URL do material</label>
                <input
                  value={newMaterial.url}
                  onChange={handleMaterialFieldChange('url')}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm"
                  placeholder="https://orientohub.com/material"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleMaterialAdd}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
            >
              <Plus size={16} /> Adicionar material
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Fluxos pedagógicos</p>
              <h3 className="mt-2 text-xl font-semibold">Checklist de publicação</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Use o protocolo abaixo antes de liberar qualquer curso para o catálogo público.
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">
                <ClipboardList size={16} /> Rubricas atualizadas
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-200 dark:bg-slate-800 px-4 py-2 font-semibold">
                <FileText size={16} /> Materiais revisados
              </span>
            </div>
          </div>
        </section>
      </div>
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
