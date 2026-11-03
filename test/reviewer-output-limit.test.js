import test from 'node:test';
import assert from 'node:assert/strict';
import {OtariProvider,outputTokenLimit} from '../src/provider.js';
import {estimateCall} from '../src/live-acceptance.js';
test('reviewer output cap defaults 1400 and only accepts integers 1..4096',()=>{
 assert.equal(outputTokenLimit({},'reviewer'),1400);assert.equal(outputTokenLimit({reviewerMaxOutputTokens:4096},'reviewer'),4096);assert.equal(outputTokenLimit({reviewerMaxOutputTokens:4096},'extractor'),1400);
 for(const value of [0,-1,4097,1.5,'4096',null,Infinity])assert.throws(()=>outputTokenLimit({reviewerMaxOutputTokens:value},'reviewer'),/INVALID_REVIEWER_OUTPUT_LIMIT/);
});
test('estimate and POST share exact reviewer cap, extractor stays 1400',async()=>{
 const config={baseUrl:'https://otari.ai/api/v1',authScheme:'otari-key',apiKey:'dummy',extractModel:'extract',reviewModel:'review',nativeGuardrailMode:'off-unverified',reviewerMaxOutputTokens:4096,pricingSnapshot:{models:{extract:{inputUsdPerMillion:0,outputUsdPerMillion:1,fixedFeesUpperBoundUsd:0,contextLimit:100000},review:{inputUsdPerMillion:0,outputUsdPerMillion:1,fixedFeesUpperBoundUsd:0,contextLimit:100000}}}};
 const bodies=[];const p=new OtariProvider(config,{fetchImpl:async(_url,options)=>{bodies.push(JSON.parse(options.body));return new Response(JSON.stringify({model:'test',choices:[{message:{content:'{}'}}],usage:{cost_usd:'0.001000',pricing_source:'deployment'}}));}});p.ready=true;
 for(const role of ['extractor','reviewer']){const estimate=estimateCall(config,role,{});await p.complete(role,{});assert.equal(bodies.at(-1).max_tokens,estimate.maxOutputTokens);assert.equal(estimate.estimatedUpperBoundUsd,estimate.maxOutputTokens/1000000);assert.equal(estimate.reservationUsd,0.05);}
 assert.equal(bodies[0].max_tokens,1400);assert.equal(bodies[1].max_tokens,4096);
});
