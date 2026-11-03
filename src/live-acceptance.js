// Opt-in private CLI only. Server remains fixture-only. No automatic credential discovery.
import {isDedicatedOtariKey} from './credential-format.js';
import {readFileSync,mkdirSync,writeFileSync,renameSync} from 'node:fs';
import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
import {OtariProvider,GatewayResponseError,inferenceTimeoutMs,CURATED_TEXTS,EXTRACT_SYSTEM,REVIEW_SYSTEM} from './provider.js';
import {runPipeline} from './pipeline.js';import {DurableBudgetLedger} from './durable-budget.js';
export const APPROVED_EXTRACTOR='alibaba/qwen-3.5-35b-a3b';
export const APPROVED_REVIEWER='openai/gpt-oss-20b';
export function assertApprovedModels(c){if(c?.extractModel!==APPROVED_EXTRACTOR||c?.reviewModel!==APPROVED_REVIEWER)throw Error('APPROVED_MODEL_SCOPE_REQUIRED');}
// Exact user-approved model identities, including independently verified same-model offerings.
export const APPROVED_SERVED_IDENTITIES=Object.freeze({
 [APPROVED_EXTRACTOR]:Object.freeze([APPROVED_EXTRACTOR,'deepinfra:Qwen/Qwen3.5-35B-A3B','deepinfra:alibaba/qwen-3.5-35b-a3b']),
 [APPROVED_REVIEWER]:Object.freeze([APPROVED_REVIEWER,'deepinfra:openai/gpt-oss-20b'])
});
export function assertServedIdentity(role,result){const requested=role==='extractor'?APPROVED_EXTRACTOR:APPROVED_REVIEWER;const served=result.trace.modelServed;if(!served)throw new GatewayResponseError('SERVED_MODEL_UNVERIFIED',result.trace);if(!APPROVED_SERVED_IDENTITIES[requested].includes(served))throw new GatewayResponseError('SERVED_MODEL_SCOPE_MISMATCH',result.trace);}
export function validateAcceptanceConfig(c,now=Date.now(),{discoveryOnly=false}={}){
 assertApprovedModels(c);
 inferenceTimeoutMs(c);
 if(!['enforced_two_models','not_enforced_user_approved_temporary'].includes(c.authorization?.nativeModelRestriction))throw Error('NATIVE_MODEL_RESTRICTION_STATUS_REQUIRED');
 if(c?.authorized!==true||c?.authorization?.maxSpendUsd!==1||c.authorization.creditOnly!==true||c.authorization.nativeBudgetLimitUsd!==1||c.authorization.nativeBudgetReset!=='never')throw Error('EXPLICIT_AUTHORIZATION_REQUIRED: $1 no-reset native cap and free-credit-only operator attestation required');
 if(discoveryOnly){if(!c.extractModel||!c.reviewModel||c.extractModel===c.reviewModel)throw Error('DISTINCT_MODELS_REQUIRED');if(c.apiKey!==undefined||c.secretFile&&!['.secrets/otari-api-key','.env.live'].includes(c.secretFile))throw Error('SECRET_CONFIG_FORBIDDEN');return c;}
 if(c.responseFormat!=='json_object'||c.jsonModeVerified!==true)throw Error('VERIFIED_JSON_MODE_REQUIRED');
 if(!['required-block','off-unverified'].includes(c.nativeGuardrailMode)||(c.nativeGuardrailMode==='required-block'&&c.nativeGuardrailsAvailableVerified!==true))throw Error('EXPLICIT_NATIVE_GUARDRAIL_POLICY_REQUIRED');
 if(!c.extractModel||!c.reviewModel||c.extractModel===c.reviewModel)throw Error('DISTINCT_MODELS_REQUIRED');
 const p=c.pricingSnapshot;if(!p||!p.sourceUrl||!/^https:\/\//.test(p.sourceUrl)||!Number.isFinite(Date.parse(p.verifiedAt))||Math.abs(now-Date.parse(p.verifiedAt))>86400000)throw Error('FRESH_VERIFIED_PRICING_REQUIRED');
 for(const model of [c.extractModel,c.reviewModel]){const x=p.models?.[model];if(!x||![x.inputUsdPerMillion,x.outputUsdPerMillion,x.fixedFeesUpperBoundUsd].every(n=>Number.isFinite(n)&&n>=0)||x.completeCostCoverage!==true||!Number.isInteger(x.contextLimit)||x.contextLimit<1)throw Error('UNKNOWN_PRICE_OR_CONTEXT');}
 if(c.apiKey!==undefined||c.secretFile&&!['.secrets/otari-api-key','.env.live'].includes(c.secretFile))throw Error('SECRET_CONFIG_FORBIDDEN: only fixed project secret file or supplied OTARI_API_KEY');
 return c;
}
export function estimateCall(c,role,payload){
 const model=role==='extractor'?c.extractModel:c.reviewModel;const p=c.pricingSnapshot.models[model];
 // Conservative byte upper bound plus explicit protocol overhead; no guessed token average.
 const maxInputTokens=Buffer.byteLength(JSON.stringify(payload))+Buffer.byteLength(role==='extractor'?EXTRACT_SYSTEM:REVIEW_SYSTEM)+1024;
 const maxOutputTokens=1400;if(maxInputTokens+maxOutputTokens>p.contextLimit)throw Error('CONTEXT_LIMIT');
 const estimatedUpperBoundUsd=maxInputTokens*p.inputUsdPerMillion/1e6+maxOutputTokens*p.outputUsdPerMillion/1e6+p.fixedFeesUpperBoundUsd;
 if(!Number.isFinite(estimatedUpperBoundUsd)||estimatedUpperBoundUsd>0.05)throw Error('CALL_CAP_EXCEEDED');
 return {maxInputTokens,maxOutputTokens,estimatedUpperBoundUsd,reservationUsd:0.05};
}
export function redact(value,secret){const text=JSON.stringify(value);return JSON.parse(secret?text.split(secret).join('[REDACTED]'):text);}
export function sanitizedEvidence(report,secret){return redact( {schemaVersion:1,mode:'LIVE',createdAt:report.createdAt,id:report.id,submissionReady:false,sourceMode:'synthetic acceptance fixtures',claims:report.claims.map(c=>({id:c.id,verdict:c.verdict,citationVerified:c.citationVerified})),trace:report.trace.map(t=>({role:t.role,requestId:t.requestId,modelRequested:t.modelRequested,modelServed:t.modelServed,actualCostUsd:t.actualCostUsd,reportedCostUsdString:t.reportedCostUsdString??null,pricingSource:t.pricingSource,fallback:t.fallback,attemptCount:t.attemptCount,nativeGuardrailStatus:t.nativeGuardrailStatus})),budget:report.budget,nativeCapabilities:'discovered availability is not execution proof',semanticAccuracy:'unverified'},secret);}
export async function runAcceptance({live=false,execute=false,config,apiKey,ledgerPath,evidencePath,fetchImpl}){
 if(!live)throw Error('EXPLICIT_LIVE_FLAG_REQUIRED');validateAcceptanceConfig(config);
 if(!isDedicatedOtariKey(apiKey))throw Error('DEDICATED_KEY_FORMAT_REQUIRED');
 if(!ledgerPath||!evidencePath)throw Error('PRIVATE_OUTPUT_PATHS_REQUIRED');
 const evidenceRunPath=evidencePath.replace(/\.json$/, '')+'.'+crypto.randomUUID()+'.json';
 const ledger=new DurableBudgetLedger(ledgerPath,{perRun:0.10,perUser:1});
 const provider=new OtariProvider({...config,apiKey,reservationPerCall:0.05},{fetchImpl});let calls=0;
 try{
  if(ledger.snapshot().reservations.some(r=>r.status==='unsettled'))throw Error('BILLING_UNSETTLED: reconcile existing ledger before network');
  await provider.preflight();
  const availability={nativeModelRestriction:config.authorization.nativeModelRestriction,applicationModelRestriction:[APPROVED_EXTRACTOR,APPROVED_REVIEWER],modelsDiscovered:true,tools:Array.isArray(provider.tools)?provider.tools.map(t=>({id:t.id||t.name||null,available:t.available===true})):[],capabilityExecutionVerified:false};
  if(!execute)return {mode:'LIVE_PREFLIGHT_ONLY',...availability,inferenceCalls:0};
  provider.estimate=(role,payload)=>estimateCall(config,role,payload);
  const original=provider.complete.bind(provider);provider.complete=async(role,payload)=>{if(++calls>2)throw Error('TWO_CALL_LIMIT');const result=await original(role,payload);assertServedIdentity(role,result);return result;};
  const report=await runPipeline({question:'Compare the synthetic retention, CSV export and monthly-price policies. Identify contradictions and missing evidence.',sources:CURATED_TEXTS.map((text,i)=>({title:`Synthetic policy ${i+1}`,text}))},{provider,mode:'LIVE',ledger});
  const evidence={...sanitizedEvidence(report,apiKey),nativeModelRestriction:config.authorization.nativeModelRestriction,applicationModelRestriction:[APPROVED_EXTRACTOR,APPROVED_REVIEWER]};mkdirSync(dirname(evidencePath),{recursive:true,mode:0o700});const temp=evidenceRunPath+'.tmp';writeFileSync(temp,JSON.stringify(evidence,null,2),{mode:0o600});renameSync(temp,evidenceRunPath);return {...evidence,evidencePath:evidenceRunPath};
 }catch(e){
  const summary=redact({mode:'LIVE_ACCEPTANCE_BLOCKED',reason:e?.name==='UnknownOutcomeError'?'UNKNOWN_GATEWAY_OUTCOME':(/^[A-Z][A-Z0-9_]{1,80}$/.test(String(e.message).split(':')[0])?String(e.message).split(':')[0]:'LIVE_ACCEPTANCE_FAILED'),requestId:e.requestId||null,reportedCostUsd:typeof e.actualCostUsd==='number'?e.actualCostUsd:null,servedModel:e.trace?.modelServed||null,callsAttempted:calls,budget:ledger.snapshot(),requiresManualReconciliation:ledger.snapshot().reservations.some(r=>r.status==='unsettled')},apiKey);
  mkdirSync(dirname(evidencePath),{recursive:true,mode:0o700});writeFileSync(evidenceRunPath,JSON.stringify(summary,null,2),{mode:0o600,flag:'wx'});
  const safe=new Error(summary.reason);safe.evidence=summary;safe.evidencePath=evidenceRunPath;throw safe;
 }finally{ledger.close();}
}
export async function runDiscovery({live=false,config,apiKey,evidencePath,fetchImpl}){
 if(!live)throw Error('EXPLICIT_LIVE_FLAG_REQUIRED');validateAcceptanceConfig(config,Date.now(),{discoveryOnly:true});if(!isDedicatedOtariKey(apiKey))throw Error('DEDICATED_KEY_FORMAT_REQUIRED');
 const provider=new OtariProvider({...config,apiKey,reservationPerCall:0.05,responseFormat:undefined,nativeGuardrailMode:undefined},{fetchImpl});await provider.preflight();
 const evidence=redact({mode:'LIVE_DISCOVERY_ONLY',inferenceCalls:0,liveReady:false,createdAt:new Date().toISOString(),models:provider.models.filter(m=>[APPROVED_EXTRACTOR,APPROVED_REVIEWER].includes(m.id)),tools:provider.tools,nativeExecutionVerified:false,nativeModelRestriction:config.authorization.nativeModelRestriction,applicationModelRestriction:[APPROVED_EXTRACTOR,APPROVED_REVIEWER]},apiKey);
 const path=evidencePath.replace(/\.json$/, '')+'.'+crypto.randomUUID()+'.json';mkdirSync(dirname(path),{recursive:true,mode:0o700});writeFileSync(path,JSON.stringify(evidence,null,2),{mode:0o600,flag:'wx'});return {...evidence,evidencePath:path};
}
export async function main(args=process.argv.slice(2),env=process.env){
 if(!args.includes('--live'))throw Error('EXPLICIT_LIVE_FLAG_REQUIRED');
 const root=resolve(fileURLToPath(new URL('..',import.meta.url)));const config=JSON.parse(readFileSync(resolve(root,'.otari-live.json'),'utf8'));validateAcceptanceConfig(config,Date.now(),{discoveryOnly:args.includes('--discover')});
 let apiKey;
 if(config.secretFile==='.env.live'){const text=readFileSync(resolve(root,'.env.live'),'utf8');const match=text.match(/^OTARI_API_KEY=([^\r\n]+)$/m);if(!match)throw Error('DEDICATED_KEY_FILE_INVALID');apiKey=match[1].trim();}
 else apiKey=config.secretFile?readFileSync(resolve(root,'.secrets/otari-api-key'),'utf8').trim():env.OTARI_API_KEY;
 const runner=args.includes('--discover')?runDiscovery:runAcceptance;
 const report=await runner({live:true,execute:args.includes('--execute'),config,apiKey,ledgerPath:resolve(root,'.private/ledger.json'),evidencePath:resolve(root,'.private/acceptance.json')});
 console.log(JSON.stringify({mode:report.mode,inferenceCalls:report.inferenceCalls??report.trace?.length,artifact:report.evidencePath||null}));
}
if(process.argv[1]===fileURLToPath(import.meta.url))main().catch(e=>{const code=String(e.message).split(':')[0];console.error(/^[A-Z][A-Z0-9_]{1,80}$/.test(code)?code:'LIVE_ACCEPTANCE_FAILED');process.exitCode=1;});
