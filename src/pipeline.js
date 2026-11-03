import {normalizeSources} from './source.js';
import {FixtureProvider} from './provider.js';
export function verifyClaims(claims,reviews,sources){
 if(!Array.isArray(claims)||claims.length>12||!Array.isArray(reviews))throw new Error('INVALID_MODEL_SCHEMA');
 const sourceMap=new Map(sources.map(s=>[s.id,s]));const ids=new Set();
 const validEvidence=e=>Array.isArray(e)&&e.length>0&&e.length<=6&&e.every(x=>typeof x?.quote==='string'&&x.quote.length>=8&&x.quote.length<=4000&&sourceMap.get(x.sourceId)?.text.includes(x.quote));
 return claims.map(c=>{
  if(!c||typeof c.id!=='string'||!c.id||c.id.length>100||ids.has(c.id)||typeof c.text!=='string'||!c.text||c.text.length>2000)throw new Error('INVALID_CLAIM_SCHEMA');ids.add(c.id);
  const matches=reviews.filter(r=>r.claimId===c.id);const r=matches.length===1?matches[0]:null;
  const cited=validEvidence(c.evidence);const checked=r&&validEvidence(r.evidence)&&['supported','contradicted','insufficient'].includes(r.verdict)&&typeof r.reason==='string'&&r.reason.length<=2000;
  return {...c,evidence:cited?c.evidence.map(e=>({sourceId:e.sourceId,quote:e.quote})):[],verdict:cited&&checked?r.verdict:'insufficient',reason:cited&&checked?r.reason:'Unverified: missing, invalid or ambiguous review/citation; unsupported conclusion withheld.',citationVerified:Boolean(cited&&checked),reviewEvidence:checked?r.evidence.map(e=>({sourceId:e.sourceId,quote:e.quote})):[]};
 });
}
export function verifyConflicts(conflicts,sources){
 const unknown={status:'unknown',conflicts:[],note:'Conflict assessment missing or malformed; absence of conflicts is not established.'};
 if(!Array.isArray(conflicts)||conflicts.length>12)return unknown;
 const sourceMap=new Map(sources.map(s=>[s.id,s])),ids=new Set();const verified=[];
 for(const c of conflicts){
  if(!c||typeof c.id!=='string'||!c.id||c.id.length>100||ids.has(c.id)||typeof c.description!=='string'||!c.description.trim()||c.description.length>2000||!Array.isArray(c.evidence)||c.evidence.length<2||c.evidence.length>6)return unknown;
  if(!c.evidence.every(e=>typeof e?.sourceId==='string'&&typeof e.quote==='string'&&e.quote.length>=8&&e.quote.length<=4000&&sourceMap.get(e.sourceId)?.text.includes(e.quote))||new Set(c.evidence.map(e=>e.sourceId)).size<2)return unknown;
  ids.add(c.id);verified.push({id:c.id,description:c.description,evidence:c.evidence.map(e=>({sourceId:e.sourceId,quote:e.quote})),citationVerified:true});
 }
 return {status:'reviewed',conflicts:verified,note:'Exact citations verified; conflict semantics remain model-assessed.'};
}
export function syntheticSemanticGate(report){
 const expected=[['S1','Atlas retains activity records for 30 days.'],['S3','Atlas retains activity records for 14 days.']];
 const detected=report.conflictAssessment?.status==='reviewed'&&report.conflictAssessment.conflicts.some(c=>expected.every(([sourceId,quote])=>c.evidence.some(e=>e.sourceId===sourceId&&e.quote===quote)));
 const claimsVerified=report.claims.length>0&&report.claims.every(c=>c.citationVerified);
 return {scope:'built-in synthetic Atlas retention conflict only',expectedConflictDetected:Boolean(detected),nonemptyClaimsCited:claimsVerified,passed:Boolean(detected&&claimsVerified),generalSemanticAccuracy:'unverified'};
}
export async function runPipeline(input,{provider=new FixtureProvider(),mode='OFFLINE_FIXTURE',ledger,fetcher,localUser='local-session'}={}){
 if(!input||typeof input.question!=='string'||input.question.trim().length<8||input.question.length>1000)throw new Error('Question must be 8–1000 characters');
 if(mode!=='OFFLINE_FIXTURE'&&mode!=='LIVE')throw new Error('INVALID_MODE');
 if(mode==='LIVE'&&(!provider.ready||!ledger))throw new Error('LIVE_UNCONFIGURED');
 const sources=await normalizeSources(input.sources,fetcher);const id=crypto.randomUUID();const trace=[];
 const safeMeta=value=>{const key=provider.config?.apiKey;return typeof value==='string'&&key?value.split(key).join('[REDACTED]'):value;};
 async function invoke(role,payload){let reservation;
  if(mode==='LIVE'&&provider.estimate)provider.estimate(role,payload);
  if(mode==='LIVE')reservation=ledger.reserve(localUser,id,provider.config.reservationPerCall);
  try{const result=await provider.complete(role,payload);trace.push(result.trace);if(reservation){ledger.annotate?.(reservation,{role,requestId:safeMeta(result.trace.requestId)||null,modelRequested:safeMeta(result.trace.modelRequested)||null});ledger.settle(reservation,result.trace.actualCostUsd);reservation=undefined;if(result.trace.actualCostUsd===null||result.trace.actualCostUsd>provider.config.reservationPerCall){const error=new Error('BILLING_UNSETTLED: reconcile before independent reviewer call');error.requestId=safeMeta(result.trace.requestId)||null;throw error;}}return result.output;}
  catch(e){if(reservation){ledger.annotate?.(reservation,{role,requestId:safeMeta(e.requestId)||null,modelRequested:safeMeta(e.trace?.modelRequested)||null});ledger.settle(reservation,typeof e.actualCostUsd==='number'&&Number.isFinite(e.actualCostUsd)&&e.actualCostUsd>=0?e.actualCostUsd:null);}throw e;}
 }
 const extracted=await invoke('extractor',{question:input.question,sources});
 if(!Array.isArray(extracted.claims)||extracted.claims.length>12)throw new Error('INVALID_EXTRACTOR_SCHEMA');
 const reviewed=await invoke('reviewer',{question:input.question,sources,claims:extracted.claims});
 const claims=verifyClaims(extracted.claims,reviewed.reviews,sources);
 const conflictAssessment=verifyConflicts(reviewed.conflicts,sources);
 const uncertainties=Array.isArray(reviewed.uncertainties)?reviewed.uncertainties.filter(x=>typeof x==='string').slice(0,12).map(x=>x.slice(0,2000)):['Reviewer did not supply uncertainty assessment.'];
 if(conflictAssessment.status==='unknown')uncertainties.push(conflictAssessment.note);
 else if(conflictAssessment.conflicts.length)uncertainties.push('Cross-source conflicts remain unresolved even where individual quotations are source-supported.');
 if(claims.some(c=>c.verdict!=='supported'))uncertainties.push('Some claims are contradicted or insufficient; do not treat this report as a verified recommendation.');
 return {id,mode,question:input.question,sources,claims,conflictAssessment,uncertainties,trace,budget:mode==='LIVE'?ledger.snapshot():{kind:'fixture: no model calls',actualCostUsd:0},createdAt:new Date().toISOString(),submissionReady:false,verificationScope:'Exact quote presence is deterministic; semantic support is model-assessed, not independently proven.'};
}
