// One-shot loopback-only secret enrollment. Separate from the application server.
import {isDedicatedOtariKey} from './credential-format.js';
import http from 'node:http';import {randomBytes,timingSafeEqual} from 'node:crypto';
import {openSync,writeFileSync,fsyncSync,closeSync} from 'node:fs';import {fileURLToPath} from 'node:url';
export function createCredentialEnrollment({destination,timeoutMs=120000,probeOnly=false}={}){
 if(!destination&&!probeOnly)throw Error('DESTINATION_REQUIRED');const nonce=randomBytes(32).toString('hex');let used=false;let timer;
 const stop=()=>{clearTimeout(timer);server.close();server.closeIdleConnections();};
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Content-Security-Policy',"default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");res.setHeader('Cache-Control','no-store');res.setHeader('Pragma','no-cache');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
  const send=(code,text)=>{res.writeHead(code,{'Content-Type':'text/html; charset=utf-8'});res.end(text);};
  const port=server.address()?.port;const allowedHosts=[`127.0.0.1:${port}`,`localhost:${port}`];const host=req.headers.host;
  if(!allowedHosts.includes(host)){send(403,'Forbidden host.');return;}
  if(used){send(410,'Enrollment closed.');return;}
  if(req.method==='GET'&&req.url==='/'){
   send(200,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private Otari credential enrollment</title><h1>${probeOnly?'NONSECRET transport probe — openai/gpt-oss-20b only':'Save the dedicated Otari project key'}</h1><p>${probeOnly?'Probe mode never writes a file. Do not paste a credential. ':''}Local one-time form. Never paste this key into chat. No API call is made. This listener closes after saving or after two minutes.</p><form method="post" action="/enroll" autocomplete="off"><input type="hidden" name="nonce" value="${nonce}"><label>Dedicated project key <input type="password" name="key" autocomplete="new-password" required minlength="16" maxlength="256" autofocus></label><button type="submit">Save once to private project configuration</button></form></html>`);return;
  }
  if(req.method!=='POST'||req.url!=='/enroll'){send(404,'Not found.');return;}
  if(req.headers.origin!==`http://${host}`||req.headers['sec-fetch-site']&&!['same-origin','none'].includes(req.headers['sec-fetch-site'])){const origin=req.headers.origin===undefined?'missing':req.headers.origin==='null'?'null':req.headers.origin===`http://${host}`?'exact-match':'other';const site=['same-origin','same-site','cross-site','none'].includes(req.headers['sec-fetch-site'])?req.headers['sec-fetch-site']:'missing-or-other';send(403,probeOnly?`Same-origin form required. Probe-only metadata: origin=${origin}; sec-fetch-site=${site}; method=POST; path=/enroll; host=validated-loopback.`:'Same-origin form required.');return;}
  if(!/^application\/x-www-form-urlencoded(?:;|$)/i.test(req.headers['content-type']||'')){send(415,'Form encoding required.');return;}
  try{
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>1024){send(413,'Input too large.');req.destroy();return;}chunks.push(chunk);}
   const form=new URLSearchParams(Buffer.concat(chunks).toString('utf8'));const supplied=form.get('nonce')||'';
   if(form.getAll('nonce').length!==1||form.getAll('key').length!==1||supplied.length!==nonce.length||!timingSafeEqual(Buffer.from(supplied),Buffer.from(nonce))){send(403,'Invalid form token.');return;}
   let key=form.get('key');if(key.length>256||!/^[A-Za-z0-9._~+/-]{16,256}=*$/.test(key)){send(400,'Unsupported key format; nothing saved.');key='';return;}
   if(used){send(410,'Enrollment closed.');return;}
   if(probeOnly){if(key!=='openai/gpt-oss-20b'){key='';send(400,'Probe mismatch. No file was written.');return;}used=true;key='';res.once('finish',stop);send(200,'<h1>NONSECRET PROBE PASSED</h1><p>Exact expected public model ID received. No file was written. Listener closing.</p>');return;}
   if(!isDedicatedOtariKey(key)){key='';send(400,'Dedicated Otari key format required. Nothing saved.');return;}
   used=true;
   let fd;try{fd=openSync(destination,'wx',0o600);writeFileSync(fd,`OTARI_API_KEY=${key}\n`);fsyncSync(fd);}finally{key='';if(fd!==undefined)closeSync(fd);}
   res.once('finish',stop);send(200,'<h1>Saved privately</h1><p>The key was not displayed or sent to a model. This one-time listener is closing. Return to the project workflow.</p>');
  }catch{used=true;res.once('finish',stop);send(409,'Could not save safely. Existing configuration is never overwritten. No key is displayed.');}
 });
 server.requestTimeout=10000;server.headersTimeout=10000;server.on('listening',()=>{timer=setTimeout(()=>{used=true;server.close();server.closeAllConnections();},timeoutMs);timer.unref();});server.on('close',()=>clearTimeout(timer));
 return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 if((!process.argv.includes('--enroll')&&!process.argv.includes('--probe'))||(process.argv.includes('--enroll')&&process.argv.includes('--probe'))){console.error('Choose exactly one: --enroll or --probe; no listener started.');process.exitCode=1;}
 else {const server=createCredentialEnrollment(process.argv.includes('--probe')?{probeOnly:true}:{destination:fileURLToPath(new URL('../.env.live',import.meta.url))});server.listen(8790,'127.0.0.1',()=>console.log('One-time local enrollment ready at http://127.0.0.1:8790/ (2-minute timeout; no key is logged).'));server.on('error',()=>{console.error('Enrollment listener unavailable; no fallback port.');process.exitCode=1;});}
}
