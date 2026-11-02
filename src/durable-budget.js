import {openSync,closeSync,writeFileSync,readFileSync,renameSync,unlinkSync,existsSync,mkdirSync,fsyncSync} from 'node:fs';
import {dirname} from 'node:path';
import {BudgetLedger} from './budget.js';
export class DurableBudgetLedger extends BudgetLedger {
 constructor(path,{perRun=0.10,perUser=1}={}){
  super({perRun,perUser});this.path=path;this.lock=path+'.lock';mkdirSync(dirname(path),{recursive:true,mode:0o700});
  try{this.lockFd=openSync(this.lock,'wx',0o600);writeFileSync(this.lockFd,JSON.stringify({purpose:'exclusive acceptance runner; stale lock requires manual reconciliation',pid:process.pid}));fsyncSync(this.lockFd);}catch{throw new Error('LEDGER_LOCKED: inspect prior process and reconcile; do not delete an uncertain lock automatically');}
  try{
   if(existsSync(path)){
    const state=JSON.parse(readFileSync(path,'utf8'));
    if(state.version!==1||!Array.isArray(state.reservations)||!Array.isArray(state.users)||!Number.isFinite(state.perRun)||state.perRun<=0||!Number.isFinite(state.perUser)||state.perUser<=0)throw Error('INVALID_LEDGER');
    this.perRun=Math.min(perRun,state.perRun);this.perUser=Math.min(perUser,state.perUser);
    const users=new Map();for(const entry of state.users){if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string'||users.has(entry[0])||!Number.isFinite(entry[1])||entry[1]<0)throw Error('INVALID_LEDGER');users.set(entry[0],entry[1]);}
    const totals=new Map();this.reservations=new Map();
    for(const entry of state.reservations){if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string'||this.reservations.has(entry[0]))throw Error('INVALID_LEDGER');const [id,r]=entry;
     if(!r||typeof r.user!=='string'||typeof r.run!=='string'||!Number.isFinite(r.held)||r.held<0||!['reserved','settled','unsettled'].includes(r.status))throw Error('INVALID_LEDGER');
     totals.set(r.user,(totals.get(r.user)||0)+r.held);if(r.status==='reserved')r.status='unsettled';this.reservations.set(id,r);
    }
    if(users.size!==totals.size||[...totals].some(([user,total])=>!users.has(user)||Math.abs(users.get(user)-total)>1e-9))throw Error('INVALID_LEDGER_TOTALS');
    this.users=totals;
   }
   this.persist();
  }catch(e){this.close();throw e;}
 }
 persist(){const temp=this.path+'.tmp';const fd=openSync(temp,'w',0o600);try{writeFileSync(fd,JSON.stringify({version:1,perRun:this.perRun,perUser:this.perUser,users:[...this.users],reservations:[...this.reservations]},null,2));fsyncSync(fd);}finally{closeSync(fd);}renameSync(temp,this.path);const dir=openSync(dirname(this.path),'r');try{fsyncSync(dir);}finally{closeSync(dir);}}
 annotate(id,metadata){const r=this.reservations.get(id);if(!r)throw Error('INVALID_RESERVATION');r.evidence={role:String(metadata.role||'').slice(0,40),requestId:metadata.requestId?String(metadata.requestId).slice(0,200):null,modelRequested:metadata.modelRequested?String(metadata.modelRequested).slice(0,200):null};this.persist();}
 reserve(user,run,amount){const id=super.reserve(user,run,amount);this.persist();return id;}
 settle(id,cost){super.settle(id,cost);this.persist();}
 close(){if(this.lockFd!==undefined){closeSync(this.lockFd);this.lockFd=undefined;unlinkSync(this.lock);}}
}
