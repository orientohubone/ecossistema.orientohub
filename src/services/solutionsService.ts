import { supabase } from '../config/supabase';

export interface Solution {
  id: string;
  user_id: string;
  name: string;
  logo_url: string;
  solution_url: string;
  founder_name: string | null;
  stage: 'Ideação' | 'Validação' | 'MVP' | 'Tração' | 'Crescimento' | 'Escala';
  git_url: string | null;
  ide_url: string | null;
  database_url: string | null;
  instagram_url: string | null;
  description: string | null;
  category: string | null;
  mrr: number;
  active_users: number;
  created_at: string;
  github_data?: GithubData;
}

export interface GithubData {
  stars: number;
  forks: number;
  commits: number;
  contributors: number;
  open_issues: number;
  last_commit: string | null;
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
  error?: string;
}

// Cache em memória para soluções (banco) e GitHub
const githubCache: Record<string, { data: GithubData; timestamp: number }> = {};
let solutionsCache: Solution[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const solutionsService = {
  async getAll(forceRefresh = false): Promise<Solution[]> {
    // Retorno imediato do cache se disponível e não for refresh forçado
    if (solutionsCache && !forceRefresh) {
      return solutionsCache;
    }

    const { data, error } = await supabase
      .from('solutions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Hidratar o cache
    solutionsCache = data || [];
    return solutionsCache;
  },

  getCachedSolutions(): Solution[] | null {
    return solutionsCache;
  },

  async create(solution: Partial<Solution>): Promise<Solution> {
    const { data, error } = await supabase
      .from('solutions')
      .insert([solution])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Solution>): Promise<Solution> {
    const { data, error } = await supabase
      .from('solutions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Helper para GitHub - Agora com log de debug e cache
  async fetchGithubData(gitUrl: string): Promise<GithubData | null> {
    // 1. Validar URL
    const repoMatch = gitUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?|#)/);
    if (!repoMatch) {
      console.warn('URL do GitHub inválida:', gitUrl);
      return null;
    }

    const owner = repoMatch[1];
    const repo = repoMatch[2];
    const cacheKey = `${owner}/${repo}`;

    // 2. Verificar Cache
    if (githubCache[cacheKey] && Date.now() - githubCache[cacheKey].timestamp < CACHE_DURATION) {
      console.log('GitHub Data recuperado do cache:', cacheKey);
      return githubCache[cacheKey].data;
    }

    console.log(`Iniciando busca real no GitHub para: ${owner}/${repo}...`);
    
    // Usar Token se disponível no .env para aumentar limite de 60 para 5000 req/hora
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const headers: Record<string, string> = { 
      Accept: 'application/vnd.github.v3+json'
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      // Fazemos a chamada principal primeiro para validar acesso e rate limit
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      
      if (repoRes.status === 403) {
        const resetTime = repoRes.headers.get('x-ratelimit-reset');
        console.error('GitHub API: Limite de requisições excedido. Tente novamente após as ' + 
          (resetTime ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString() : 'em breve.'));
        return null;
      }

      if (repoRes.status === 404) {
        console.warn(`GitHub API: Repositório não encontrado ou PRIVADO: ${owner}/${repo}. Verifique se o VITE_GITHUB_TOKEN no .env tem permissão de "repo".`);
        return {
          stars: 0, forks: 0, commits: 0, contributors: 0, open_issues: 0,
          last_commit: null, languages: [], health_score: 0,
          error: 'Privado ou Inexistente'
        };
      }

      if (!repoRes.ok) {
        console.error('GitHub API: Erro ao buscar repositório', repoRes.statusText);
        return null;
      }

      const repoData = await repoRes.json();

      // Buscamos o resto dos dados
      const [commitsRes, languagesRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers })
      ]);

      // Total de commits (via link header)
      const linkHeader = commitsRes.headers.get('Link');
      const totalCommits = linkHeader?.match(/&page=(\d+)>; rel="last"/) ? 
        parseInt(linkHeader.match(/&page=(\d+)>; rel="last"/)![1]) : 1;

      const languagesData = await languagesRes.json();
      const totalByteCount = Object.values(languagesData).reduce((a: any, b: any) => a + b, 0) as number;
      
      const languages = Object.entries(languagesData).map(([name, value]: any) => ({
        name,
        percentage: Math.round((value / totalByteCount) * 100),
        color: this.getLanguageColor(name)
      }));

      const finalData: GithubData = {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        commits: totalCommits,
        contributors: repoData.network_count || 0,
        open_issues: repoData.open_issues_count,
        last_commit: repoData.pushed_at,
        health_score: this.calculateHealthScore(repoData),
        languages,
        overview: {
          description: repoData.description || 'Sem descrição.',
          license: repoData.license?.name || 'Não especificada',
          default_branch: repoData.default_branch,
          size: repoData.size,
          topics: repoData.topics || [],
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
          homepage: repoData.homepage,
          language: repoData.language
        }
      };

      // Guardar no Cache
      githubCache[cacheKey] = { data: finalData, timestamp: Date.now() };
      
      return finalData;
    } catch (e) {
      console.error('Erro inesperado ao conectar com GitHub API:', e);
      return null;
    }
  },

  calculateHealthScore(repoData: any): number {
    let score = 60; // Base menor para ser real
    if (repoData.stargazers_count > 0) score += 5;
    if (repoData.forks_count > 0) score += 5;
    if (repoData.open_issues_count < 5) score += 10;
    if (repoData.pushed_at && (Date.now() - new Date(repoData.pushed_at).getTime() < 30 * 24 * 60 * 60 * 1000)) {
      score += 20; // Bonus por atividade recente (último mês)
    }
    return Math.min(100, score);
  },

  getLanguageColor(lang: string): string {
    const colors: Record<string, string> = {
      'TypeScript': '#3178c6',
      'JavaScript': '#f7df1e',
      'React': '#61dafb',
      'HTML': '#e34c26',
      'CSS': '#264de4',
      'Python': '#3776ab',
      'PHP': '#4F5D95',
      'C#': '#178600',
      'Java': '#b07219'
    };
    return colors[lang] || '#888888';
  }
};
