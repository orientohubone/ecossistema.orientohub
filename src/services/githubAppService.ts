import { supabase } from '../config/supabase';
export interface GithubConnectionStatus {configured:boolean;connected:boolean;login?:string|null;manageUrl?:string;binding?:{installationId:number;repositoryId:number;fullName:string;isPrivate:boolean}|null}
export interface GithubInstallation {id:number;account:string;selection:string}
export interface GithubRepositoryOption {id:number;fullName:string;isPrivate:boolean}
export class GithubConnectionError extends Error {constructor(public status:number,message:string){super(message);}}
async function request(action:string,method='GET',body?:unknown,query?:Record<string,string>){
  const {data:{session}}=await supabase.auth.getSession();
  if(!session)throw new GithubConnectionError(401,'Entre novamente para gerenciar a conexão GitHub.');
  const params=new URLSearchParams({action,...query});
  const result=await fetch(`/api/github-app?${params}`,{method,headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  const data=result.headers.get('content-type')?.includes('application/json')?await result.json():null;
  if(!result.ok||!data)throw new GithubConnectionError(result.status,data?.message||'Não foi possível acessar a conexão GitHub.');
  return data;
}
export const githubAppService={
  status:(solutionId?:string):Promise<GithubConnectionStatus>=>request('status','GET',undefined,solutionId?{solutionId}:undefined),
  start:(solutionId?:string):Promise<{url:string}>=>request('start','POST',{solutionId}),
  installations:():Promise<{installations:GithubInstallation[]}>=>request('installations'),
  repositories:(installationId:number,page:number):Promise<{total:number;repositories:GithubRepositoryOption[]}>=>request('repositories','GET',undefined,{installationId:String(installationId),page:String(page)}),
  bind:(solutionId:string,installationId:number,repositoryId:number)=>request('bind','POST',{solutionId,installationId,repositoryId}),
  unbind:(solutionId:string)=>request('unbind','POST',{solutionId}),
  disconnect:():Promise<{connected:false;remoteRevoked:boolean}>=>request('disconnect','POST'),
};
