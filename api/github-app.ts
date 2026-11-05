import type { VercelRequest,VercelResponse } from '@vercel/node';
import { randomBytes } from 'node:crypto';
import { privateHeaders,SESSION_COOKIE,cookieAttributes,verifyUser } from '../server/dashboardAuth.js';
import { appConfigured,appOrigin,appGithub,authorizedRepository,callbackUrl,deleteConnection,decryptSecret,encryptedTokens,encryptSecret,exchangeGithubCode,GithubAppError,githubAdmin,githubUserToken,hash,installationRepositories,installUrl,oauthCookie,ownSolution,positiveId,readBinding,readConnection,userInstallations,uuid } from '../server/githubApp.js';

export const maxDuration=30;
const cookieValue=(request:VercelRequest,name:string)=>request.headers.cookie?.split(';').map(part=>part.trim()).find(part=>part.startsWith(`${name}=`))?.slice(name.length+1);
const clearOauthCookie=`${oauthCookie}=; ${cookieAttributes}; Max-Age=0`;

async function callback(request:VercelRequest,response:VercelResponse){
  let returnSolution='';
  response.setHeader('Set-Cookie',clearOauthCookie);
  try{
    const state=request.query.state,code=request.query.code;
    if(typeof state!=='string'||!/^[a-z\d_-]{43}$/i.test(state)||cookieValue(request,oauthCookie)!==state)throw new GithubAppError(403,'Invalid OAuth state');
    const session=cookieValue(request,SESSION_COOKIE);
    const user=session?await verifyUser(session):null;
    if(!user)throw new GithubAppError(401,'Session expired');
    const digest=hash(state);
    const states=await githubAdmin(`github_oauth_states?state_hash=eq.${digest}&user_id=eq.${user.id}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}`,'DELETE',undefined,true);
    const context=states?.[0];
    if(!context)throw new GithubAppError(403,'Expired or consumed OAuth state');
    returnSolution=context.solution_id&&uuid(context.solution_id)?`&solution=${context.solution_id}`:'';
    if(request.query.error)return response.status(302).setHeader('Location',`${appOrigin()}/dashboard/solutions?github=denied${returnSolution}`).end();
    if(typeof code!=='string'||!code||code.length>1024)throw new GithubAppError(400,'Missing OAuth code');
    const credentials=await exchangeGithubCode(code,decryptSecret(context.verifier_ciphertext,`oauth:${digest}`));
    const identity=await appGithub('/user',credentials.access_token);
    if(!positiveId(identity.id)||typeof identity.login!=='string')throw new GithubAppError(502,'Invalid GitHub identity');
    const encrypted=encryptedTokens(user.id,credentials);
    await githubAdmin('rpc/replace_github_connection','POST',{p_user_id:user.id,p_github_user_id:identity.id,p_login:identity.login,p_access:encrypted.access_ciphertext,p_refresh:encrypted.refresh_ciphertext,p_expires_at:encrypted.expires_at,p_refresh_expires_at:encrypted.refresh_expires_at});
    return response.status(302).setHeader('Location',`${appOrigin()}/dashboard/solutions?github=connected${returnSolution}`).end();
  }catch{
    return response.status(302).setHeader('Location',`${appOrigin()}/dashboard/solutions?github=error${returnSolution}`).end();
  }
}

