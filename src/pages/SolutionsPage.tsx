// Utilitário para extrair owner/repo de uma URL do GitHub
function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?|#)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

// Função para buscar dados do GitHub (agora inclui overview técnico e issues)
async function fetchGithubData(gitUrl: string) {
  const repo = parseGithubRepo(gitUrl);
  if (!repo) return null;
  const headers = { Accept: 'application/vnd.github.v3+json' };
  try {
    // Dados principais do repositório
    const repoRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, { headers });
    if (!repoRes.ok) return null;
    const repoData = await repoRes.json();

    // Commits
    const commitsRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?per_page=1`, { headers });
    const commits = commitsRes.ok ? parseInt(commitsRes.headers.get('Link')?.match(/&page=(\d+)>; rel="last"/)?.[1] || '1', 10) : 0;

    // Contribuidores
    const contributorsRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/contributors?per_page=1&anon=true`, { headers });
    const contributors = contributorsRes.ok ? parseInt(contributorsRes.headers.get('Link')?.match(/&page=(\d+)>; rel="last"/)?.[1] || '1', 10) : 0;

    // Issues abertas (detalhes)
    const issuesRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/issues?state=open&per_page=10`, { headers });
    const issues = issuesRes.ok ? await issuesRes.json() : [];

    // Linguagens
    const languagesRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/languages`, { headers });
    const languagesData = languagesRes.ok ? await languagesRes.json() : {};
    const total = Object.values(languagesData).reduce((a: any, b: any) => a + b, 0);
    const languages = Object.entries(languagesData).map(([name, value]: any) => ({
      name,
      percentage: total ? Math.round((value as number / total) * 100) : 0,
      color: '#888' // Pode ser melhorado com um mapa de cores
    }));

    // Último commit
    const lastCommitRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?per_page=1`, { headers });
    const lastCommitData = lastCommitRes.ok ? await lastCommitRes.json() : [];
    const lastCommit = lastCommitData[0]?.commit?.committer?.date || null;

    // Score de saúde (exemplo simples)
    const health_score = Math.max(0, Math.min(100, 60 + (repoData.stargazers_count || 0) / 10 - (repoData.open_issues_count || 0)));

    // Overview técnico
    const overview = {
      description: repoData.description,
      license: repoData.license?.name || 'Sem licença',
      default_branch: repoData.default_branch,
      size: repoData.size,
      topics: repoData.topics || [],
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      homepage: repoData.homepage,
      language: repoData.language
    };

    return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      commits,
      contributors,
      open_issues: repoData.open_issues_count || 0,
      last_commit: lastCommit,
      languages,
      health_score: Math.round(health_score),
      overview,
      issues
    };
  } catch {
    return null;
  }
}
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Link as LinkIcon, 
  X,
  Rocket,
  Code,
  GitBranch,
  Database,
  Instagram,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Users,
  Star,
  GitCommit,
  Zap,
  Target,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Brain,
  Settings,
  BarChart2,
  Flame,
  Award,
  MessageSquare,
  Download,
  RefreshCw,
  Play,
  Pause,
  ChevronRight,
  FileCode,
  Bug,
  Layers,
  Package,
  Shield
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../stores/authStore';

interface Solution {
  id: string;
  name: string;
  logo_url: string;
  solution_url: string;
  founder_name: string | null;
  stage: string | null;
  git_url: string | null;
  ide_url: string | null;
  database_url: string | null;
  instagram_url: string | null;
  created_at: string;
  github_data?: {
    stars: number;
    forks: number;
    commits: number;
    contributors: number;
    open_issues: number;
    last_commit: string;
    languages: { name: string; percentage: number; color: string }[];
    health_score: number;
    overview?: {
      description: string;
      license: string;
      default_branch: string;
      size: number;
      topics: string[];
      created_at: string;
      updated_at: string;
      homepage: string;
      language: string;
    };
    issues?: any[];
  };
}

interface GitHubStats {
  totalCommits: number;
  openIssues: number;
  closedIssues: number;
  pullRequests: number;
  codeLines: number;
  contributors: number;
}

const SolutionsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [newSolution, setNewSolution] = useState({
    name: '',
    logo_url: '',
    solution_url: '',
    founder_name: '',
    stage: '',
    git_url: '',
    ide_url: '',
    database_url: '',
    instagram_url: '',
  });

  useEffect(() => {
    fetchSolutions();
  }, [user]);

  const fetchSolutions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar dados reais do GitHub para cada solução que possui git_url
      const solutionsWithGithub = await Promise.all(
        (data || []).map(async (solution) => {
          if (solution.git_url) {
            const github_data = await fetchGithubData(solution.git_url);
            return { ...solution, github_data: github_data || undefined };
          }
          return solution;
        })
      );
      setSolutions(solutionsWithGithub);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Removido: não usar mais dados mockados

  const handleAddSolution = async () => {
    if (!newSolution.name || !newSolution.solution_url) return;

    try {
      setError(null);
      const solution = {
        user_id: user?.id,
        name: newSolution.name,
        logo_url: newSolution.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(newSolution.name)}&background=FFD700&color=000&bold=true`,
        solution_url: newSolution.solution_url,
        founder_name: newSolution.founder_name || null,
        stage: newSolution.stage || null,
        git_url: newSolution.git_url || null,
        ide_url: newSolution.ide_url || null,
        database_url: newSolution.database_url || null,
        instagram_url: newSolution.instagram_url || null,
      };

      const { error } = await supabase
        .from('solutions')
        .insert([solution]);

      if (error) throw error;

      // Se tem Git URL, sincronizar dados
      if (newSolution.git_url) {
        await syncGithubData(newSolution.git_url);
      }

      setNewSolution({ 
        name: '', 
        logo_url: '', 
        solution_url: '',
        founder_name: '',
        stage: '',
        git_url: '',
        ide_url: '',
        database_url: '',
        instagram_url: '',
      });
      setShowAddModal(false);
      fetchSolutions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const syncGithubData = async (gitUrl: string) => {
    setIsSyncing(true);
    // Aqui você faria a chamada real para a API do GitHub
    // const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const handleRemoveSolution = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta solução?')) return;

    try {
      setError(null);
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSolutions();
    } catch (err: any) {
      setError(err.message);
    }
  };


  const handleViewDetails = async (solution: Solution) => {
    // Se houver git_url, buscar dados reais do GitHub
    if (solution.git_url) {
      const githubData = await fetchGithubData(solution.git_url);
      setSelectedSolution({ ...solution, github_data: githubData || undefined });
    } else {
      setSelectedSolution(solution);
    }
    setShowDetailsModal(true);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    return 'Precisa Atenção';
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'Ideação': 'bg-purple-500',
      'Validação': 'bg-blue-500',
      'MVP': 'bg-yellow-500',
      'Tração': 'bg-orange-500',
      'Crescimento': 'bg-green-500',
      'Escala': 'bg-primary-500'
    };
    return colors[stage] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Minhas Soluções - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Minhas Soluções
                    <Sparkles className="w-6 h-6 text-primary-500" />
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitore e gerencie suas startups em desenvolvimento
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchSolutions()}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                Sincronizar
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-500/30"
              >
                <Plus className="w-5 h-5" />
                Nova Solução
              </button>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Erro ao carregar soluções</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {solutions.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-16 h-16 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nenhuma solução cadastrada</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Comece adicionando sua primeira startup e acompanhe seu desenvolvimento em tempo real
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-primary-500/30"
              >
                <Plus className="w-5 h-5" />
                Adicionar Primeira Solução
              </button>
            </motion.div>
          )}

          {/* Overview Stats */}
          {solutions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Total de Soluções', 
                  value: solutions.length, 
                  icon: Rocket,
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-500/10'
                },
                { 
                  label: 'Em Desenvolvimento', 
                  value: solutions.filter(s => ['Ideação', 'Validação', 'MVP'].includes(s.stage || '')).length,
                  icon: Code,
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-500/10'
                },
                { 
                  label: 'Commits Hoje', 
                  value: solutions.reduce((acc, s) => acc + (s.github_data?.commits || 0), 0),
                  icon: GitCommit,
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-500/10'
                },
                { 
                  label: 'Saúde Média', 
                  value: `${Math.round(solutions.reduce((acc, s) => acc + (s.github_data?.health_score || 0), 0) / solutions.length)}%`,
                  icon: Activity,
                  color: 'from-primary-400 to-primary-600',
                  bgColor: 'bg-primary-500/10'
                }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Solutions Grid */}
          {solutions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {solutions.map((solution, index) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  index={index}
                  onViewDetails={() => handleViewDetails(solution)}
                  onRemove={() => handleRemoveSolution(solution.id)}
                  getHealthColor={getHealthColor}
                  getHealthLabel={getHealthLabel}
                  getStageColor={getStageColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Solution Modal */}
      <AddSolutionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        newSolution={newSolution}
        setNewSolution={setNewSolution}
        onSave={handleAddSolution}
        isSyncing={isSyncing}
      />

      {/* Details Modal */}
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          show={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSolution(null);
          }}
          getHealthColor={getHealthColor}
          getHealthLabel={getHealthLabel}
          getStageColor={getStageColor}
        />
      )}
    </>
  );
};

