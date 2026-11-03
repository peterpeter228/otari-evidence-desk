import test from 'node:test';
import assert from 'node:assert/strict';
import {OtariProvider,extractorReasoningEffort} from '../src/provider.js';
import {assertServedIdentity} from '../src/live-acceptance.js';
const config={baseUrl:'https://otari.ai/api/v1',authScheme:'otari-key',apiKey:'dummy',extractModel:'extract',reviewModel:'review',nativeGuardrailMode:'off-unverified'};
test('extractor reasoning control is omitted by default and none-only opt-in',()=>{
 assert.equal(extractorReasoningEffort({}),undefined);assert.equal(extractorReasoningEffort({extractorReasoningEffort:'none'}),'none');
 for(const value of ['auto','low','high','',null,1,{},false])assert.throws(()=>extractorReasoningEffort({extractorReasoningEffort:value}),/INVALID_EXTRACTOR_REASONING_EFFORT/);
});
test('reasoning none is sent only for extractor and never retries',async()=>{
 for(const override of [{},{extractorReasoningEffort:'none'}]){const bodies=[];const p=new OtariProvider({...config,...override},{fetchImpl:async(_url,options)=>{bodies.push(JSON.parse(options.body));return new Response(JSON.stringify({model:'test',choices:[{message:{content:'{}'}}],usage:{cost_usd:'0.001000',pricing_source:'deployment'}}));}});p.ready=true;
 await p.complete('extractor',{});await p.complete('reviewer',{});assert.equal(bodies.length,2);assert.equal(bodies[0].reasoning_effort,override.extractorReasoningEffort);assert.equal(bodies[1].reasoning_effort,undefined);assert.equal(bodies[0].max_tokens,1400);assert.equal(bodies[0].extra_body,undefined);}
});
test('raw Qwen identity requires exact observed deepinfra provider pairing',()=>{
 const result=provider=>({trace:{modelServed:'Qwen/Qwen3.5-35B-A3B',provider}});
 assert.doesNotThrow(()=>assertServedIdentity('extractor',result('deepinfra')));
 for(const provider of [undefined,null,'DeepInfra','deepinfra:','unknown','ovhcloud'])assert.throws(()=>assertServedIdentity('extractor',result(provider)),/SCOPE_MISMATCH/);
 assert.throws(()=>assertServedIdentity('reviewer',result('deepinfra')),/SCOPE_MISMATCH/);
});
