// Private loopback demo. No startup inference, arbitrary inputs, reset endpoint or retries.
import http from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,openSync,closeSync,fsyncSync,renameSync,unlinkSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID,randomBytes,createHash} from 'node:crypto';
import {runAcceptance,loadValidatedCredentials,redact,APPROVED_EXTRACTOR,APPROVED_REVIEWER} from './live-acceptance.js';
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
function atomic(path,value){mkdirSync(dirname(path),{recursive:true,mode:0o700});const tmp=path+'.tmp';const fd=openSync(tmp,'w',0o600);try{writeFileSync(fd,JSON.stringify(value));fsyncSync(fd);}finally{closeSync(fd);}renameSync(tmp,path);const dir=openSync(dirname(path),'r');try{fsyncSync(dir);}finally{closeSync(dir);}}
const str=(x,max=2000)=>{if(typeof x!=='string'||x.length>max)throw Error('INVALID_SAFE_ARTIFACT');return x;};
const list=(x,max)=>{if(!Array.isArray(x)||x.length>max)throw Error('INVALID_SAFE_ARTIFACT');return x;};
const evidence=x=>list(x,6).map(e=>({sourceId:str(e.sourceId,20),quote:str(e.quote,4000)}));
// Explicit projection: raw output, reasoning, arbitrary metadata and private paths never leave the server.
export function safeReport(raw,secret=''){
 if(JSON.stringify(raw).length>400000||raw?.mode!=='LIVE'||raw.sourceMode!=='synthetic acceptance fixtures')throw Error('INVALID_SAFE_ARTIFACT');
 const r=redact(raw,secret);
 const claims=list(r.claims,12).map(c=>({id:str(c.id,100),text:str(c.text),verdict:['supported','contradicted','insufficient'].includes(c.verdict)?c.verdict:'insufficient',citationVerified:c.citationVerified===true,reason:str(c.reason),evidence:evidence(c.evidence),reviewEvidence:evidence(c.reviewEvidence)}));
 const trace=list(r.trace,2).map((t,i)=>{if(t.modelRequested!==[APPROVED_EXTRACTOR,APPROVED_REVIEWER][i]||!Number.isFinite(t.actualCostUsd)||t.actualCostUsd<0)throw Error('INVALID_SAFE_ARTIFACT');return {role:i?'reviewer':'extractor',modelRequested:t.modelRequested,modelServed:str(t.modelServed,200),provider:['deepinfra','ovhcloud'].includes(t.provider)?t.provider:null,requestId:str(t.requestId,200),actualCostUsd:t.actualCostUsd};});
 if(trace.length!==2)throw Error('INVALID_SAFE_ARTIFACT');
 const assessment=r.conflictAssessment;if(!assessment||!['reviewed','unknown'].includes(assessment.status))throw Error('INVALID_SAFE_ARTIFACT');
 const conflicts=list(assessment.conflicts,12).map(c=>({id:str(c.id,100),description:str(c.description),evidence:evidence(c.evidence),citationVerified:c.citationVerified===true}));
 let cumulativeReportedCostUsd=null;
 if(Array.isArray(r.budget?.reservations)&&r.budget.reservations.every(x=>x.status==='settled'&&Number.isFinite(x.held)&&x.held>=0))cumulativeReportedCostUsd=r.budget.reservations.reduce((a,x)=>a+x.held,0);
 else if(Number.isFinite(r.cumulativeReportedCostUsd)&&r.cumulativeReportedCostUsd>=0)cumulativeReportedCostUsd=r.cumulativeReportedCostUsd;
 return {cumulativeReportedCostUsd,mode:'LIVE',id:str(r.id,100),createdAt:str(r.createdAt,100),sourceMode:r.sourceMode,claims,uncertainties:list(r.uncertainties,24).map(x=>str(x)),conflictAssessment:{status:assessment.status,conflicts},syntheticSemanticGate:{passed:r.syntheticSemanticGate?.passed===true,scope:'fixed synthetic acceptance only; general semantic accuracy unverified'},trace,totalReportedCostUsd:trace.reduce((a,t)=>a+t.actualCostUsd,0),nativeCapabilities:'No native tools or guardrails proven by this demonstration.'};
}
export function loadReplay(path,expectedSha){
 if(!/^[a-f0-9]{64}$/.test(expectedSha||''))throw Error('REPLAY_HASH_REQUIRED');
 const bytes=readFileSync(path);if(bytes.length>400000||createHash('sha256').update(bytes).digest('hex')!==expectedSha)throw Error('REPLAY_HASH_MISMATCH');
 const result=safeReport(JSON.parse(bytes));if(!result.syntheticSemanticGate.passed)throw Error('REPLAY_NOT_VERIFIED');return result;
}
export function classifyLocalFailure(error){
 const code=error?.evidence?.reason;
 const safe=/^PREFLIGHT_(MODELS|TOOLS)_(NETWORK_ERROR|TIMEOUT|INVALID_JSON|[1-5][0-9]{2})$/.test(code||'');
 if(safe&&error.evidence.callsAttempted===0&&error.evidence.requiresManualReconciliation===false)return {code,stage:'read_only_preflight',inferenceCallsAttempted:0,noInferenceDispatchVerified:true};
 return {code:'UNCLASSIFIED_LOCAL_FAILURE',stage:'unknown',inferenceCallsAttempted:null,noInferenceDispatchVerified:false};
}
function storedFailure(value){return value?.noInferenceDispatchVerified===true?classifyLocalFailure({evidence:{reason:value.code,callsAttempted:value.inferenceCallsAttempted,requiresManualReconciliation:false}}):classifyLocalFailure(null);}
export function createLiveLocalServer({statePath,runner,replay=null,secret='',port=0,allowFresh=true}={}){
 if(!statePath||typeof runner!=='function'||!Number.isInteger(port)||port<0||port>65535)throw Error('INVALID_LOCAL_SETUP');
 mkdirSync(dirname(statePath),{recursive:true,mode:0o700});const lockPath=statePath+'.lock';const lock=openSync(lockPath,'wx',0o600);writeFileSync(lock,'private-local-demo');fsyncSync(lock);
 let record=null,frozen=false;const nonce=randomBytes(32).toString('hex');let operationId=randomUUID();
 try{if(existsSync(statePath)){const text=readFileSync(statePath,'utf8');if(text.length>450000)throw Error();record=JSON.parse(text);if(record.schemaVersion!==1||!['pending','completed','blocked','uncertain'].includes(record.status)||typeof record.operationId!=='string'||! /^[a-f0-9-]{36}$/.test(record.operationId))throw Error();operationId=record.operationId;if(record.status==='pending'){record={schemaVersion:1,operationId,status:'uncertain',error:'RESTART_AFTER_DISPATCH_REQUIRES_RECONCILIATION'};atomic(statePath,record);}if(record.status==='completed')record.result=safeReport(record.result,secret);}}
 catch{frozen=true;record={schemaVersion:1,operationId,status:'uncertain',error:'INVALID_OR_UNWRITABLE_OPERATION_RECORD'};}
 const status=()=>({mode:'PRIVATE_LIVE_LOCAL',operationId,csrf:nonce,status:record?.status||'ready',canStart:allowFresh&&!record&&!frozen,replayAvailable:Boolean(replay),failure:record?.failure?storedFailure(record.failure):null,error:['RESTART_AFTER_DISPATCH_REQUIRES_RECONCILIATION','INVALID_OR_UNWRITABLE_OPERATION_RECORD','CLAIM_PERSISTENCE_FAILED','RUN_FAILED_OR_OUTCOME_UNCERTAIN_RECONCILE'].includes(record?.error)?record.error:null});
 const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; connect-src 'self'; style-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'");
 const json=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(value));};
 try{
 const host=`127.0.0.1:${server.address()?.port}`;if(req.headers.host!==host)return json(403,{error:'EXACT_LOCAL_HOST_REQUIRED'});
 if(req.headers.origin!==undefined&&req.headers.origin!==`http://${host}`)return json(403,{error:'SAME_ORIGIN_REQUIRED'});
 if(req.method==='GET'&&req.url==='/live/status')return json(200,status());
 if(req.method==='GET'&&req.url==='/live/result')return json(record?.status==='completed'?200:409,record?.status==='completed'?{kind:'completed_operation',result:record.result}:{status:record?.status||'ready',error:['RESTART_AFTER_DISPATCH_REQUIRES_RECONCILIATION','INVALID_OR_UNWRITABLE_OPERATION_RECORD','CLAIM_PERSISTENCE_FAILED','RUN_FAILED_OR_OUTCOME_UNCERTAIN_RECONCILE'].includes(record?.error)?record.error:null});
 if(req.method==='GET'&&req.url==='/live/replay')return json(replay?200:404,replay?{kind:'historical_replay_no_charge',result:replay}:{error:'NO_VERIFIED_REPLAY'});
 if(req.method==='POST'&&req.url==='/live/run'){
  if(!allowFresh)return json(403,{error:'REPLAY_ONLY_MODE'});
  if(req.headers.origin!==`http://${host}`)return json(403,{error:'EXPLICIT_SAME_ORIGIN_REQUIRED'});
  if(!/^application\/json(?:;|$)/.test(req.headers['content-type']||''))return json(415,{error:'JSON_REQUIRED'});
  let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>512)return json(413,{error:'BODY_TOO_LARGE'});chunks.push(chunk);}
  let body;try{body=JSON.parse(Buffer.concat(chunks).toString());}catch{return json(400,{error:'INVALID_JSON'});}
  if(!body||Array.isArray(body)||Object.keys(body).sort().join(',')!=='csrf,operationId'||body.csrf!==nonce)return json(403,{error:'INVALID_CSRF_OR_FIELDS'});
  if(body.operationId!==operationId)return json(409,{error:'OPERATION_ID_MISMATCH'});
  if(record||frozen)return json(200,status());
  record={schemaVersion:1,operationId,status:'pending',createdAt:new Date().toISOString()};
  try{atomic(statePath,record);}catch{frozen=true;record.status='uncertain';record.error='CLAIM_PERSISTENCE_FAILED';return json(503,status());}
  json(202,status());
  // Claim is durable before execution. All exceptions consume this operation permanently.
  Promise.resolve().then(()=>runner()).then(raw=>{const result=safeReport(raw,secret);record={schemaVersion:1,operationId,status:'completed',result};atomic(statePath,record);}).catch(error=>{frozen=true;record={schemaVersion:1,operationId,status:'uncertain',error:'RUN_FAILED_OR_OUTCOME_UNCERTAIN_RECONCILE',failure:classifyLocalFailure(error)};try{atomic(statePath,record);}catch{/* prior pending claim remains a restart freeze */}});
  return;
 }
 const assets={'/':['live-local.html','text/html'],'/live-local.js':['live-local.js','text/javascript'],'/style.css':['style.css','text/css']};
 if(req.method==='GET'&&assets[req.url]){const [name,type]=assets[req.url];res.writeHead(200,{'Content-Type':type});res.end(readFileSync(resolve(ROOT,'public',name)));return;}
 json(404,{error:'NOT_FOUND'});
 }catch{if(!res.headersSent)json(400,{error:'LOCAL_REQUEST_FAILED'});else res.end();}
 });
 server.requestTimeout=5000;server.headersTimeout=5000;
 server.on('close',()=>{closeSync(lock);if(record?.status!=='pending')try{unlinkSync(lockPath);}catch{}});return server;
}
export async function main(args=process.argv.slice(2)){
 const allowed=/^(--live-local|--replay-only|--port=\d+|--replay-file=acceptance\.[a-f0-9-]+\.json|--replay-sha=[a-f0-9]{64})$/;
 if(!args.includes('--live-local')||args.some(x=>!allowed.test(x))||new Set(args.map(x=>x.split('=')[0])).size!==args.length)throw Error('EXPLICIT_LOCAL_FLAGS_REQUIRED');
 const port=Number(args.find(x=>x.startsWith('--port='))?.split('=')[1]||8788);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('INVALID_PORT');
 const replayFile=args.find(x=>x.startsWith('--replay-file='))?.split('=')[1],sha=args.find(x=>x.startsWith('--replay-sha='))?.split('=')[1];if(Boolean(replayFile)!==Boolean(sha))throw Error('REPLAY_PAIR_REQUIRED');
 const replayOnly=args.includes('--replay-only');if(replayOnly&&!replayFile)throw Error('REPLAY_PAIR_REQUIRED');
 const replay=replayFile?loadReplay(resolve(ROOT,'.private',replayFile),sha):null;
 const {config,apiKey}=replayOnly?{config:null,apiKey:''}:loadValidatedCredentials(ROOT,{requireFile:true});
 const server=createLiveLocalServer({statePath:resolve(ROOT,'.private/live-local-operation.json'),secret:apiKey,replay,port,allowFresh:!replayOnly,runner:()=>runAcceptance({live:true,execute:true,config,apiKey,ledgerPath:resolve(ROOT,'.private/ledger.json'),evidencePath:resolve(ROOT,'.private/acceptance.json')})});
 const stop=()=>{server.close(()=>process.exit(0));};process.once('SIGINT',stop);process.once('SIGTERM',stop);server.once('close',()=>{process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);});
 server.listen(port,'127.0.0.1',()=>console.log(`Private live-local demo http://127.0.0.1:${port}; no inference until explicit action`));return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url))main().catch(()=>{console.error('LIVE_LOCAL_START_FAILED');process.exitCode=1;});
