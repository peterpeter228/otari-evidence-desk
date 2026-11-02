import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {runPipeline} from './pipeline.js';
const assets=new Map([['/',['index.html','text/html']],['/app.js',['app.js','text/javascript']],['/style.css',['style.css','text/css']]]);
export function createServer(){let running=false;return http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
 try{
  // Local development only. Prevent browser DNS rebinding and cross-origin side-effect requests.
  if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host||''))return json(403,{error:'LOCAL_HOST_ONLY'});
  if(req.headers.origin&&!['http://'+req.headers.host].includes(req.headers.origin))return json(403,{error:'SAME_ORIGIN_REQUIRED'});
  if(req.method==='GET'&&req.url==='/api/status')return json(200,{mode:'OFFLINE_FIXTURE',liveReady:false,nativeFeatures:'unverified',submissionReady:false});
  if(req.method==='POST'&&req.url==='/api/run'){
   if(!/^application\/json(?:;|$)/.test(req.headers['content-type']||''))return json(415,{error:'JSON_REQUIRED'});
   if(running)return json(429,{error:'A run is active; wait until it finishes'});
   running=true;
   try{let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>80000){json(413,{error:'INPUT_TOO_LARGE'});req.destroy();return;}chunks.push(chunk);}const input=JSON.parse(Buffer.concat(chunks).toString());json(200,await runPipeline(input));}finally{running=false;}return;
  }
  if(req.method==='GET'&&assets.has(req.url)){const [name,type]=assets.get(req.url);const body=await readFile(new URL('../public/'+name,import.meta.url));res.writeHead(200,{'Content-Type':type});res.end(body);return;}
  json(404,{error:'NOT_FOUND'});
 }catch(e){json(400,{error:e.message||'Request failed'});}
 });}
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||8787);createServer().listen(port,'127.0.0.1',()=>console.log(`Evidence Desk OFFLINE_FIXTURE http://127.0.0.1:${port}`));}
