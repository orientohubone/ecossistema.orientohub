import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Rocket,
  Code,
  GitBranch,
  Database,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Users,
  Star,
  GitCommit,
  Trash2,
  Settings,
  RefreshCw,
  FileCode,
  Bug,
  Layers,
  Target,
  ArrowLeft,
  Shield,
  Zap,
  Package,
  BarChart2,
  Award,
  ExternalLink,
  ChevronRight,
  Pencil
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';
import { solutionsService, Solution } from '../services/solutionsService';

const SolutionsPage = () => {
  const { user } = useAuthStore();
  const [solutions, setSolutions] = useState<Solution[]>(solutionsService.getCachedSolutions() || []);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!solutionsService.getCachedSolutions());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [isSavingSolution, setIsSavingSolution] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    logo_url: '',
    solution_url: '',
    founder_name: '',
    stage: 'Ideação' as Solution['stage'],
    git_url: '',
    ide_url: '',
    database_url: '',
    instagram_url: '',
    description: '',
    category: '',
    mrr: '',
    active_users: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [newSolution, setNewSolution] = useState<Partial<Solution>>({
    name: '',
    logo_url: '',
    solution_url: '',
    stage: 'Ideação',
    git_url: '',
  });

  useEffect(() => {
    fetchSolutions(false); // Silent load no mount (tenta cache primeiro)
  }, [user]);

  const fetchSolutions = async (forceRefresh = false) => {
    try {
      // Só mostra Skeleton se o cache estiver vazio e não houver dados no estado local
      if (solutions.length === 0 && !solutionsService.getCachedSolutions()) {
        setIsLoading(true);
      }
      
      setError(null);
      const data = await solutionsService.getAll(forceRefresh);
      setSolutions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSolution = async () => {
    if (!newSolution.name || !newSolution.solution_url) return;
    try {
      setIsSyncing(true);
      const solutionToCreate = {
        ...newSolution,
        user_id: user?.id,
        logo_url: newSolution.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(newSolution.name)}&background=FFD700&color=000&bold=true`,
      };
      await solutionsService.create(solutionToCreate);
      setShowAddModal(false);
      setNewSolution({ name: '', logo_url: '', solution_url: '', stage: 'Ideação', git_url: '' });
      await fetchSolutions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveSolution = async (id: string) => {
    if (!confirm('Remover esta solução?')) return;
    try {
      await solutionsService.delete(id);
      await fetchSolutions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenEdit = (solution: Solution) => {
    setEditForm({
      name: solution.name || '',
      logo_url: solution.logo_url || '',
      solution_url: solution.solution_url || '',
      founder_name: solution.founder_name || '',
      stage: solution.stage || 'Ideação',
      git_url: solution.git_url || '',
      ide_url: solution.ide_url || '',
      database_url: solution.database_url || '',
      instagram_url: solution.instagram_url || '',
      description: solution.description || '',
      category: solution.category || '',
      mrr: solution.mrr ? String(solution.mrr) : '',
      active_users: solution.active_users ? String(solution.active_users) : '',
    });
    setIsEditingSolution(true);
  };

  const handleSaveSolution = async () => {
    if (!selectedSolution || !editForm.name.trim() || !editForm.solution_url.trim()) return;

    try {
      setIsSavingSolution(true);
      setError(null);
      const updated = await solutionsService.update(selectedSolution.id, {
        name: editForm.name.trim(),
        logo_url: editForm.logo_url.trim(),
        solution_url: editForm.solution_url.trim(),
        founder_name: editForm.founder_name.trim() || null,
        stage: editForm.stage,
        git_url: editForm.git_url.trim() || null,
        ide_url: editForm.ide_url.trim() || null,
        database_url: editForm.database_url.trim() || null,
        instagram_url: editForm.instagram_url.trim() || null,
        description: editForm.description.trim() || null,
        category: editForm.category.trim() || null,
        mrr: Number(editForm.mrr) || 0,
        active_users: Number(editForm.active_users) || 0,
      });

      const updatedSolution = { ...selectedSolution, ...updated, github_data: selectedSolution.github_data };
      setSelectedSolution(updatedSolution);
      setSolutions((currentSolutions) => currentSolutions.map((solution) => (
        solution.id === updatedSolution.id ? updatedSolution : solution
      )));
      setIsEditingSolution(false);
    } catch (err: any) {
      setError(err.message || 'Não foi possível salvar as alterações da solução');
    } finally {
      setIsSavingSolution(false);
    }
  };

  const handleViewDetails = async (solution: Solution) => {
    setSelectedSolution(solution);
    if (solution.git_url && !solution.github_data) {
      try {
        const freshGithub = await solutionsService.fetchGithubData(solution.git_url);
        if (freshGithub) {
          const updated = { ...solution, github_data: freshGithub };
          setSelectedSolution(updated);
          setSolutions(prev => prev.map(s => s.id === solution.id ? updated : s));
        }
      } catch (e) {
        console.warn('Erro Git');
      }
    }
  };

  const updateSolutionGithubData = (id: string, data: any) => {
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, github_data: data } : s));
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Saudável';
    return 'Atenção';
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'Ideação': 'bg-purple-500', 'Validação': 'bg-blue-500', 'MVP': 'bg-yellow-500',
      'Tração': 'bg-orange-500', 'Crescimento': 'bg-green-500', 'Escala': 'bg-primary-500'
    };
    return colors[stage] || 'bg-gray-500';
  };

  if (isLoading && solutions.length === 0) return <DashboardPageSkeleton cards={4} columns={2} />;

  return (
    <>
      <Helmet><title>Minhas Soluções - Orientohub</title></Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {!selectedSolution ? (
          <div
            key="list"
            className="container-custom py-8 space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg"><Rocket className="w-6 h-6 text-black" /></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Minhas Soluções</h1>
                  <p className="text-gray-600 dark:text-gray-400">Ecossistema técnico das suas startups.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => fetchSolutions(true)} disabled={isSyncing} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 transition-all flex items-center gap-2 font-bold text-sm">
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> Sincronizar
                </button>
                <button onClick={() => setShowAddModal(true)} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-500/30">
                  <Plus className="w-5 h-5" /> Nova Solução
                </button>
              </div>
            </div>

            {/* Grid */}
            {solutions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutions.map((solution, index) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    index={index}
                    onViewDetails={() => handleViewDetails(solution)}
                    onUpdateData={(data) => updateSolutionGithubData(solution.id, data)}
                    onRemove={() => handleRemoveSolution(solution.id)}
                    getHealthColor={getHealthColor}
                    getHealthLabel={getHealthLabel}
                    getStageColor={getStageColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Aguardando primeira solução.</p>
              </div>
            )}
          </div>
        ) : (
          <div
            key="details"
            className="container-custom py-6 md:py-8 space-y-6"
          >
            <SolutionDetailsPage
              solution={selectedSolution}
              onBack={() => setSelectedSolution(null)}
              onEdit={() => handleOpenEdit(selectedSolution)}
              onDelete={() => handleRemoveSolution(selectedSolution.id)}
              getHealthColor={getHealthColor}
              getHealthLabel={getHealthLabel}
              getStageColor={getStageColor}
            />
          </div>
        )}
      </div>

      <AddSolutionModal show={showAddModal} onClose={() => setShowAddModal(false)} newSolution={newSolution} setNewSolution={setNewSolution} onSave={handleAddSolution} isSyncing={isSyncing} />
      <EditSolutionModal
        show={isEditingSolution}
        solution={selectedSolution}
        editForm={editForm}
        setEditForm={setEditForm}
        isSaving={isSavingSolution}
        onClose={() => setIsEditingSolution(false)}
        onSave={handleSaveSolution}
      />
    </>
  );
};

// --- COMPONENTES AUXILIARES ---

const SolutionLogo = ({ solution, large = false }: { solution: any; large?: boolean }) => {
  const [imageError, setImageError] = useState(false);
  const isGeneratedAvatar = solution.logo_url?.includes('ui-avatars.com');
  const showFallback = !solution.logo_url || isGeneratedAvatar || imageError;

  return (
    <div className={`${large ? 'w-full h-full rounded-2xl' : 'w-full h-full rounded-xl'} flex items-center justify-center ${showFallback ? 'bg-gradient-to-br from-primary-400 to-primary-600' : 'bg-white dark:bg-gray-900'}`}>
      {showFallback ? (
        <Rocket className={`${large ? 'w-9 h-9' : 'w-7 h-7'} text-black`} strokeWidth={1.8} />
      ) : (
        <img src={solution.logo_url} alt={solution.name} onError={() => setImageError(true)} className="w-full h-full object-contain p-1" />
      )}
    </div>
  );
};

const SolutionCard = memo(({ solution, index, onViewDetails, onUpdateData, onRemove, getHealthColor, getHealthLabel, getStageColor }: any) => {
  const [isFetching, setIsFetching] = useState(false);
  const healthScore = solution.github_data?.health_score || 0;
  const hasGithub = Boolean(solution.github_data && !solution.github_data.error);

  useEffect(() => {
    if (solution.git_url && !solution.github_data && !isFetching) {
      const load = async () => {
        setIsFetching(true);
        try {
          const data = await solutionsService.fetchGithubData(solution.git_url!);
          if (data) onUpdateData(data);
        } catch (e) { console.error(e); } finally { setIsFetching(false); }
      };
      load();
    }
  }, [solution.git_url, solution.github_data]);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group relative bg-white dark:bg-gray-800 rounded-[1.75rem] border border-gray-200/80 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/70 hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="relative p-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-primary-950/30 border-b border-gray-100 dark:border-gray-700">
        <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-primary-500/10 blur-2xl group-hover:bg-primary-500/20 transition-colors" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-2xl p-2.5 shadow-md border border-gray-100 dark:border-gray-700 flex-shrink-0 group-hover:scale-105 transition-transform">
            <SolutionLogo solution={solution} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-black mb-1">Solução</p>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{solution.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${getStageColor(solution.stage)}`}>{solution.stage}</span>
              {solution.category && <span className="text-[10px] font-bold text-gray-500 truncate">{solution.category}</span>}
            </div>
          </div>
        </div>
        <button onClick={onRemove} aria-label={`Remover ${solution.name}`} className="relative p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
        <p className="relative mt-5 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-10 leading-relaxed">{solution.description || solution.github_data?.overview?.description || 'Solução em desenvolvimento no ecossistema Orientohub.'}</p>
      </div>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasGithub ? 'bg-green-500/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Activity className={`w-5 h-5 ${solution.github_data?.error ? 'text-red-500' : hasGithub ? getHealthColor(healthScore) : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-black">Saúde técnica</p>
              <p className={`text-sm font-bold ${solution.github_data?.error ? 'text-red-500' : hasGithub ? getHealthColor(healthScore) : 'text-gray-400'}`}>
                {solution.github_data ? (solution.github_data.error || `${healthScore}% · ${getHealthLabel(healthScore)}`) : 'Sincronizando dados...'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Star, value: solution.github_data?.stars || 0, label: 'Stars', color: 'text-yellow-500' },
            { icon: GitCommit, value: solution.github_data?.commits || 0, label: 'Commits', color: 'text-primary-500' },
            { icon: Users, value: solution.github_data?.contributors || 0, label: 'Pessoas', color: 'text-blue-500' }
          ].map(({ icon: Icon, value, label, color }) => <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-700 text-center"><Icon className={`w-4 h-4 ${color} mx-auto mb-1`} /><p className="text-base font-black">{value}</p><p className="text-[9px] text-gray-400 uppercase font-bold">{label}</p></div>)}
        </div>
        <button onClick={onViewDetails} className="w-full py-3 bg-gray-900 dark:bg-primary-500 hover:bg-primary-500 dark:hover:bg-primary-400 text-white dark:text-black text-xs font-black tracking-widest rounded-xl active:scale-[.98] transition-all flex items-center justify-center gap-2">EXPLORAR SOLUÇÃO <ChevronRight className="w-4 h-4" /></button>
      </div>
    </motion.div>
  );
}, (prev, next) => {
  return prev.solution.id === next.solution.id && 
         prev.solution.github_data === next.solution.github_data;
});

