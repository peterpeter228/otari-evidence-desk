import test from 'node:test';
import assert from 'node:assert/strict';
import {outputDiagnostics,OtariProvider} from '../src/provider.js';
test('diagnostics retain only safe enum and lengths, no arbitrary content',()=>{
 const d=outputDiagnostics({choices:[{finish_reason:'private-secret-reason',message:{content:'private-answer',reasoning_content:'private-reasoning'}}]});
 assert.deepEqual(d,{finishReason:null,contentLength:14,reasoningLength:17,parserCategory:'unparsed'});assert.ok(!JSON.stringify(d).includes('private'));
});
test('missing and empty content categories distinguish truncation clues',()=>{
 assert.equal(outputDiagnostics({}).parserCategory,'missing_or_nonstring_content');
 assert.equal(outputDiagnostics({choices:[{finish_reason:'length',message:{content:' ',reasoning:'abc'}}]}).parserCategory,'empty_content');
});
test('invalid JSON failure carries cost and sanitized diagnostics only',async()=>{
 const p=new OtariProvider({baseUrl:'https://otari.ai/api/v1',authScheme:'otari-key',apiKey:'dummy',extractModel:'test',nativeGuardrailMode:'off-unverified'},{fetchImpl:async()=>new Response(JSON.stringify({model:'test',choices:[{finish_reason:'length',message:{content:'{"private":"cut',reasoning_content:'hidden'}}],usage:{cost_usd:'0.001477',pricing_source:'deployment'}}))});p.ready=true;
 await assert.rejects(p.complete('extractor',{}),e=>e.message==='INVALID_STRUCTURED_OUTPUT'&&e.actualCostUsd===0.001477&&e.trace.outputDiagnostics.finishReason==='length'&&e.trace.outputDiagnostics.parserCategory==='invalid_json'&&e.trace.outputDiagnostics.reasoningLength===6&&!JSON.stringify(e.trace.outputDiagnostics).includes('hidden'));
});