export default async function handler(request:VercelRequest,response:VercelResponse){
  for(const [key,value]of Object.entries(privateHeaders))response.setHeader(key,value);
  const action=typeof request.query.action==='string'?request.query.action:'status';
  try{
    if(action==='setup'&&request.method==='GET'){
      // installation_id from this redirect is untrusted and never grants access.
      return response.status(302).setHeader('Location',`${appOrigin()}/dashboard/solutions?github=installation_updated`).end();
    }
    if(action==='callback'&&request.method==='GET'){
      if(!appConfigured())throw new GithubAppError(503,'Conexão GitHub ainda não configurada.');
      return callback(request,response);
    }
    const method=['start','bind','unbind','disconnect'].includes(action)?'POST':'GET';
    if(request.method!==method)return response.status(405).json({message:'Método não permitido.'});
    const token=request.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
    const user=token?await verifyUser(token):null;
    if(!user)return response.status(401).json({message:'Faça login para gerenciar sua conexão GitHub.'});
    if(action==='status'&&!appConfigured())return response.status(200).json({configured:false,connected:false});
    if(!appConfigured())throw new GithubAppError(503,'A conexão GitHub está sendo configurada. Tente novamente mais tarde.');
    if(action==='status'){
      const connection=await readConnection(user.id);
      const solutionId=request.query.solutionId;
      let binding=null;
      if(solutionId){if(!uuid(solutionId))throw new GithubAppError(400,'Solução inválida.');await ownSolution(user.id,solutionId);binding=await readBinding(user.id,solutionId);}
      return response.status(200).json({configured:true,connected:Boolean(connection),login:connection?.github_login||null,manageUrl:installUrl(),binding:binding?{installationId:binding.installation_id,repositoryId:binding.repository_id,fullName:binding.full_name,isPrivate:binding.is_private}:null});
    }
    if(action==='start'){
      const solutionId=request.body?.solutionId;
      if(solutionId)await ownSolution(user.id,solutionId);
      const state=randomBytes(32).toString('base64url'),verifier=randomBytes(48).toString('base64url'),digest=hash(state);
      await githubAdmin(`github_oauth_states?user_id=eq.${user.id}`,'DELETE');
      await githubAdmin(`github_oauth_states?expires_at=lt.${encodeURIComponent(new Date().toISOString())}`,'DELETE');
      await githubAdmin('github_oauth_states','POST',{state_hash:digest,user_id:user.id,solution_id:solutionId||null,verifier_ciphertext:encryptSecret(verifier,`oauth:${digest}`),expires_at:new Date(Date.now()+10*60000).toISOString()});
      response.setHeader('Set-Cookie',[`${oauthCookie}=${state}; ${cookieAttributes}; Max-Age=600`,`${SESSION_COOKIE}=${token}; ${cookieAttributes}; Max-Age=3600`]);
      const query=new URLSearchParams({client_id:process.env.GITHUB_APP_CLIENT_ID!,redirect_uri:callbackUrl(),state,code_challenge:Buffer.from(hash(verifier),'hex').toString('base64url'),code_challenge_method:'S256'});
      return response.status(200).json({url:`https://github.com/login/oauth/authorize?${query}`});
    }
    if(action==='disconnect'){
      const connection=await readConnection(user.id);
      await deleteConnection(user.id);
      let remoteRevoked=!connection;
      if(connection){
        try{
          const accessToken=decryptSecret(connection.access_ciphertext,`github:${user.id}:access`);
          const result=await fetch(`https://api.github.com/applications/${encodeURIComponent(process.env.GITHUB_APP_CLIENT_ID!)}/token`,{method:'DELETE',headers:{Authorization:`Basic ${Buffer.from(`${process.env.GITHUB_APP_CLIENT_ID}:${process.env.GITHUB_APP_CLIENT_SECRET}`).toString('base64')}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify({access_token:accessToken}),redirect:'error',signal:AbortSignal.timeout(8000)});
          remoteRevoked=result.ok||result.status===404;
        }catch{remoteRevoked=false;}
      }
      return response.status(200).json({connected:false,remoteRevoked});
    }
    if(action==='unbind'){
      const solutionId=request.body?.solutionId;
      await ownSolution(user.id,solutionId);
      await githubAdmin(`solutions?id=eq.${solutionId}&user_id=eq.${user.id}`,'PATCH',{git_url:null});
      await githubAdmin(`github_solution_repositories?solution_id=eq.${solutionId}&user_id=eq.${user.id}`,'DELETE');
      return response.status(200).json({solution:{id:solutionId,git_url:null}});
    }
    const {token:githubToken,connection}=await githubUserToken(user.id);
    if(action==='installations'){
      const installations=await userInstallations(githubToken);
      return response.status(200).json({installations:installations.map(item=>({id:item.id,account:item.account?.login||'GitHub',selection:item.repository_selection}))});
    }
    if(action==='repositories'){
      const installationId=Number(request.query.installationId),page=Number(request.query.page||1);
      if(!positiveId(installationId)||!Number.isInteger(page)||page<1||page>20)throw new GithubAppError(400,'Instalação ou página inválida.');
      const data=await installationRepositories(githubToken,installationId,page);
      return response.status(200).json({total:data.total_count,repositories:data.repositories.map((repo:any)=>({id:repo.id,fullName:repo.full_name,isPrivate:repo.private}))});
    }
    if(action==='bind'){
      const {solutionId,installationId,repositoryId}=request.body||{};
      await ownSolution(user.id,solutionId);
      if(!positiveId(installationId)||!positiveId(repositoryId))throw new GithubAppError(400,'Selecione uma instalação e um repositório.');
      const repo=await authorizedRepository(githubToken,Number(installationId),Number(repositoryId));
      if(!/^[a-z\d_.-]+\/[a-z\d_.-]+$/i.test(repo.full_name))throw new GithubAppError(502,'Repositório inválido.');
      await githubAdmin('rpc/bind_github_solution','POST',{p_user_id:user.id,p_generation:connection.generation,p_solution_id:solutionId,p_installation_id:Number(installationId),p_repository_id:Number(repositoryId),p_full_name:repo.full_name,p_private:Boolean(repo.private)});
      return response.status(200).json({solution:{id:solutionId,git_url:`https://github.com/${repo.full_name}`},binding:{fullName:repo.full_name,isPrivate:repo.private}});
    }
    throw new GithubAppError(400,'Ação inválida.');
  }catch(error){
    const status=error instanceof GithubAppError?error.status:503;
    return response.status(status).json({message:error instanceof GithubAppError?error.message:'Não foi possível concluir a conexão GitHub. Tente novamente.'});
  }
}
