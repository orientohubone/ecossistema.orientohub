import type { VercelRequest,VercelResponse } from '@vercel/node';
import { createHmac,timingSafeEqual } from 'node:crypto';
import { githubAdmin,positiveId } from '../server/githubApp.js';
export const config={api:{bodyParser:false}};
export function validAppWebhook(body:Buffer,signature:unknown){
  const secret=process.env.GITHUB_APP_WEBHOOK_SECRET;
  if(!secret||typeof signature!=='string'||!/^sha256=[a-f\d]{64}$/i.test(signature))return false;
  const expected=Buffer.from(createHmac('sha256',secret).update(body).digest('hex'),'hex');
  const actual=Buffer.from(signature.slice(7),'hex');
  return actual.length===expected.length&&timingSafeEqual(actual,expected);
}
export default async function handler(request:VercelRequest,response:VercelResponse){
  response.setHeader('Cache-Control','no-store');
  if(request.method!=='POST')return response.status(405).end();
  let size=0;const chunks:Buffer[]=[];
  try{
    for await(const chunk of request){const buffer=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);size+=buffer.length;if(size>1024*1024)return response.status(413).end();chunks.push(buffer);}
    const body=Buffer.concat(chunks);
    if(!validAppWebhook(body,request.headers['x-hub-signature-256']))return response.status(401).json({message:'Assinatura inválida.'});
    const delivery=request.headers['x-github-delivery'];
    if(typeof delivery!=='string'||!/^[a-z\d-]{1,100}$/i.test(delivery))return response.status(400).end();
    const data=JSON.parse(body.toString('utf8')),event=request.headers['x-github-event'];
    if(event==='ping')return response.status(200).json({received:true});
    // Ignore installations belonging to a different app, even with a shared secret.
    if(data.installation&&String(data.installation.app_id)!==process.env.GITHUB_APP_ID)return response.status(200).json({received:true});
    const existing=await githubAdmin(`github_webhook_deliveries?delivery_id=eq.${delivery}&select=delivery_id`);
    if(existing?.length)return response.status(200).json({received:true});
    if(event==='github_app_authorization'&&data.action==='revoked'&&positiveId(data.sender?.id)){
      await githubAdmin(`github_app_connections?github_user_id=eq.${Number(data.sender.id)}`,'DELETE');
    }else if(event==='installation'&&['deleted','suspend'].includes(data.action)&&positiveId(data.installation?.id)){
      await githubAdmin(`github_solution_repositories?installation_id=eq.${Number(data.installation.id)}`,'DELETE');
    }else if(event==='installation_repositories'&&data.action==='removed'&&positiveId(data.installation?.id)){
      const ids=(data.repositories_removed||[]).map((repo:any)=>repo.id).filter(positiveId);
      if(ids.length)await githubAdmin(`github_solution_repositories?installation_id=eq.${Number(data.installation.id)}&repository_id=in.(${ids.join(',')})`,'DELETE');
    }
    // Insert after processing: a transient failure remains retryable. Operations
    // are deletes and tolerate concurrent duplicate delivery.
    await githubAdmin('github_webhook_deliveries','POST',{delivery_id:delivery});
    await githubAdmin(`github_webhook_deliveries?created_at=lt.${encodeURIComponent(new Date(Date.now()-30*86400000).toISOString())}`,'DELETE');
    return response.status(200).json({received:true});
  }catch{return response.status(500).json({message:'Não foi possível processar o evento.'});}
}
