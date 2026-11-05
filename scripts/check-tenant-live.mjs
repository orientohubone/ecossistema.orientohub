// Read-only authenticated A/B checks against the configured Supabase project.
// Use temporary JWTs for two dedicated test accounts via process environment;
// never commit JWTs or paste them in reports. No signup, email, or write occurs.
import fs from 'node:fs';
const env = {};
for (const line of fs.readFileSync('.env','utf8').split(/\r?\n/)) {
  const match=line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if(match) env[match[1]]=match[2].trim().replace(/^(['"])(.*)\1$/,'$2');
}
const base=env.SUPABASE_URL||env.VITE_SUPABASE_URL;
const key=env.SUPABASE_ANON_KEY||env.VITE_SUPABASE_ANON_KEY;
const tokens=[process.env.TENANT_TEST_A_TOKEN,process.env.TENANT_TEST_B_TOKEN];
if (!tokens.every(Boolean)) throw new Error('Defina TENANT_TEST_A_TOKEN e TENANT_TEST_B_TOKEN com JWTs temporários de duas contas de teste não administrativas.');
const request=async (path,token,options={}) => {
  const result=await fetch(`${base}${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(15000)});
  return {status:result.status,ok:result.ok,data:await result.json().catch(()=>null)};
};
const identities=await Promise.all(tokens.map(token=>request('/auth/v1/user',token)));
if(identities.some(result=>!result.ok||!result.data?.id)||identities[0].data.id===identities[1].data.id) throw new Error('São necessárias duas sessões válidas de contas diferentes.');
const checks=[];
for(let index=0;index<2;index++) {
  const token=tokens[index],other=identities[1-index].data.id;
  const founder=await request('/rest/v1/rpc/is_orientohub_founder',token,{method:'POST',body:'{}'});
  if(founder.data===true) throw new Error('Não use a conta founder para os testes de isolamento entre membros.');
  for(const table of ['projects','solutions','ideas','hypotheses','experiments','interviews','events','user_activity','idea_hypotheses','billing_subscriptions','community_post_bookmarks']) {
    const result=await request(`/rest/v1/${table}?select=*&user_id=eq.${other}&limit=1`,token);
    checks.push({account:index===0?'A':'B',table,status:result.status,pass:result.status===403||result.status===401||(result.ok&&Array.isArray(result.data)&&result.data.length===0),scope:'cross-account read'});
  }
  for(const rpc of ['get_founder_metrics','get_founder_user_tracking']) {
    const result=await request(`/rest/v1/rpc/${rpc}`,token,{method:'POST',body:'{}'});
    checks.push({account:index===0?'A':'B',rpc,status:result.status,pass:result.status===401||result.status===403,scope:'founder privilege boundary'});
  }
}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),readOnly:true,limitation:'Empty tables cannot prove isolation of existing rows. Writes and foreign-key attacks are covered by local database tests.',checks},null,2));
if(checks.some(check=>!check.pass)) process.exitCode=1;
