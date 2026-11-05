import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Runs the same authenticated API handlers locally; secrets stay in Node.
export function localApi():Plugin {
  return {
    name:'orientohub-local-api',
    apply:'serve',
    configureServer(server){
      const env=loadEnv(server.config.mode,server.config.root,'');
      for(const [key,value] of Object.entries(env))if(process.env[key]===undefined)process.env[key]=value;
      process.env.ORIENTOHUB_LOCAL_DEV='1';
      process.env.ORIENTOHUB_LOCAL_ORIGIN='http://localhost:5173';
      server.middlewares.use(async(req,res,next)=>{
        const url=new URL(req.url||'/','http://localhost:5173');
        if(!url.pathname.startsWith('/api/'))return next();
        // Never expose the local server or secrets to forwarded/public hosts.
        if(!['localhost:5173','127.0.0.1:5173'].includes(req.headers.host||'')){
          res.statusCode=403;res.end('Host não permitido.');return;
        }
        const match=url.pathname.match(/^\/api\/([a-z0-9-]+)$/);
        if(!match||!existsSync(resolve(server.config.root,`api/${match[1]}.ts`))){res.statusCode=404;res.end();return;}
        try{
          const handler=await server.ssrLoadModule(`/api/${match[1]}.ts`);
          const request=req as any,response=res as any;
          request.query=Object.fromEntries(url.searchParams);
          response.status=(code:number)=>{res.statusCode=code;return response;};
          response.json=(data:unknown)=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));return response;};
          if(handler.config?.api?.bodyParser!==false){
            const chunks:Buffer[]=[];let size=0;
            for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>1024*1024){res.statusCode=413;res.end();return;}chunks.push(Buffer.from(chunk));}
            const body=Buffer.concat(chunks).toString('utf8');
            try{request.body=body?JSON.parse(body):undefined;}catch{res.statusCode=400;res.end('JSON inválido.');return;}
          }
          await handler.default(request,response);
        }catch{
          if(!res.headersSent){res.statusCode=500;res.setHeader('Content-Type','application/json');}
          if(!res.writableEnded)res.end(JSON.stringify({message:'Não foi possível executar a API local. Confira as variáveis de servidor no .env.local.'}));
        }
      });
    },
  };
}
