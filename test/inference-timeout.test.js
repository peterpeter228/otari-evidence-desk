import test from 'node:test';
import assert from 'node:assert/strict';
import {OtariProvider,inferenceTimeoutMs} from '../src/provider.js';
const base={baseUrl:'https://otari.ai/api/v1',authScheme:'otari-key',apiKey:'synthetic',extractModel:'test',nativeGuardrailMode:'off-unverified'};
test('inference deadline defaults to 120s, has strict bounded override',()=>{
 assert.equal(inferenceTimeoutMs({}),120000);
 for(const value of [1,25000,120000])assert.equal(inferenceTimeoutMs({inferenceTimeoutMs:value}),value);
 for(const value of [0,-1,120001,1.5,'120000',Infinity,NaN])assert.throws(()=>inferenceTimeoutMs({inferenceTimeoutMs:value}),/INVALID_INFERENCE_TIMEOUT/);
});
test('invalid inference deadline rejects before dispatch even for ready provider',async()=>{
 let calls=0;const p=new OtariProvider({...base,inferenceTimeoutMs:120001},{fetchImpl:async()=>{calls++;}});p.ready=true;
 await assert.rejects(p.complete('extractor',{}),/INVALID_INFERENCE_TIMEOUT/);assert.equal(calls,0);
});
test('inference timeout dispatches once and remains unknown, never retries',async()=>{
 let calls=0;const keepAlive=setTimeout(()=>{},1000);
 try{const p=new OtariProvider({...base,inferenceTimeoutMs:10},{fetchImpl:async(_url,{signal})=>{calls++;return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}));}});p.ready=true;
 await assert.rejects(p.complete('extractor',{}),e=>e.name==='UnknownOutcomeError');assert.equal(calls,1);
 }finally{clearTimeout(keepAlive);}
});
test('same inference signal covers delayed body and retains request ID on timeout',async()=>{
 let calls=0;const keepAlive=setTimeout(()=>{},1000);
 try{const p=new OtariProvider({...base,inferenceTimeoutMs:10},{fetchImpl:async(_url,{signal})=>{calls++;return {ok:true,headers:new Headers({'Otari-Request-ID':'synthetic-timeout-id'}),json:()=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}))};}});p.ready=true;
 await assert.rejects(p.complete('extractor',{}),e=>e.name==='UnknownOutcomeError'&&e.requestId==='synthetic-timeout-id');assert.equal(calls,1);
 }finally{clearTimeout(keepAlive);}
});
