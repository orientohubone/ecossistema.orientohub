import { createCipheriv,createDecipheriv,createHash,randomBytes,randomUUID } from 'node:crypto';
import { localDevelopment } from './dashboardAuth.js';

export class GithubAppError extends Error { constructor(public status:number,message:string,public retryAfter?:number){super(message);} }
export interface GithubConnection {user_id:string;generation:string;github_user_id:number;github_login:string;access_ciphertext:string;refresh_ciphertext:string;expires_at:string;refresh_expires_at:string;refresh_lease:string|null;refresh_lease_until:string|null}
export interface GithubBinding {solution_id:string;user_id:string;installation_id:number;repository_id:number;full_name:string;is_private:boolean}
export const uuid=(value:unknown):value is string=>typeof value==='string'&&/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(value);
export const positiveId=(value:unknown)=>Number.isSafeInteger(Number(value))&&Number(value)>0;
export const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
export const oauthCookie=localDevelopment?'orientohub-local-github-oauth':'__Host-orientohub-github-oauth';
export function appConfigured(){
  const origin=localDevelopment?process.env.ORIENTOHUB_LOCAL_ORIGIN:process.env.APP_URL;
  return Boolean(origin)&&['GITHUB_APP_ID','GITHUB_APP_SLUG','GITHUB_APP_CLIENT_ID','GITHUB_APP_CLIENT_SECRET','GITHUB_APP_ENCRYPTION_KEY','GITHUB_APP_WEBHOOK_SECRET','SUPABASE_SERVICE_ROLE_KEY'].every(key=>Boolean(process.env[key]));
}
export function appOrigin(){
  const url=new URL((localDevelopment?process.env.ORIENTOHUB_LOCAL_ORIGIN:process.env.APP_URL)||'');
  if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw new GithubAppError(503,'Conexão GitHub ainda não configurada.');
  return url.origin;
}
export const callbackUrl=()=>`${appOrigin()}/api/github-app?action=callback`;
export function installUrl(){
  const slug=process.env.GITHUB_APP_SLUG||'';
  if(!/^[a-z\d-]+$/i.test(slug))throw new GithubAppError(503,'Conexão GitHub ainda não configurada.');
  return `https://github.com/apps/${slug}/installations/new`;
}
function encryptionKey(){
  const key=process.env.GITHUB_APP_ENCRYPTION_KEY||'';
  if(!/^[a-f\d]{64}$/i.test(key))throw new GithubAppError(503,'Conexão GitHub ainda não configurada.');
  return Buffer.from(key,'hex');
}
export function encryptSecret(value:string,context:string){
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey(),iv);
  cipher.setAAD(Buffer.from(context));
  const encrypted=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);
  return ['v1',iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),encrypted.toString('base64url')].join('.');
}
export function decryptSecret(value:string,context:string){
  const [version,iv,tag,data]=value.split('.');
  if(version!=='v1'||!iv||!tag||!data)throw new GithubAppError(409,'Reconecte sua conta GitHub.');
  const cipher=createDecipheriv('aes-256-gcm',encryptionKey(),Buffer.from(iv,'base64url'));
  cipher.setAAD(Buffer.from(context));cipher.setAuthTag(Buffer.from(tag,'base64url'));
  return Buffer.concat([cipher.update(Buffer.from(data,'base64url')),cipher.final()]).toString('utf8');
}

