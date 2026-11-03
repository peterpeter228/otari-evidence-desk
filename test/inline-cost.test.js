import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInlineCost,OtariProvider} from '../src/provider.js';
test('documented six-decimal paired inline cost including priced zero accepted',()=>{
 for(const source of ['deployment','organization','defaults']){assert.equal(parseInlineCost({cost_usd:'0.001234',pricing_source:source}),0.001234);assert.equal(parseInlineCost({cost_usd:'0.000000',pricing_source:source}),0);}
});
test('unpriced zero and incomplete pair remain unknown',()=>{
 for(const usage of [undefined,{}, {cost_usd:'0.000000'},{pricing_source:'defaults'},{cost_usd:'0.000000',pricing_source:''}])assert.equal(parseInlineCost(usage),null);
});
test('invalid amount and unsafe magnitudes fail closed, numeric legacy fixture not contract',()=>{
 for(const cost_usd of [null,0,0.001,NaN,Infinity,'',' ','NaN','Infinity','-0.001000','-0.000000','1e-6','+0.000001','0.1','00.000001',' 0.001000','0.001000 ','9007199254.740992','9'.repeat(200)+'.000000'])assert.equal(parseInlineCost({cost_usd,pricing_source:'deployment'}),null,String(cost_usd));
});
test('invalid source tags fail closed',()=>{
 for(const pricing_source of [null,1,'Deployment','with-dash','x'.repeat(33),' a','a1',''])assert.equal(parseInlineCost({cost_usd:'0.001000',pricing_source}),null);
});
test('adapter preserves exact reported string and priced zero',async()=>{
 const p=new OtariProvider({baseUrl:'https://otari.ai/api/v1',authScheme:'otari-key',apiKey:'dummy',extractModel:'test',nativeGuardrailMode:'off-unverified'},{fetchImpl:async()=>new Response(JSON.stringify({model:'test',choices:[{message:{content:'{"claims":[]}'}}],usage:{cost_usd:'0.000000',pricing_source:'deployment'}}))});p.ready=true;const result=await p.complete('extractor',{});assert.equal(result.trace.actualCostUsd,0);assert.equal(result.trace.reportedCostUsdString,'0.000000');assert.equal(result.trace.pricingSource,'deployment');
});
