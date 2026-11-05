import { useCallback,useEffect,useState } from 'react';
import { CheckCircle,ExternalLink,Github,Link2,Loader2,Lock,RefreshCw,Unplug } from 'lucide-react';
import { GithubConnectionError,githubAppService,type GithubConnectionStatus,type GithubInstallation,type GithubRepositoryOption } from '../../services/githubAppService';
import type { Solution } from '../../services/solutionsService';
import GithubRepositorySelect from './GithubRepositorySelect';
import GithubInstallationSelect from './GithubInstallationSelect';
const fieldClass='mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-3 text-sm text-white outline-none focus:border-primary-400 disabled:opacity-50';
interface Props {solution?:Solution;onUpdated:(solution?:{id:string;git_url:string|null})=>void}
export default function GithubConnectionPanel({solution,onUpdated}:Props){
  // A new solution gets fresh selection state and its own asynchronous requests.
  // In-flight responses from the previous solution cannot populate this panel.
  return <GithubConnectionPanelState key={solution?.id||'account'} solution={solution} onUpdated={onUpdated} />;
}
function GithubConnectionPanelState({solution,onUpdated}:Props){
  const [status,setStatus]=useState<GithubConnectionStatus|null>(null);
  const [installations,setInstallations]=useState<GithubInstallation[]>([]);
  const [repositories,setRepositories]=useState<GithubRepositoryOption[]>([]);
  const [installationId,setInstallationId]=useState(''),[repositoryId,setRepositoryId]=useState('');
  const [page,setPage]=useState(1),[total,setTotal]=useState(0),[search,setSearch]=useState('');
  const [busy,setBusy]=useState('status'),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [loadingRepos,setLoadingRepos]=useState(false);
  const [revision,setRevision]=useState(0);
  const fail=useCallback((failure:unknown)=>{
    if(failure instanceof GithubConnectionError&&failure.status===409){setStatus(current=>current?{...current,connected:false}:null);setInstallations([]);setRepositories([]);}
    setError(failure instanceof Error?failure.message:'Não foi possível concluir a conexão.');
  },[]);
  const load=useCallback(async()=>{
    setBusy('status');setError('');
    try{const data=await githubAppService.status(solution?.id);setStatus(data);setInstallationId(current=>current||String(data.binding?.installationId||''));setRevision(value=>value+1);}
    catch(failure){fail(failure);}finally{setBusy('');}
  },[solution?.id,fail]);
  useEffect(()=>{void load();},[load]);
  useEffect(()=>{
    if(!status?.connected)return;
    const refreshOnReturn=()=>{if(!document.hidden&&!busy)void load();};
    window.addEventListener('focus',refreshOnReturn);
    return()=>window.removeEventListener('focus',refreshOnReturn);
  },[load,status?.connected,busy]);
  useEffect(()=>{
    const result=new URLSearchParams(window.location.search).get('github');
    if(result==='connected')setNotice('Conta GitHub conectada. Autorize os repositórios e escolha qual vincular à solução.');
    if(result==='installation_updated')setNotice('Permissões atualizadas no GitHub. Escolha o repositório da sua solução.');
    if(result==='error')setError('A conexão não foi concluída. Entre novamente se a sessão expirou e tente conectar o GitHub.');
    if(result==='denied')setNotice('A autorização foi cancelada. Você pode conectar o GitHub quando quiser.');
  },[]);
  useEffect(()=>{
    if(!status?.connected)return;
    let cancelled=false;
    void githubAppService.installations().then(data=>{if(cancelled)return;setInstallations(data.installations);setInstallationId(current=>data.installations.some(item=>String(item.id)===current)?current:String(data.installations[0]?.id||''));}).catch(failure=>{if(!cancelled)fail(failure);});
    return()=>{cancelled=true;};
  },[status?.connected,status?.login,revision,fail]);
  useEffect(()=>{
    if(!status?.connected||!installationId||!solution){setRepositories([]);return;}
    let cancelled=false;setLoadingRepos(true);
    void githubAppService.repositories(Number(installationId),page).then(data=>{if(cancelled)return;setRepositories(data.repositories);setTotal(data.total);setRepositoryId(current=>data.repositories.some(repo=>String(repo.id)===current)?current:String(data.repositories.find(repo=>repo.id===status.binding?.repositoryId)?.id||''));}).catch(failure=>{if(!cancelled)fail(failure);}).finally(()=>{if(!cancelled)setLoadingRepos(false);});
    return()=>{cancelled=true;};
  },[installationId,page,solution?.id,status?.connected,status?.binding?.repositoryId,revision,fail]);
  const perform=async(name:string,action:()=>Promise<void>)=>{if(busy)return;setBusy(name);setError('');setNotice('');try{await action();}catch(failure){fail(failure);}finally{setBusy('');}};
  const filtered=repositories.filter(repo=>repo.fullName.toLowerCase().includes(search.toLowerCase()));
  return <section className="rounded-2xl border border-[#273548] bg-[#101722] p-5 text-white sm:p-6" aria-label="Conexão GitHub">
    <header className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b]"><Github className="h-6 w-6" /></span><div><h3 className="font-bold">{solution?'Repositório da solução':'Sua conexão GitHub'}</h3><p className="mt-1 text-sm text-[#9ba9bc]">{status?.connected?`Conectado como ${status.login}`:'Conecte sua conta e escolha quais repositórios a OrientoHub pode consultar.'}</p></div></div><div className="flex flex-wrap gap-2">{status?.connected?<><button type="button" disabled={Boolean(busy)} onClick={()=>void load()} className="rounded-xl border border-[#34455a] p-2.5 text-[#9ba9bc]" aria-label="Atualizar conexão"><RefreshCw className={`h-4 w-4 ${busy==='status'?'animate-spin':''}`} /></button><a href={status.manageUrl} className="inline-flex items-center gap-2 rounded-xl border border-[#34455a] px-3 py-2.5 text-xs font-semibold" target="_blank" rel="noopener noreferrer">Autorizar repositórios<ExternalLink className="h-3.5 w-3.5" /></a><button type="button" disabled={Boolean(busy)} onClick={()=>{if(window.confirm('Desconectar sua conta GitHub e remover os vínculos de todas as suas soluções?'))void perform('disconnect',async()=>{const result=await githubAppService.disconnect();setStatus(current=>current?{...current,connected:false,binding:null}:null);setInstallations([]);setRepositories([]);onUpdated();setNotice(result.remoteRevoked?'Conta GitHub desconectada.':'Desconectado na OrientoHub. Revise também a autorização nas configurações do GitHub.');});}} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-red-300"><Unplug className="h-3.5 w-3.5" />Desconectar</button></>:<button type="button" disabled={Boolean(busy)||!status?.configured} onClick={()=>void perform('connect',async()=>{const result=await githubAppService.start(solution?.id);window.location.assign(result.url);})} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-4 py-3 text-sm font-bold text-black disabled:opacity-40">{busy?<Loader2 className="h-4 w-4 animate-spin" />:<Github className="h-4 w-4" />}Conectar GitHub</button>}</div></header>
    {status&&!status.configured&&<p className="mt-4 text-sm text-[#9ba9bc]">A integração está aguardando ativação pelo administrador.</p>}
    {error&&<p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {notice&&<p role="status" className="mt-4 flex gap-2 text-sm text-primary-200"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />{notice}</p>}
    {status?.connected&&solution&&<div className="mt-5 border-t border-[#273548] pt-5">{status.binding&&<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#151f2b] p-3"><p className="flex items-center gap-2 text-sm"><Link2 className="h-4 w-4 text-primary-300" />{status.binding.fullName}{status.binding.isPrivate&&<Lock className="h-3.5 w-3.5 text-[#9ba9bc]" />}</p><button type="button" disabled={Boolean(busy)} onClick={()=>void perform('unbind',async()=>{const data=await githubAppService.unbind(solution.id);setStatus(current=>current?{...current,binding:null}:null);onUpdated(data.solution);setNotice('Repositório desvinculado desta solução.');})} className="text-xs text-red-300">Desvincular repositório</button></div>}
      {!installations.length?<p className="text-sm text-[#9ba9bc]">Nenhuma instalação autorizada encontrada. Use “Autorizar repositórios” para escolher a conta ou organização e liberar o acesso no GitHub.</p>:<><div className="grid gap-4 md:grid-cols-2"><GithubInstallationSelect value={installationId} disabled={Boolean(busy)} installations={installations} onChange={value=>{setInstallationId(value);setRepositoryId('');setPage(1);setSearch('');}} /><label className="text-sm font-semibold text-[#d7e0ea]">Buscar nesta página<input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Nome do repositório…" className={fieldClass} /></label></div><GithubRepositorySelect value={repositoryId} onChange={setRepositoryId} repositories={filtered} disabled={Boolean(busy)||loadingRepos} loading={loadingRepos} /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3 text-xs text-[#9ba9bc]"><button type="button" disabled={page<=1||loadingRepos} onClick={()=>setPage(value=>value-1)} className="disabled:opacity-30">Anterior</button><span>Página {page} · {total} repositórios autorizados</span><button type="button" disabled={page*100>=total||loadingRepos||page>=20} onClick={()=>setPage(value=>value+1)} className="disabled:opacity-30">Próxima</button></div><button type="button" disabled={Boolean(busy)||loadingRepos||!repositoryId} onClick={()=>void perform('bind',async()=>{const data=await githubAppService.bind(solution.id,Number(installationId),Number(repositoryId));setStatus(current=>current?{...current,binding:{installationId:Number(installationId),repositoryId:Number(repositoryId),...data.binding}}:null);onUpdated(data.solution);setNotice('Repositório vinculado. O acesso é verificado a cada consulta.');})} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-4 py-3 text-sm font-bold text-black disabled:opacity-40">{busy==='bind'?<Loader2 className="h-4 w-4 animate-spin" />:<Link2 className="h-4 w-4" />}Vincular à solução</button></div></>}
    </div>}
  </section>;
}