export async function githubAdmin(path:string,method='GET',body?:unknown,representation=false){
  const base=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!base||!key)throw new GithubAppError(503,'Conexão GitHub ainda não configurada.');
  const result=await fetch(`${base.replace(/\/$/,'')}/rest/v1/${path}`,{method,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:representation?'return=representation':'return=minimal'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!result.ok)throw new GithubAppError(503,'Não foi possível acessar sua conexão GitHub. Tente novamente.');
  return result.status===204?null:await result.json().catch(()=>null);
}
export async function appGithub(path:string,token:string){
  if(!path.startsWith('/')||path.startsWith('//'))throw new Error('Invalid GitHub path');
  const result=await fetch(`https://api.github.com${path}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','User-Agent':'OrientoHub-GitHub-App'},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(result.status===401)throw new GithubAppError(409,'Sua autorização GitHub expirou ou foi revogada. Conecte novamente.');
  if(result.status===429||(result.status===403&&result.headers.get('x-ratelimit-remaining')==='0')){
    const reset=Number(result.headers.get('x-ratelimit-reset'))*1000;
    const seconds=Math.max(1,Math.min(3600,Number(result.headers.get('retry-after'))||(reset>Date.now()?Math.ceil((reset-Date.now())/1000):60)));
    throw new GithubAppError(429,`Limite de consultas ao GitHub atingido. Aguarde cerca de ${Math.ceil(seconds/60)} min para tentar novamente.`,seconds);
  }
  if([403,404].includes(result.status))throw new GithubAppError(403,'Este repositório ou instalação não está mais autorizado. Revise o acesso no GitHub.');
  if(!result.ok)throw new GithubAppError(result.status===429?429:502,'O GitHub não conseguiu concluir a consulta. Tente novamente.');
  return result.json();
}
async function oauthRequest(body:Record<string,string>){
  const result=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:process.env.GITHUB_APP_CLIENT_ID,client_secret:process.env.GITHUB_APP_CLIENT_SECRET,...body}),redirect:'error',cache:'no-store',signal:AbortSignal.timeout(8000)});
  const data=await result.json().catch(()=>null);
  if(!result.ok||data?.error||typeof data?.access_token!=='string'||typeof data?.refresh_token!=='string'||!(data.expires_in>0)||!(data.refresh_token_expires_in>0))throw new GithubAppError(409,'Não foi possível renovar ou concluir a autorização. Conecte novamente e verifique a configuração do aplicativo.');
  return data;
}
export async function exchangeGithubCode(code:string,verifier:string){return oauthRequest({code,code_verifier:verifier,redirect_uri:callbackUrl()});}
export function encryptedTokens(userId:string,data:Record<string,any>){
  return {access_ciphertext:encryptSecret(data.access_token,`github:${userId}:access`),refresh_ciphertext:encryptSecret(data.refresh_token,`github:${userId}:refresh`),expires_at:new Date(Date.now()+Number(data.expires_in)*1000).toISOString(),refresh_expires_at:new Date(Date.now()+Number(data.refresh_token_expires_in)*1000).toISOString()};
}
export async function readConnection(userId:string):Promise<GithubConnection|null>{return (await githubAdmin(`github_app_connections?user_id=eq.${userId}&limit=1`))?.[0]||null;}
export async function readBinding(userId:string,solutionId:string):Promise<GithubBinding|null>{return (await githubAdmin(`github_solution_repositories?user_id=eq.${userId}&solution_id=eq.${solutionId}&limit=1`))?.[0]||null;}
export async function deleteConnection(userId:string,generation?:string){await githubAdmin(`github_app_connections?user_id=eq.${userId}${generation?`&generation=eq.${generation}`:''}`,'DELETE');}

export async function githubUserToken(userId:string):Promise<{token:string;connection:GithubConnection}>{
  for(let attempt=0;attempt<20;attempt++){
    const connection=await readConnection(userId);
    if(!connection)throw new GithubAppError(409,'Conecte sua conta GitHub para acessar este repositório.');
    if(Date.parse(connection.expires_at)>Date.now()+60000)return {token:decryptSecret(connection.access_ciphertext,`github:${userId}:access`),connection};
    if(Date.parse(connection.refresh_expires_at)<=Date.now()){await deleteConnection(userId,connection.generation);throw new GithubAppError(409,'Sua autorização GitHub expirou. Conecte novamente.');}
    const lease=randomUUID();
    const claimed=await githubAdmin('rpc/claim_github_token_refresh','POST',{p_user_id:userId,p_generation:connection.generation,p_lease:lease},true);
    if(!claimed?.length){await new Promise(resolve=>setTimeout(resolve,250));continue;}
    try{
      const data=await oauthRequest({grant_type:'refresh_token',refresh_token:decryptSecret(connection.refresh_ciphertext,`github:${userId}:refresh`)});
      const fields=encryptedTokens(userId,data);
      const saved=await githubAdmin(`github_app_connections?user_id=eq.${userId}&generation=eq.${connection.generation}&refresh_lease=eq.${lease}`,'PATCH',{...fields,refresh_lease:null,refresh_lease_until:null,updated_at:new Date().toISOString()},true);
      if(!saved?.length)throw new GithubAppError(409,'A conexão mudou. Tente novamente.');
      return {token:data.access_token,connection:saved[0]};
    }catch(error){
      await githubAdmin(`github_app_connections?user_id=eq.${userId}&generation=eq.${connection.generation}&refresh_lease=eq.${lease}`,'PATCH',{refresh_lease:null,refresh_lease_until:null}).catch(()=>{});
      throw error;
    }
  }
  throw new GithubAppError(503,'A conexão GitHub está sendo renovada. Tente novamente em instantes.');
}

export async function userInstallations(token:string){
  const all:any[]=[];
  for(let page=1;page<=10;page++){
    const data=await appGithub(`/user/installations?per_page=100&page=${page}`,token);
    if(!Array.isArray(data.installations))throw new GithubAppError(502,'O GitHub retornou uma lista inválida.');
    all.push(...data.installations.filter((item:any)=>String(item.app_id)===process.env.GITHUB_APP_ID&&!item.suspended_at));
    if(data.installations.length<100)return all;
  }
  throw new GithubAppError(400,'Há muitas instalações disponíveis. Revise as autorizações no GitHub.');
}
export async function installationRepositories(token:string,installationId:number,page=1){
  const installations=await userInstallations(token);
  if(!installations.some(item=>item.id===installationId))throw new GithubAppError(403,'Esta instalação não pertence à sua autorização GitHub.');
  const data=await appGithub(`/user/installations/${installationId}/repositories?per_page=100&page=${page}`,token);
  if(!Array.isArray(data.repositories))throw new GithubAppError(502,'O GitHub retornou uma lista inválida.');
  return data;
}
export async function authorizedRepository(token:string,installationId:number,repositoryId:number){
  for(let page=1;page<=20;page++){
    const data=await installationRepositories(token,installationId,page);
    const repo=data.repositories.find((item:any)=>item.id===repositoryId);
    if(repo)return repo;
    if(data.repositories.length<100)break;
  }
  throw new GithubAppError(403,'O repositório não está autorizado para sua conta nesta instalação.');
}
export async function ownSolution(userId:string,solutionId:string){
  if(!uuid(solutionId))throw new GithubAppError(400,'Solução inválida.');
  const rows=await githubAdmin(`solutions?select=id,git_url&user_id=eq.${userId}&id=eq.${solutionId}&limit=1`);
  if(!rows?.length)throw new GithubAppError(404,'Solução não encontrada.');
  return rows[0];
}
