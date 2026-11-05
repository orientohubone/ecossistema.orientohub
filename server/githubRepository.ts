import type { GithubData } from '../src/types/github.js';

export function parseGithubRepository(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password) return null;
    const parts = url.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length !== 2) return null;
    const [owner, rawRepo] = parts;
    const repo = rawRepo.replace(/\.git$/, '');
    if (!/^[a-z\d][a-z\d-]{0,38}$/i.test(owner) || !/^[a-z\d_.-]+$/i.test(repo) || ['.', '..'].includes(repo)) return null;
    return `${owner}/${repo}`;
  } catch { return null; }
}

export function explicitRepositoryAccess(userId: string, repository: string): boolean {
  const config = process.env.GITHUB_REPOSITORY_ACCESS;
  if (!config) return false;
  const rules = JSON.parse(config) as Record<string, unknown>;
  if (!rules || typeof rules !== 'object' || Array.isArray(rules)) throw new Error('Invalid GitHub access configuration');
  const allowed = rules[userId];
  return Array.isArray(allowed) && allowed.some(value => typeof value === 'string' && value.toLowerCase() === repository.toLowerCase());
}

export class GithubUpstreamError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function githubRequest(repository: string, suffix = '') {
  const token = process.env.GITHUB_TOKEN;
  const result = await fetch(`https://api.github.com/repos/${repository}${suffix}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'OrientoHub-Repository-Insights', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(8000),
  });
  if (result.status === 403 || result.status === 429) {
    if (result.headers.get('x-ratelimit-remaining') === '0' || result.status === 429) throw new GithubUpstreamError(429, 'Limite de consultas ao GitHub atingido. Tente novamente mais tarde.');
    throw new GithubUpstreamError(502, 'A integração não tem permissão para consultar este repositório. Revise o acesso do token no GitHub.');
  }
  if (result.status === 401) throw new GithubUpstreamError(502, 'A credencial da integração GitHub está inválida ou expirada. Atualize o token no servidor.');
  if (result.status === 404) throw new GithubUpstreamError(404, 'Repositório não encontrado ou sem acesso autorizado.');
  if (!result.ok && result.status !== 409) throw new GithubUpstreamError(502, 'O GitHub está indisponível para esta consulta. Tente novamente.');
  return result;
}

const languageColor = (name: string) => ({ TypeScript:'#3178c6', JavaScript:'#f7df1e', React:'#61dafb', HTML:'#e34c26', CSS:'#264de4', Python:'#3776ab', PHP:'#4F5D95', 'C#':'#178600', Java:'#b07219' } as Record<string,string>)[name] || '#888888';
const pagedCount = (response: Response, rows: unknown[]) => {
  const link = response.headers.get('link') || '';
  const last = link.split(',').find(part => /rel="last"/.test(part));
  if (!last) return rows.length;
  const target = last.match(/<([^>]+)>/)?.[1];
  const page = target && Number(new URL(target).searchParams.get('page'));
  return typeof page === 'number' && Number.isSafeInteger(page) && page > 0 ? page : rows.length;
};

export async function repositoryInsights(repository: string, repo: Record<string, any>): Promise<GithubData> {
  const [commitsResponse, languagesResponse, contributorsResponse] = await Promise.all([
    githubRequest(repository, '/commits?per_page=1'), githubRequest(repository, '/languages'), githubRequest(repository, '/contributors?per_page=1&anon=1'),
  ]);
  const commits = commitsResponse.status === 409 ? [] : await commitsResponse.json();
  const contributors = [204,409].includes(contributorsResponse.status) ? [] : await contributorsResponse.json();
  const languages = await languagesResponse.json() as Record<string,number>;
  if (!Array.isArray(commits) || !Array.isArray(contributors) || !languages || typeof languages !== 'object' || Array.isArray(languages)) throw new GithubUpstreamError(502, 'O GitHub retornou dados incompletos. Tente novamente.');
  const entries = Object.entries(languages).filter(([,bytes]) => Number.isFinite(bytes) && bytes >= 0);
  const total = entries.reduce((sum,[,bytes]) => sum+bytes, 0);
  let score = 60;
  if (repo.stargazers_count > 0) score += 5;
  if (repo.forks_count > 0) score += 5;
  if (repo.open_issues_count < 5) score += 10;
  if (repo.pushed_at && Date.now() - Date.parse(repo.pushed_at) < 30*86400000) score += 20;
  return {
    stars: repo.stargazers_count || 0, forks: repo.forks_count || 0,
    commits: pagedCount(commitsResponse, commits), contributors: pagedCount(contributorsResponse, contributors),
    open_issues: repo.open_issues_count || 0, last_commit: commits[0]?.commit?.committer?.date || repo.pushed_at || null,
    health_score: Math.min(score,100), languages: entries.map(([name,bytes]) => ({ name, percentage: total ? Math.round(bytes/total*100) : 0, color: languageColor(name) })),
    overview: { description:repo.description || 'Sem descrição.', license:repo.license?.name || 'Não especificada', default_branch:repo.default_branch || '', size:repo.size || 0, topics:repo.topics || [], created_at:repo.created_at, updated_at:repo.updated_at, homepage:repo.homepage || '', language:repo.language || '' },
  };
}