// Solution Card Component
interface SolutionCardProps {
  solution: Solution;
  index: number;
  onViewDetails: () => void;
  onRemove: () => void;
  getHealthColor: (score: number) => string;
  getHealthLabel: (score: number) => string;
  getStageColor: (stage: string) => string;
}

const SolutionCard = ({ 
  solution, 
  index, 
  onViewDetails, 
  onRemove,
  getHealthColor,
  getHealthLabel,
  getStageColor
}: SolutionCardProps) => {
  const hasGithub = !!solution.github_data;
  const healthScore = solution.github_data?.health_score || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={solution.logo_url}
              alt={solution.name}
              className="w-16 h-16 rounded-xl border-4 border-white/20 shadow-xl object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(solution.name)}&background=FFD700&color=000&bold=true`;
              }}
            />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{solution.name}</h3>
              {solution.founder_name && (
                <p className="text-sm text-gray-300">por {solution.founder_name}</p>
              )}
            </div>
          </div>

          {solution.stage && (
            <span className={`${getStageColor(solution.stage)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
              {solution.stage}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* GitHub Stats */}
        {hasGithub && solution.github_data && (
          <>
            {/* Health Score */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <Activity className={`w-5 h-5 ${getHealthColor(healthScore)}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saúde do Projeto</p>
                  <p className={`text-lg font-bold ${getHealthColor(healthScore)}`}>
                    {getHealthLabel(healthScore)} ({healthScore}%)
                  </p>
                </div>
              </div>
              <div className="w-16 h-16">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${healthScore}, 100`}
                    className={getHealthColor(healthScore)}
                  />
                </svg>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Star, label: 'Stars', value: solution.github_data.stars, color: 'text-yellow-500' },
                { icon: GitBranch, label: 'Forks', value: solution.github_data.forks, color: 'text-blue-500' },
                { icon: GitCommit, label: 'Commits', value: solution.github_data.commits, color: 'text-green-500' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Languages */}
            <div>
              <p className="text-sm font-medium mb-2">Linguagens</p>
              <div className="flex gap-2 h-2 rounded-full overflow-hidden">
                {solution.github_data.languages.map((lang, i) => (
                  <div
                    key={i}
                    style={{ 
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color
                    }}
                    title={`${lang.name} (${lang.percentage}%)`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {solution.github_data.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-1"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Issues */}
            {solution.github_data.open_issues > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <Bug className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                    {solution.github_data.open_issues} issue{solution.github_data.open_issues > 1 ? 's' : ''} aberta{solution.github_data.open_issues > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Precisa atenção
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
          
          {solution.solution_url && (
            <a
              href={solution.solution_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          
          <button
            onClick={onRemove}
            className="px-4 py-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Add Solution Modal Component
interface AddSolutionModalProps {
  show: boolean;
  onClose: () => void;
  newSolution: any;
  setNewSolution: (solution: any) => void;
  onSave: () => void;
  isSyncing: boolean;
}

const AddSolutionModal = ({ 
  show, 
  onClose, 
  newSolution, 
  setNewSolution, 
  onSave,
  isSyncing 
}: AddSolutionModalProps) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Nova Solução</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cadastre sua startup e monitore em tempo real
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Solução *</label>
                  <input
                    type="text"
                    value={newSolution.name}
                    onChange={(e) => setNewSolution({ ...newSolution, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                    placeholder="Ex: OrientoHub"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Founder</label>
                  <input
                    type="text"
                    value={newSolution.founder_name}
                    onChange={(e) => setNewSolution({ ...newSolution, founder_name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estágio da Startup</label>
                <select
                  value={newSolution.stage}
                  onChange={(e) => setNewSolution({ ...newSolution, stage: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                >
                  <option value="">Selecione o estágio</option>
                  <option value="Ideação">💡 Ideação</option>
                  <option value="Validação">🎯 Validação</option>
                  <option value="MVP">🚀 MVP</option>
                  <option value="Tração">📈 Tração</option>
                  <option value="Crescimento">🌱 Crescimento</option>
                  <option value="Escala">⚡ Escala</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL do Logo</label>
                <input
                  type="text"
                  value={newSolution.logo_url}
                  onChange={(e) => setNewSolution({ ...newSolution, logo_url: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-500" />
                Links e Integrações
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  URL da Solução *
                </label>
                <input
                  type="url"
                  value={newSolution.solution_url}
                  onChange={(e) => setNewSolution({ ...newSolution, solution_url: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                  placeholder="https://minhasolucao.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  URL do GitHub
                </label>
                <input
                  type="url"
                  value={newSolution.git_url}
                  onChange={(e) => setNewSolution({ ...newSolution, git_url: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                  placeholder="https://github.com/usuario/repo"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sincronizaremos automaticamente dados do repositório
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    URL da IDE
                  </label>
                  <input
                    type="url"
                    value={newSolution.ide_url}
                    onChange={(e) => setNewSolution({ ...newSolution, ide_url: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                    placeholder="https://replit.com/@user/project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    URL do Banco
                  </label>
                  <input
                    type="url"
                    value={newSolution.database_url}
                    onChange={(e) => setNewSolution({ ...newSolution, database_url: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                    placeholder="https://supabase.com/project/xyz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={newSolution.instagram_url}
                  onChange={(e) => setNewSolution({ ...newSolution, instagram_url: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 transition-all"
                  placeholder="https://instagram.com/usuario"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={onSave}
                disabled={!newSolution.name || !newSolution.solution_url || isSyncing}
                className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Adicionar Solução
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Solution Details Modal Component
interface SolutionDetailsModalProps {
  solution: Solution;
  show: boolean;
  onClose: () => void;
  getHealthColor: (score: number) => string;
  getHealthLabel: (score: number) => string;
  getStageColor: (stage: string) => string;
}

const SolutionDetailsModal = ({ 
  solution, 
  show, 
  onClose,
  getHealthColor,
  getHealthLabel,
  getStageColor 
}: SolutionDetailsModalProps) => {
  if (!show) return null;

  const hasGithub = !!solution.github_data;
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'issues'>('overview');
  const githubData = solution.github_data;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="relative h-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={solution.logo_url}
                  alt={solution.name}
                  className="w-20 h-20 rounded-xl border-4 border-white/20 shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(solution.name)}&background=FFD700&color=000&bold=true`;
                  }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{solution.name}</h2>
                  {solution.founder_name && (
                    <p className="text-gray-300">por {solution.founder_name}</p>
                  )}
                  {solution.stage && (
                    <span className={`inline-block mt-2 ${getStageColor(solution.stage)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {solution.stage}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex gap-1 p-2">
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
                { id: 'code', label: 'Código', icon: Code },
                { id: 'issues', label: 'Issues', icon: Bug }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-black'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Links */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Globe, label: 'Site', url: solution.solution_url },
                    { icon: GitBranch, label: 'GitHub', url: solution.git_url },
                    { icon: Code, label: 'IDE', url: solution.ide_url },
                    { icon: Database, label: 'Banco', url: solution.database_url },
                    { icon: Instagram, label: 'Instagram', url: solution.instagram_url }
                  ].filter(link => link.url).map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={i}
                        href={link.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                      >
                        <Icon className="w-5 h-5 text-primary-500" />
                        <span className="font-medium flex-1">{link.label}</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>

                {/* GitHub Stats */}
                {hasGithub && githubData && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: Star, label: 'Stars', value: githubData.stars, color: 'text-yellow-500' },
                        { icon: GitBranch, label: 'Forks', value: githubData.forks, color: 'text-blue-500' },
                        { icon: Users, label: 'Contribuidores', value: githubData.contributors, color: 'text-purple-500' },
                        { icon: GitCommit, label: 'Commits', value: githubData.commits, color: 'text-green-500' },
                        { icon: Bug, label: 'Issues Abertas', value: githubData.open_issues, color: 'text-red-500' },
                        { icon: Activity, label: 'Saúde', value: `${githubData.health_score}%`, color: getHealthColor(githubData.health_score) }
                      ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                            <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                            <p className="text-2xl font-bold mb-1">{stat.value}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-primary-500" />
                        Linguagens
                      </h3>
                      <div className="space-y-3">
                        {githubData.languages.map((lang, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: lang.color }}
                                />
                                <span className="font-medium">{lang.name}</span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {lang.percentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${lang.percentage}%`,
                                  backgroundColor: lang.color
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-6">
                {hasGithub && githubData && githubData.overview ? (
                  <>
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                      <FileCode className="w-5 h-5 text-primary-500" />
                      Overview Técnico
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Descrição</p>
                        <p className="font-medium mb-2">{githubData.overview.description || 'Sem descrição.'}</p>
                        <p className="text-sm text-gray-500 mb-1">Linguagem Principal</p>
                        <p className="font-medium mb-2">{githubData.overview.language || 'N/A'}</p>
                        <p className="text-sm text-gray-500 mb-1">Licença</p>
                        <p className="font-medium mb-2">{githubData.overview.license}</p>
                        <p className="text-sm text-gray-500 mb-1">Branch Padrão</p>
                        <p className="font-medium mb-2">{githubData.overview.default_branch}</p>
                        <p className="text-sm text-gray-500 mb-1">Tamanho</p>
                        <p className="font-medium mb-2">{githubData.overview.size} KB</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Criado em</p>
                        <p className="font-medium mb-2">{new Date(githubData.overview.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mb-1">Atualizado em</p>
                        <p className="font-medium mb-2">{new Date(githubData.overview.updated_at).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mb-1">Homepage</p>
                        <p className="font-medium mb-2">
                          {githubData.overview.homepage ? (
                            <a href={githubData.overview.homepage} target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">{githubData.overview.homepage}</a>
                          ) : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">Tópicos</p>
                        <div className="flex flex-wrap gap-2">
                          {githubData.overview.topics.length > 0 ? githubData.overview.topics.map((topic: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">{topic}</span>
                          )) : <span className="text-xs">Nenhum tópico</span>}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Análise de código não disponível.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'issues' && (
              <div>
                {hasGithub && githubData && githubData.issues && githubData.issues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {githubData.issues.map((issue: any) => (
                      <div key={issue.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Bug className="w-5 h-5 text-red-500" />
                          <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-500 hover:underline flex-1">
                            {issue.title}
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">#{issue.number} aberto por {issue.user?.login}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{issue.body ? issue.body.substring(0, 180) + (issue.body.length > 180 ? '...' : '') : 'Sem descrição.'}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {issue.labels && issue.labels.length > 0 && issue.labels.map((label: any) => (
                            <span key={label.id} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `#${label.color || 'eee'}`, color: '#222' }}>{label.name}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhuma issue aberta encontrada.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SolutionsPage;
