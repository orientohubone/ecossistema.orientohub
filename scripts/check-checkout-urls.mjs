import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
const compile=source=>ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleUrl=source=>`data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`;
const helper=moduleUrl(await readFile('server/checkoutUrls.ts','utf8'));
const {checkoutPublicOrigin:origin}=await import(helper);
let providerCalls=0,payload;
const previousFetch=globalThis.fetch,previousEnv={...process.env};
globalThis.__checkoutClient=()=>({auth:{getUser:async()=>({data:{user:{id:'test-owner'}}})},from:()=>({insert:async row=>{assert.equal(row.user_id,'test-owner');return {error:null};}})});
try{
 Object.assign(process.env,{ORIENTOHUB_LOCAL_DEV:'1',NODE_ENV:'development',APP_URL:'http://localhost:5173',MERCADOPAGO_ACCESS_TOKEN:'fake-payment-key',SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:'fake-anon',SUPABASE_SERVICE_ROLE_KEY:'fake-service'});
 delete process.env.CHECKOUT_PUBLIC_URL;
 assert.equal(origin(),'https://orientohub.com.br');
 process.env.CHECKOUT_PUBLIC_URL='https://checkout.example.com';assert.equal(origin(),'https://checkout.example.com');
 for(const url of ['http://localhost:5173','https://localhost','https://127.0.0.1','https://private.local','https://example.com/path','https://user:pass@example.com']){process.env.CHECKOUT_PUBLIC_URL=url;assert.throws(origin,/CHECKOUT_PUBLIC_URL/);}
 delete process.env.CHECKOUT_PUBLIC_URL;
 const source=(await readFile('api/create-mercadopago-checkout.ts','utf8')).replace("import { createClient } from '@supabase/supabase-js';",'const createClient=globalThis.__checkoutClient;').replace('../server/checkoutUrls.js',helper);
 const {default:checkout}=await import(moduleUrl(source));
 globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.mercadopago.com/preapproval');providerCalls++;payload=JSON.parse(options.body);return Response.json({id:'fake-subscription',init_point:'https://www.mercadopago.com.br/fake-checkout'});};
 const response=()=>({statusCode:200,status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}});
 for(const billing of ['monthly','annual']){
  const res=response();await checkout({method:'POST',headers:{authorization:'Bearer user-session',host:'attacker.example','x-forwarded-proto':'http'},body:{plan:'pro',billing,email:'user@example.com'}},res);
  assert.equal(res.statusCode,200);assert.equal(payload.back_url,`https://orientohub.com.br/checkout/success?plan=pro&billing=${billing}`);assert.equal(payload.notification_url,'https://orientohub.com.br/api/mercadopago-webhook');
 }
 process.env.NODE_ENV='production';assert.throws(origin,/CHECKOUT_PUBLIC_URL/);
 const res=response();await checkout({method:'POST',headers:{authorization:'Bearer user-session'},body:{plan:'pro',billing:'monthly',email:'user@example.com'}},res);
 assert.equal(res.statusCode,503);assert.equal(providerCalls,2);
 console.log('OK: local checkout uses public HTTPS callbacks, custom domain supported, invalid origins rejected before provider calls, Host ignored, monthly/annual payload verified. No real checkout created.');
}finally{globalThis.fetch=previousFetch;delete globalThis.__checkoutClient;for(const key of Object.keys(process.env))if(!(key in previousEnv))delete process.env[key];Object.assign(process.env,previousEnv);}
