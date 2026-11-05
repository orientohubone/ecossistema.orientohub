import type { VercelRequest, VercelResponse } from '@vercel/node';
import { privateHeaders, verifyUser } from '../server/dashboardAuth.js';
import { GithubUpstreamError, githubRequest, parseGithubRepository, repositoryInsights } from '../server/githubRepository.js';
import { appConfigured,authorizedRepository,GithubAppError,githubUserToken,readBinding,readConnection } from '../server/githubApp.js';
import type { GithubData } from '../src/types/github.js';

export const maxDuration = 30;
const cache = new Map<string, { expires: number; data: GithubData }>();

export default async function handler(request: VercelRequest, response: VercelResponse) {
  for (const [key,value] of Object.entries(privateHeaders)) response.setHeader(key,value);
  if (request.method !== 'GET') return response.status(405).json({ message: 'Método não permitido.' });
  const token = request.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return response.status(401).json({ message: 'Faça login para consultar o repositório.' });
  const solutionId = request.query.solutionId;
  if (typeof solutionId !== 'string' || !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(solutionId)) return response.status(400).json({ message: 'Identificador de solução inválido.' });
  try {
    const user = await verifyUser(token);
    if (!user) return response.status(401).json({ message: 'Sessão inválida ou expirada.' });
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const query = new URLSearchParams({ select:'id,git_url', id:`eq.${solutionId}`, user_id:`eq.${user.id}`, limit:'1' });
    // Caller JWT + RLS + owner filter. Never use a service-role key for this read.
    const result = await fetch(`${url}/rest/v1/solutions?${query}`, {
      headers:{ apikey:key!, Authorization:`Bearer ${token}` }, cache:'no-store', signal:AbortSignal.timeout(8000),
    });
    if ([401,403].includes(result.status)) return response.status(403).json({ message:'Você não tem acesso a esta solução.' });
    if (!result.ok) throw new Error('Solution lookup unavailable');
    const rows = await result.json();
    if (!Array.isArray(rows) || !rows.length) return response.status(404).json({ message:'Solução não encontrada.' });
    let repository = parseGithubRepository(rows[0].git_url || '');
    if (!repository) return response.status(400).json({ message:'Cadastre uma URL de repositório GitHub válida nesta solução.' });
    const binding=appConfigured()?await readBinding(user.id,solutionId):null;
    let githubToken:string|undefined,generation='public',repo:any;
    if(binding){
      const connection=await githubUserToken(user.id);
      // Revalidate membership and repository selection before using any cache.
      repo=await authorizedRepository(connection.token,binding.installation_id,binding.repository_id);
      repository=parseGithubRepository(`https://github.com/${repo.full_name}`);
      if(!repository)throw new GithubAppError(502,'O GitHub retornou um repositório inválido.');
      githubToken=connection.token;generation=connection.connection.generation;
    }else if(appConfigured()&&await readConnection(user.id)){
      // Public repositories also use the user's quota. Private reads still require a binding below.
      const connection=await githubUserToken(user.id);
      githubToken=connection.token;generation=`unbound:${connection.connection.generation}`;
    }
    const cacheKey = `${user.id}:${solutionId}:${repository.toLowerCase()}:${generation}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return response.status(200).json(cached.data);
    if(!repo){const repoResponse=await githubRequest(repository,'',githubToken);repo=await repoResponse.json();}
    if (typeof repo?.private !== 'boolean') throw new Error('Invalid GitHub repository response');
    if ((repo.private || (repo.visibility && repo.visibility !== 'public')) && !binding) return response.status(404).json({ message:'Conecte sua conta GitHub e autorize este repositório na solução.' });
    const data = await repositoryInsights(repository,repo,githubToken);
    if (cache.size >= 200) cache.delete(cache.keys().next().value!);
    cache.set(cacheKey,{ expires:Date.now()+60000, data });
    return response.status(200).json(data);
  } catch (error) {
    if (error instanceof GithubUpstreamError||error instanceof GithubAppError) {
      if(error.retryAfter)response.setHeader('Retry-After',String(error.retryAfter));
      return response.status(error.status).json({ message:error.message });
    }
    return response.status(503).json({ message:'Integração GitHub temporariamente indisponível. Tente novamente.' });
  }
}
