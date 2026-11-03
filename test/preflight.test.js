import test from 'node:test';
import assert from 'node:assert/strict';
import {OtariProvider} from '../src/provider.js';
const config={authorized:true,apiKey:'dummy-not-a-real-key',baseUrl:'https://otari.ai/api/v1',authScheme:'otari-key',extractModel:'model-a',reviewModel:'model-b',openWeightEvidence:{'model-a':'test','model-b':'test'},reservationPerCall:0.05};
const response=url=>new Response(JSON.stringify({data:url.endsWith('/models')?[{id:'model-a'},{id:'model-b'}]:[]}));
test('preflight timeout configuration is bounded and fails before network',async()=>{
 for(const value of [0,-1,20001,1.5,'20000',Infinity]){let calls=0;const p=new OtariProvider({...config,preflightTimeoutMs:value},{fetchImpl:async()=>{calls++;}});await assert.rejects(p.preflight(),/INVALID_PREFLIGHT_TIMEOUT/);assert.equal(calls,0);}
});
test('preflight timeout and transport errors are sanitized and never retried',async()=>{
 for(const name of ['TimeoutError','AbortError','TypeError']){let calls=0;const p=new OtariProvider(config,{fetchImpl:async()=>{calls++;const e=Error('private response fragment');e.name=name;throw e;}});p.ready=true;await assert.rejects(p.preflight(),e=>e.message===`PREFLIGHT_MODELS_${name==='TypeError'?'NETWORK_ERROR':'TIMEOUT'}`&&!e.message.includes('private'));assert.equal(calls,1);assert.equal(p.ready,false);}
});
test('tools errors identify correct endpoint without repeating models request',async()=>{
 const seen=[];const p=new OtariProvider(config,{fetchImpl:async url=>{seen.push(url);if(url.endsWith('/models'))return response(url);return new Response('private fragment',{status:401});}});await assert.rejects(p.preflight(),/^Error: PREFLIGHT_TOOLS_401$/);assert.equal(seen.length,2);assert.equal(p.ready,false);
});
test('preflight body parse failure is sanitized, body timeout distinct',async()=>{
 for(const name of ['SyntaxError','TimeoutError']){let calls=0;const p=new OtariProvider(config,{fetchImpl:async()=>{calls++;return {ok:true,json:async()=>{const e=Error('private response fragment');e.name=name;throw e;}};}});await assert.rejects(p.preflight(),e=>e.message===`PREFLIGHT_MODELS_${name==='TimeoutError'?'TIMEOUT':'INVALID_JSON'}`);assert.equal(calls,1);}
});
test('configured abort signal bounds a stalled preflight without retry',async()=>{
 let calls=0;const keepAlive=setTimeout(()=>{},1000);try{const p=new OtariProvider({...config,preflightTimeoutMs:10},{fetchImpl:async(_url,{signal})=>{calls++;return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}));}});await assert.rejects(p.preflight(),/PREFLIGHT_MODELS_TIMEOUT/);assert.equal(calls,1);}finally{clearTimeout(keepAlive);}
});
test('successful preflight keeps GET redirect policy and distinct endpoint signals',async()=>{
 const signals=[];const p=new OtariProvider(config,{fetchImpl:async(url,opts)=>{assert.equal(opts.method,undefined);assert.equal(opts.redirect,'error');signals.push(opts.signal);return response(url);}});await p.preflight();assert.equal(p.ready,true);assert.equal(signals.length,2);assert.notEqual(signals[0],signals[1]);
});