// COMPONENTE DE TELA DEDICADA - PADRAO PROJECTSPAGE
const SolutionDetailsPage = memo(({ solution, onBack, onEdit, onDelete, getHealthColor, getHealthLabel, getStageColor }: any) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'growth'>('overview');
  const github = solution.github_data;

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Actions */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para soluções
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 text-primary-700 dark:text-primary-300 transition-all text-xs font-bold">
            <Pencil className="w-4 h-4" /> Editar solução
          </button>
          <button onClick={onDelete} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-600 transition-all text-xs font-bold">
            <Trash2 className="w-4 h-4" /> Excluir solução
          </button>
        </div>
      </div>

      {/* Main Card Contento */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] w-full min-h-[calc(100vh-12rem)] overflow-hidden border border-gray-200/80 dark:border-gray-700 flex flex-col shadow-xl shadow-gray-200/40 dark:shadow-black/20">
        {/* Header Interno Estilo ProjectsPage */}
        <div className="relative min-h-[140px] bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden border-b-2 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 opacity-40">
            <div className={`absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl`} />
          </div>

          <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0 border-2 border-white dark:border-gray-700 p-3">
              <SolutionLogo solution={solution} large />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white line-clamp-1">{solution.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold text-white ${getStageColor(solution.stage)}`}>{solution.stage}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-4xl text-sm leading-relaxed">{solution.description || github?.overview?.description || 'Repositório monitorado com integração de métricas em tempo real.'}</p>
              
              {github?.error && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg text-[10px] font-bold uppercase">
                  <AlertTriangle className="w-3 h-3" /> {github.error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <a href={solution.solution_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-primary-500 text-white dark:text-black rounded-xl text-xs font-bold hover:bg-primary-500 dark:hover:bg-primary-400 transition-all">
                  <Globe className="w-3.5 h-3.5" /> Site Oficial
                </a>
                {solution.git_url && (
                  <a href={solution.git_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold hover:border-primary-500 transition-all">
                    <GitBranch className="w-3.5 h-3.5" /> Repositório
                  </a>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[220px]">
              <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-white/80 dark:border-gray-700 p-4"><p className="text-[10px] text-gray-400 uppercase font-black">Usuários ativos</p><p className="text-xl font-black mt-1">{solution.active_users || 0}</p></div>
              <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-white/80 dark:border-gray-700 p-4"><p className="text-[10px] text-gray-400 uppercase font-black">MRR</p><p className="text-xl font-black mt-1">{solution.mrr ? `R$ ${Number(solution.mrr).toLocaleString('pt-BR')}` : '—'}</p></div>
            </div>
          </div>
        </div>

        {/* Tabs Estilo Pílula - PADRAO PROJETOS */}
        <div className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
          <div className="flex gap-2 p-3 overflow-x-auto">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
              { id: 'tech', label: 'Stack & Ops', icon: Layers },
              { id: 'growth', label: 'Market & Growth', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area - Persistência via CSS (Evita re-render ao mudar aba) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* ABA: VISÃO GERAL */}
          <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Stars', value: github?.stars || 0, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Commits', value: github?.commits || 0, icon: GitCommit, color: 'text-primary-500', bg: 'bg-primary-500/10' },
                    { label: 'Contributors', value: github?.contributors || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Open Issues', value: github?.open_issues || 0, icon: Bug, color: 'text-red-500', bg: 'bg-red-500/10' },
                    { label: 'Usuários Ativos', value: solution.active_users || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: 'MRR', value: solution.mrr ? `R$ ${Number(solution.mrr).toLocaleString('pt-BR')}` : '—', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' }
                  ].map((s, i) => (
                    <div key={i} className={`p-5 ${s.bg} rounded-2xl border border-gray-100 dark:border-gray-700 text-center`}>
                      <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-4 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-sm mb-1 uppercase tracking-tight text-gray-500">Saúde Técnica</h3>
                      <p className={`text-2xl font-bold ${getHealthColor(github?.health_score || 0)}`}>
                        {getHealthLabel(github?.health_score || 0)} ({github?.health_score || 0}%)
                      </p>
                    </div>
                    <div className="w-16 h-16 flex-shrink-0">
                      <svg className="transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-700" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${github?.health_score || 0}, 100`} className={getHealthColor(github?.health_score || 0)} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <h4 className="font-bold flex items-center gap-2"><Rocket className="w-5 h-5 text-primary-500" /> Sobre a solução</h4>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-black uppercase">{solution.stage}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                    {solution.description || github?.overview?.description || 'Ainda não há uma descrição cadastrada para esta solução.'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/70"><p className="text-[10px] text-gray-400 uppercase font-black">Categoria</p><p className="text-sm font-bold mt-1">{solution.category || 'Não definida'}</p></div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/70"><p className="text-[10px] text-gray-400 uppercase font-black">Responsável</p><p className="text-sm font-bold mt-1">{solution.founder_name || 'Não informado'}</p></div>
                  </div>
                </div>

                <div className="lg:col-span-2 p-6 bg-gray-900 text-white rounded-2xl border border-gray-800 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary-500/20 blur-2xl" />
                  <h4 className="relative font-bold flex items-center gap-2 mb-5"><GitBranch className="w-5 h-5 text-primary-500" /> Repositório</h4>
                  <div className="relative space-y-3">
                    {[
                      { label: 'Branch principal', value: github?.overview?.default_branch || '—' },
                      { label: 'Licença', value: github?.overview?.license || 'Não especificada' },
                      { label: 'Forks', value: github?.forks || 0 },
                      { label: 'Último push', value: github?.last_commit ? new Date(github.last_commit).toLocaleDateString('pt-BR') : '—' }
                    ].map((item) => <div key={item.label} className="flex items-center justify-between gap-3 text-xs"><span className="text-gray-400">{item.label}</span><span className="font-bold text-right truncate">{item.value}</span></div>)}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-primary-500/10 via-white to-blue-500/10 dark:from-primary-500/10 dark:via-gray-900 dark:to-blue-500/10 border border-primary-500/20 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold flex items-center gap-2"><Target className="w-5 h-5 text-primary-500" /> Contexto e classificação</h4>
                    <p className="text-xs text-gray-500 mt-1">Tópicos associados ao repositório para facilitar a leitura do posicionamento técnico.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {github?.overview?.topics?.length ? github.overview.topics.map((topic: string) => <span key={topic} className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">#{topic}</span>) : <span className="text-xs text-gray-400">Nenhum tópico cadastrado</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl space-y-4">
                  <h4 className="font-bold flex items-center gap-2"><Code className="w-5 h-5 text-blue-500" /> Detalhes do Ambiente</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Engine Principal', value: github?.overview?.language || 'Microservices', icon: FileCode },
                      { label: 'Tamanho Repo', value: `${((github?.overview?.size || 0) / 1024).toFixed(1)} MB`, icon: Database },
                      { label: 'Última Atividade', value: github?.overview?.updated_at ? new Date(github.overview.updated_at).toLocaleDateString() : '---', icon: Clock }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <span className="text-xs font-bold text-gray-500 uppercase">{item.label}</span>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-900 text-white rounded-2xl border-2 border-white/5 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[80px] opacity-20" />
                  <h4 className="font-bold flex items-center gap-2 mb-6 relative z-10"><Target className="w-5 h-5 text-primary-500" /> Stack Breakdown</h4>
                  <div className="space-y-6 relative z-10">
                    {github?.languages?.length ? github.languages.map((lang: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest text-gray-400">
                          <span>{lang.name}</span>
                          <span className="text-primary-500">{lang.percentage}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${lang.percentage}%` }} className="h-full rounded-full" style={{ backgroundColor: lang.color }} />
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-400">Conecte um repositório público para visualizar a composição da stack.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABA: STACK & OPS */}
          <div className={activeTab === 'tech' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Core Tech', value: github?.overview?.language || 'Multi-stack', icon: Code, desc: 'Motor principal de execução do sistema.' },
                { title: 'Persistência', value: 'Database / Storage', icon: Database, desc: 'Camada de dados estruturados e arquivos.' },
                { title: 'Segurança', value: 'RLS / Auth Guard', icon: Shield, desc: 'Políticas de proteção e acesso resiliente.' },
                { title: 'Conectividade', value: 'Live Repository', icon: GitBranch, desc: 'Sincronização em tempo real com o código.' },
                { title: 'Qualidade', value: getHealthLabel(github?.health_score || 0), icon: Activity, desc: 'Índice de robustez e manutenção técnica.' },
                { title: 'Módulos', value: `${github?.languages?.length || 0} Pacotes`, icon: Package, desc: 'Diversidade de bibliotecas e ferramentas.' }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:border-blue-500 transition-all group">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><item.icon className="w-5 h-5 text-blue-500" /></div>
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase text-xs mb-1">{item.title}</h4>
                  <p className="text-primary-500 font-bold mb-3">{item.value}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ABA: MARKET & GROWTH */}
          <div className={activeTab === 'growth' ? 'block' : 'hidden'}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-3xl text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                  <p className="text-3xl font-bold">---</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-2">Audiência Ativa</p>
                </div>
                <div className="p-8 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-3xl text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-4" />
                  <p className="text-3xl font-bold">---</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-2">Receita (MRR)</p>
                </div>
                <div className="p-8 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-3xl text-center">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                  <p className="text-3xl font-bold">N/A</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-2">Valuation</p>
                </div>
              </div>
              <div className="p-10 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Growth Dashboard Integrado</h4>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">Prepare sua solução para escala. Sincronização com pagamentos e Google Analytics chegando em breve para automatizar seus resultados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  return prev.solution.id === next.solution.id && 
         prev.solution.github_data === next.solution.github_data;
});

interface SolutionEditForm {
  name: string;
  logo_url: string;
  solution_url: string;
  founder_name: string;
  stage: Solution['stage'];
  git_url: string;
  ide_url: string;
  database_url: string;
  instagram_url: string;
  description: string;
  category: string;
  mrr: string;
  active_users: string;
}

interface EditSolutionModalProps {
  show: boolean;
  solution: Solution | null;
  editForm: SolutionEditForm;
  setEditForm: (form: SolutionEditForm) => void;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditSolutionModal = ({ show, solution, editForm, setEditForm, isSaving, onClose, onSave }: EditSolutionModalProps) => {
  if (!show || !solution) return null;

  const inputClass = 'w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white';
  const updateField = <K extends keyof SolutionEditForm>(field: K, value: SolutionEditForm[K]) => {
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border-2 border-gray-200 bg-white shadow-3xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-gray-100 bg-white/95 px-6 py-5 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10">
              <Pencil className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar solução</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Atualize os dados editoriais e operacionais.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Fechar edição">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Identidade e posicionamento</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Nome da solução <span className="text-red-500">*</span>
                <input className={inputClass} value={editForm.name} onChange={(event) => updateField('name', event.target.value)} required />
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Categoria
                <input className={inputClass} value={editForm.category} onChange={(event) => updateField('category', event.target.value)} placeholder="Ex.: SaaS, IA, Fintech" />
              </label>
            </div>
            <label className="block space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              Descrição
              <textarea className={`${inputClass} resize-y`} rows={4} value={editForm.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Descreva a solução e o valor que ela entrega." />
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Estágio
                <select className={inputClass} value={editForm.stage} onChange={(event) => updateField('stage', event.target.value as Solution['stage'])}>
                  <option value="Ideação">Ideação</option>
                  <option value="Validação">Validação</option>
                  <option value="MVP">MVP</option>
                  <option value="Tração">Tração</option>
                  <option value="Crescimento">Crescimento</option>
                  <option value="Escala">Escala</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Responsável
                <input className={inputClass} value={editForm.founder_name} onChange={(event) => updateField('founder_name', event.target.value)} placeholder="Nome do responsável" />
              </label>
            </div>
          </section>

          <section className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Links e infraestrutura</h3>
            <label className="block space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              URL do produto <span className="text-red-500">*</span>
              <input type="url" className={inputClass} value={editForm.solution_url} onChange={(event) => updateField('solution_url', event.target.value)} required placeholder="https://app.exemplo.com" />
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Logo URL
                <input type="url" className={inputClass} value={editForm.logo_url} onChange={(event) => updateField('logo_url', event.target.value)} placeholder="https://.../logo.png" />
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Repositório GitHub
                <input type="url" className={inputClass} value={editForm.git_url} onChange={(event) => updateField('git_url', event.target.value)} placeholder="https://github.com/..." />
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                IDE / ambiente
                <input type="url" className={inputClass} value={editForm.ide_url} onChange={(event) => updateField('ide_url', event.target.value)} placeholder="URL do ambiente de desenvolvimento" />
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Banco de dados
                <input type="url" className={inputClass} value={editForm.database_url} onChange={(event) => updateField('database_url', event.target.value)} placeholder="URL do banco ou console" />
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300 md:col-span-2">
                Instagram
                <input type="url" className={inputClass} value={editForm.instagram_url} onChange={(event) => updateField('instagram_url', event.target.value)} placeholder="https://instagram.com/..." />
              </label>
            </div>
          </section>

          <section className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Indicadores comerciais</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Usuários ativos
                <input type="number" min="0" className={inputClass} value={editForm.active_users} onChange={(event) => updateField('active_users', event.target.value)} placeholder="0" />
              </label>
              <label className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                MRR (R$)
                <input type="number" min="0" step="0.01" className={inputClass} value={editForm.mrr} onChange={(event) => updateField('mrr', event.target.value)} placeholder="0" />
              </label>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 border-t-2 border-gray-100 bg-gray-50 px-6 py-5 dark:border-gray-700 dark:bg-gray-800 md:px-8">
          <button onClick={onClose} disabled={isSaving} className="rounded-xl px-5 py-2.5 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">Cancelar</button>
          <button onClick={onSave} disabled={isSaving || !editForm.name.trim() || !editForm.solution_url.trim()} className="rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AddSolutionModal = ({ show, onClose, newSolution, setNewSolution, onSave, isSyncing }: any) => {
  if (!show) return null;
  const inputClass = "w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-primary-500 outline-none transition-all font-bold text-sm";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-3xl">
        <div className="p-10 border-b-2 border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20"><Rocket className="w-6 h-6 text-primary-500" /></div>
            <h2 className="text-2xl font-bold tracking-tight">Integrar Solução</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all font-bold"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-10 space-y-6">
          <input className={inputClass} value={newSolution.name} onChange={e => setNewSolution({ ...newSolution, name: e.target.value })} placeholder="Nome da Solução" />
          <input className={inputClass} value={newSolution.git_url} onChange={e => setNewSolution({ ...newSolution, git_url: e.target.value })} placeholder="URL Pública do GitHub" />
          <input className={inputClass} value={newSolution.solution_url} onChange={e => setNewSolution({ ...newSolution, solution_url: e.target.value })} placeholder="URL do Produto (Ex: https://app.meu.link)" />
        </div>
        <div className="p-10 bg-gray-50 dark:bg-gray-800 flex justify-end gap-6 border-t-2 border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="font-bold text-gray-500 text-sm uppercase tracking-widest">Cancelar</button>
          <button onClick={onSave} disabled={isSyncing} className="px-10 py-3.5 bg-primary-500 text-black font-bold rounded-2xl shadow-xl transition-all shadow-primary-500/30 active:scale-95">CONFIRMAR</button>
        </div>
      </motion.div>
    </div>
  );
};

export default SolutionsPage;
