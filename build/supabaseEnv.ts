import {loadEnv} from 'vite';

export function resolveSupabasePublicEnv(env:Record<string,string|undefined>){
  const url=(env.VITE_SUPABASE_URL||env.SUPABASE_URL||'').trim();
  const key=(env.VITE_SUPABASE_ANON_KEY||env.SUPABASE_ANON_KEY||'').trim();
  const missing=[!url&&'VITE_SUPABASE_URL (ou SUPABASE_URL)',!key&&'VITE_SUPABASE_ANON_KEY (ou SUPABASE_ANON_KEY)'].filter(Boolean);
  if(missing.length)throw new Error(`[Supabase/build] Variáveis ausentes: ${missing.join(', ')}. Configure-as no ambiente deste deployment na Vercel e execute um novo build. Nenhum valor de credencial foi registrado.`);
  let parsed:URL;
  try{parsed=new URL(url);}catch{throw new Error('[Supabase/build] A URL pública do Supabase é inválida.');}
  if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new Error('[Supabase/build] A URL pública do Supabase é inválida.');
  let role='';
  try{role=JSON.parse(Buffer.from(key.split('.')[1]||'','base64url').toString()).role||'';}catch{/* Publishable keys are not JWTs. */}
  if(key.startsWith('sb_secret_')||role==='service_role'||key===env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('[Supabase/build] Chave privilegiada recusada no frontend. Use a chave anon ou publishable, nunca service_role/secret.');
  return {url,key};
}

export function supabasePublicDefines(mode:string,envDir:string){
  // Whitelist only the two public values. Never expose process.env wholesale.
  const {url,key}=resolveSupabasePublicEnv(loadEnv(mode,envDir,''));
  console.info('[Supabase/build] URL pública e chave pública disponíveis; valores omitidos.');
  return {'import.meta.env.VITE_SUPABASE_URL':JSON.stringify(url),'import.meta.env.VITE_SUPABASE_ANON_KEY':JSON.stringify(key)};
}
