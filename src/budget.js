// In-memory single-process local budget, NOT an authenticated or native Otari budget.
export class BudgetLedger {
  constructor({perRun=0.05,perUser=0.20}={}) { this.perRun=perRun; this.perUser=perUser; this.users=new Map(); this.reservations=new Map(); }
  reserve(user,run,amount) {
    if (!Number.isFinite(amount)||amount<=0) throw new Error('UNKNOWN_PRICE: positive conservative reservation required');
    if([...this.reservations.values()].some(r=>r.user===user&&r.status==='unsettled'))throw new Error('BILLING_UNSETTLED: reconcile before more paid calls');
    const used=this.users.get(user)||0;
    const runUsed=[...this.reservations.values()].filter(r=>r.run===run).reduce((a,r)=>a+r.held,0);
    if(amount+runUsed>this.perRun+1e-12||used+amount>this.perUser+1e-12) throw new Error('BUDGET_EXCEEDED');
    const id=crypto.randomUUID(); this.users.set(user,used+amount); this.reservations.set(id,{user,run,held:amount,status:'reserved'}); return id;
  }
  settle(id,cost) {
    const r=this.reservations.get(id); if(!r||r.status!=='reserved') throw new Error('INVALID_RESERVATION');
    if(cost===null || !Number.isFinite(cost) || cost<0) {r.status='unsettled';return;}
    this.users.set(r.user,(this.users.get(r.user)||0)-r.held+cost); r.held=cost;r.status='settled';
  }
  snapshot(){return {kind:'application-local single process; not authenticated tenant budget',reservations:[...this.reservations.values()]};}
}
