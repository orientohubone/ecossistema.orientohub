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

import type { GithubData } from '../types/github';
export type { GithubData } from '../types/github';

// Cache em memória para soluções (banco) e GitHub
const githubCache: Record<string, { data: GithubData; timestamp: number }> = {};
const githubPending = new Map<string,Promise<GithubData|null>>();
const githubCooldown = new Map<string,{until:number;data:GithubData}>();
let githubActive=0;
const githubQueue:Array<()=>void>=[];
async function githubSlot(){
  if(githubActive>=2)await new Promise<void>(resolve=>githubQueue.push(resolve));
  else githubActive++;
  return ()=>{const next=githubQueue.shift();if(next)next();else githubActive--;};
}
let solutionsCache: { userId: string; data: Solution[] } | null = null;
let authRevision = 0;
let currentUserId: string | null = null;
supabase.auth.onAuthStateChange((_event, session) => {
  const next = session?.user.id || null;
  if (next !== currentUserId) {
    currentUserId = next; authRevision++; solutionsCache = null;
    for (const key of Object.keys(githubCache)) delete githubCache[key];
  }
});
const authenticatedOwner = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Faça login para gerenciar suas soluções.');
  return data.user.id;
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const solutionsService = {
  clearGithubCache() { for (const key of Object.keys(githubCache)) delete githubCache[key];githubCooldown.clear(); },
  async getAll(forceRefresh = false): Promise<Solution[]> {
    // Retorno imediato do cache se disponível e não for refresh forçado
    const userId = await authenticatedOwner();
    const revision = authRevision;
    if (solutionsCache?.userId === userId && !forceRefresh) {
      return solutionsCache.data;
    }

    const { data, error } = await supabase
      .from('solutions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Hidratar o cache
    if (revision !== authRevision) throw new Error('A sessão mudou. Atualize a tela.');
    solutionsCache = { userId, data: data || [] };
    return solutionsCache.data;
  },

  getCachedSolutions(userId?: string): Solution[] | null {
    return userId && solutionsCache?.userId === userId ? solutionsCache.data : null;
  },

  async create(solution: Partial<Solution>): Promise<Solution> {
    const userId = await authenticatedOwner();
    const revision = authRevision;
    const { data, error } = await supabase
      .from('solutions')
      .insert([{ ...solution, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    if (revision !== authRevision) throw new Error('A sessão mudou. Atualize a tela.');
    if (solutionsCache?.userId === userId) {
      solutionsCache.data = [data, ...solutionsCache.data];
    }
    return data;
  },

  async update(id: string, updates: Partial<Solution>): Promise<Solution> {
    const userId = await authenticatedOwner();
    const revision = authRevision;
    const safeUpdates = { ...updates };
    delete safeUpdates.user_id; delete safeUpdates.id;
    const { data, error } = await supabase
      .from('solutions')
      .update(safeUpdates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (revision !== authRevision) throw new Error('A sessão mudou. Atualize a tela.');
    if (solutionsCache?.userId === userId) {
      solutionsCache.data = solutionsCache.data.map((solution) => solution.id === id ? data : solution);
    }
    return data;
  },

  async delete(id: string): Promise<void> {
    const userId = await authenticatedOwner();
    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    if (solutionsCache?.userId === userId) solutionsCache.data = solutionsCache.data.filter(solution => solution.id !== id);
  },

  async fetchGithubData(solution: Pick<Solution, 'id' | 'git_url'>, forceRefresh = false): Promise<GithubData | null> {
    if(!solution.git_url)return null;
    const owner=await authenticatedOwner();
    const revision=authRevision;
    const key=`${owner}:${revision}:${solution.id}:${solution.git_url}`;
    const existing=githubPending.get(key);
    if(existing)return existing;
    const task=(async()=>{
      const release=await githubSlot();
      try{
        if(revision!==authRevision)throw new Error('A sessão mudou. Atualize a tela.');
        const cooldown=githubCooldown.get(owner);
        if(cooldown&&cooldown.until>Date.now())return cooldown.data;
        return await solutionsService.fetchGithubDataRequest(solution,forceRefresh);
      }finally{release();}
    })();
    githubPending.set(key,task);
    try{return await task;}finally{if(githubPending.get(key)===task)githubPending.delete(key);}
  },

  async fetchGithubDataRequest(solution: Pick<Solution, 'id' | 'git_url'>, forceRefresh = false): Promise<GithubData | null> {
    if (!solution.git_url) return null;
    const failed = (message: string): GithubData => ({ stars:0, forks:0, commits:0, contributors:0, open_issues:0, last_commit:null, health_score:0, languages:[], error:message });
    const userId = await authenticatedOwner();
    const revision = authRevision;
    const cacheKey = `${userId}:${solution.id}:${solution.git_url}`;
    const cached = githubCache[cacheKey];
    if (!forceRefresh && cached && Date.now()-cached.timestamp < CACHE_DURATION) return cached.data;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== userId) throw new Error('Sessão inválida. Entre novamente.');
      const result = await fetch(`/api/github-repository?solutionId=${encodeURIComponent(solution.id)}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }, cache:'no-store', signal:AbortSignal.timeout(30000),
      });
      const body = result.headers.get('content-type')?.includes('application/json') ? await result.json() : null;
      if (revision !== authRevision) throw new Error('A sessão mudou. Atualize a tela.');
      if (!result.ok) {
        const data=failed(body?.message || 'Não foi possível consultar a integração GitHub.');
        if(result.status===429){
          const seconds=Math.max(1,Math.min(3600,Number(result.headers.get('retry-after'))||60));
          githubCooldown.set(userId,{until:Date.now()+seconds*1000,data});
        }
        return data;
      }
      if (!body || !Array.isArray(body.languages)) return failed('A API GitHub não está disponível neste ambiente.');
      githubCache[cacheKey] = { data:body, timestamp:Date.now() };
      return body as GithubData;
    } catch {
      if (revision !== authRevision) throw new Error('A sessão mudou. Atualize a tela.');
      return failed('Integração GitHub temporariamente indisponível. Tente sincronizar novamente.');
    }
  },
};
