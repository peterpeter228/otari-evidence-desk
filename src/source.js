import {lookup} from 'node:dns/promises';
import https from 'node:https';
import {isIP} from 'node:net';
import {createHash} from 'node:crypto';
export const MAX_SOURCE_BYTES=24000;
export function publicAddress(ip) {
 if(isIP(ip)===4){const p=ip.split('.').map(Number);return !(p[0]===0||p[0]===10||p[0]===127||p[0]>=224||(p[0]===169&&p[1]===254)||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&(p[1]===168||p[1]===0))||(p[0]===100&&p[1]>=64&&p[1]<=127)||(p[0]===198&&(p[1]===18||p[1]===19||p[1]===51))||(p[0]===203&&p[1]===0&&p[2]===113));}
 // IPv6 imports are intentionally disabled until comprehensive binary CIDR validation exists.
 return false;
}
export async function validateUrl(raw,resolve=lookup){
 const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||u.port&&u.port!=='443'||u.hash||u.search)throw new Error('URL_POLICY: HTTPS only; no credentials, custom port, query or fragment');
 if(u.hostname==='localhost'||u.hostname.endsWith('.localhost')||u.hostname.endsWith('.local')||u.hostname.endsWith('.internal'))throw new Error('URL_POLICY: local hostname');
 const host=u.hostname.replace(/^\[|\]$/g,'');
 let dnsTimer;
 const records=isIP(host)?[{address:host,family:isIP(host)}]:await Promise.race([resolve(host,{all:true,family:4}),new Promise((_,reject)=>{dnsTimer=setTimeout(()=>reject(new Error('SOURCE_DNS_TIMEOUT')),2000);})]).finally(()=>clearTimeout(dnsTimer));
 const ipv4=records.filter(r=>isIP(r.address)===4);
 if(!ipv4.length||ipv4.some(r=>!publicAddress(r.address)))throw new Error('URL_POLICY: no public IPv4 address or mixed private IPv4 answers');
 return {url:u,address:ipv4[0]};
}
export function pinnedLookup(address){return (_host,options,callback)=>options?.all?callback(null,[address]):callback(null,address.address,address.family);}
export async function fetchSource(raw,{resolve=lookup,request=https.request}={}){
 const deadline=Date.now()+7000;
 const {url,address}=await validateUrl(raw,resolve);
 return await new Promise((done,fail)=>{
  // Pin the validated address in the actual connection. Host/TLS identity remain original.
  let hardTimer;const finish=value=>{clearTimeout(hardTimer);agent.destroy();done(value);};const reject=error=>{clearTimeout(hardTimer);agent.destroy();fail(error);};
  const agent=new https.Agent({keepAlive:false});
  const req=request(url,{agent,method:'GET',lookup:pinnedLookup(address),headers:{Accept:'text/plain,text/html','User-Agent':'EvidenceDesk/0.1'},timeout:7000},res=>{
   if(res.statusCode!==200){reject(new Error('SOURCE_HTTP: redirects and non-200 responses rejected'));res.destroy?.();req.destroy?.();return;}
   if(!/^(text\/plain|text\/html)(;|$)/i.test(res.headers['content-type']||'')){reject(new Error('SOURCE_TYPE: only text/html or text/plain'));res.destroy?.();req.destroy?.();return;}
   let bytes=0;const chunks=[];res.on('data',chunk=>{bytes+=chunk.length;if(bytes>MAX_SOURCE_BYTES){req.destroy(new Error('SOURCE_TOO_LARGE'));return;}chunks.push(chunk);});
   res.on('end',()=>{const text=Buffer.concat(chunks).toString('utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();finish(text);});res.on('error',reject);
  });req.on('timeout',()=>req.destroy(new Error('SOURCE_TIMEOUT')));req.on('error',reject);hardTimer=setTimeout(()=>req.destroy(new Error('SOURCE_TIMEOUT')),Math.max(1,deadline-Date.now()));hardTimer.unref();req.end();
 });
}
export async function normalizeSources(inputs,fetcher=fetchSource){
 if(!Array.isArray(inputs)||inputs.length<1||inputs.length>3)throw new Error('Provide 1–3 sources');
 const output=[];
 for(const [i,s] of inputs.entries()){
  if(!s||typeof s.title!=='string'||s.title.length<1||s.title.length>120)throw new Error('Source title required (max 120 characters)');
  if(Boolean(s.text)===Boolean(s.url))throw new Error('Provide either source text or URL, not both');
  if(s.url&&typeof s.url!=='string')throw new Error('Invalid URL');
  const text=s.url?await fetcher(s.url):s.text;
  if(typeof text!=='string'||!text.trim()||Buffer.byteLength(text)>MAX_SOURCE_BYTES)throw new Error('Source text empty or exceeds 24 KB');
  output.push({id:`S${i+1}`,title:s.title,text,representation:s.url?'fetched-normalized-text':'pasted-text',canonicalUrl:s.url||null,retrievedAt:new Date().toISOString(),sha256:createHash('sha256').update(text).digest('hex')});
 }return output;
}
