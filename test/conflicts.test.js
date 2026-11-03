import test from 'node:test';import assert from 'node:assert/strict';
import {verifyConflicts,runPipeline,syntheticSemanticGate} from '../src/pipeline.js';
import {CURATED_TEXTS,REVIEW_SYSTEM,EXTRACT_SYSTEM} from '../src/provider.js';
import {sanitizedEvidence,LIVE_ACCEPTANCE_TEXTS} from '../src/live-acceptance.js';
const sources=CURATED_TEXTS.map((text,i)=>({id:`S${i+1}`,title:`Synthetic ${i}`,text}));
const conflict={id:'X1',description:'Atlas retention differs.',evidence:[{sourceId:'S1',quote:'Atlas retains activity records for 30 days.'},{sourceId:'S3',quote:'Atlas retains activity records for 14 days.'}]};
test('conflicts require distinct exact citations; malformed or omitted stays unknown',()=>{
 assert.equal(verifyConflicts([conflict],sources).status,'reviewed');
 for(const value of [undefined,null,{},[{...conflict,evidence:[conflict.evidence[0]]}],[{...conflict,evidence:[conflict.evidence[0],conflict.evidence[0]]}],[{...conflict,evidence:[conflict.evidence[0],{sourceId:'S3',quote:'fabricated quote'}]}]])assert.equal(verifyConflicts(value,sources).status,'unknown');
 assert.equal(verifyConflicts([],sources).conflicts.length,0);
});
test('synthetic gate fails absent conflict/claims but passes exact two-source detection',()=>{
 const report={claims:[{citationVerified:true}],conflictAssessment:verifyConflicts([conflict],sources)};
 assert.equal(syntheticSemanticGate(report).passed,true);
 assert.equal(syntheticSemanticGate({...report,claims:[]}).passed,false);
 assert.equal(syntheticSemanticGate({...report,conflictAssessment:verifyConflicts([],sources)}).passed,false);
 assert.equal(syntheticSemanticGate({...report,conflictAssessment:verifyConflicts(undefined,sources)}).passed,false);
});
test('faithful retention quotes stay supported while separate fixture conflict is exposed',async()=>{
 const report=await runPipeline({question:'Compare retention policy sources',sources});
 assert.equal(syntheticSemanticGate(report).passed,true);assert.ok(report.claims.filter(c=>c.text.startsWith('Atlas retains')).every(c=>c.verdict==='supported'));
 const saved=sanitizedEvidence(report,'retention');assert.ok(saved.claims[0].text);assert.ok(saved.claims[0].evidence.length);assert.equal(saved.conflictAssessment.conflicts.length,1);assert.ok(saved.uncertainties.length);assert.ok(!JSON.stringify(saved).includes('retention'));
});

test('live prompts do not reveal synthetic conflict expected answer',()=>{
 for(const prompt of [REVIEW_SYSTEM,EXTRACT_SYSTEM]){assert.doesNotMatch(prompt,/Atlas|Boreal|\b30\b|\b14\b/);}
 assert.match(REVIEW_SYSTEM,/same subject and property/);
});

test('live acceptance source omits explanatory conflict cue',()=>{
 assert.equal(LIVE_ACCEPTANCE_TEXTS.length,3);assert.equal(LIVE_ACCEPTANCE_TEXTS[2],'Atlas retains activity records for 14 days. Atlas supports CSV export.');
 for(const text of LIVE_ACCEPTANCE_TEXTS)assert.doesNotMatch(text,/conflict|contradic|deliberate/i);
 assert.match(CURATED_TEXTS[2],/deliberately conflicts/);
});
