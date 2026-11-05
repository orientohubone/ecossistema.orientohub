import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
let mode='confirmation',synced=0;
const mock={auth:{signUp:async()=>mode==='failure'?{data:{},error:{message:'Signup rejected'}}:{data:{session:mode==='session'?{access_token:'session-token',user:{id:'new-user'}}:null},error:null}}};
globalThis.__signupMock=mock;
globalThis.__signupSync=async()=>{synced++;};
try{
 let source=await readFile('src/stores/authStore.ts','utf8');
 source=source.replace("from 'zustand'",`from '${import.meta.resolve('zustand')}'`)
 .replace("import { supabase, testSupabaseConnection } from '../config/supabase';",'const supabase=globalThis.__signupMock;const testSupabaseConnection=async()=>({connected:true});')
 .replace("import { invalidateCache } from '../lib/memoryCache';",'const invalidateCache=()=>{};')
 .replace("import { syncServerSession } from '../lib/serverSession';",'const syncServerSession=globalThis.__signupSync;');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 const {useAuthStore:store}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
 assert.deepEqual(await store.getState().signup('test@example.com','test-password'),{confirmationRequired:true});
 assert.equal(store.getState().isAuthenticated,false);assert.equal(store.getState().isLoading,false);assert.equal(synced,0);
 mode='session';assert.deepEqual(await store.getState().signup('test@example.com','test-password'),{confirmationRequired:false});
 assert.equal(store.getState().isAuthenticated,true);assert.equal(synced,1);
 mode='failure';const original=console.error;console.error=()=>{};
 try{await assert.rejects(store.getState().signup('test@example.com','test-password'),/Signup rejected/);}finally{console.error=original;}
 assert.equal(store.getState().error,'Signup rejected');assert.equal(store.getState().isLoading,false);
 console.log('OK: confirmation required without session, active session synchronized, signup failure rejects and stops loading. No real email sent.');
}finally{delete globalThis.__signupMock;delete globalThis.__signupSync;}
