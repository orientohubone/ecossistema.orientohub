// Compare locally without ever printing credential values.
import fs from 'node:fs';
import path from 'node:path';
const env={};
for(const line of fs.readFileSync('.env','utf8').split(/\r?\n/)) {
  const match=line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if(match) env[match[1]]=match[2].trim().replace(/^(['"])(.*)\1$/,'$2');
}
const files=[];
const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {const full=path.join(dir,entry.name); if(entry.isDirectory()) walk(full); else if(/\.(?:js|html|map)$/.test(entry.name)) files.push(full);}};
walk('dist');
const checks=['GITHUB_TOKEN','VITE_GITHUB_TOKEN','SUPABASE_SERVICE_ROLE_KEY','VITE_SUPABASE_SERVICE_ROLE_KEY'].map(name=>({
  credential:name,configured:Boolean(env[name]),foundInBuiltAssets:Boolean(env[name] && files.some(file=>fs.readFileSync(file,'utf8').includes(env[name]))),
}));
console.log(JSON.stringify({assetsChecked:files.length,checks},null,2));
if(checks.some(check=>check.foundInBuiltAssets)) process.exitCode=1;
