# State — 2026-11-02

User authorized starting Otari repository and implementation. New project: Evidence Desk. This is development, not submission, credential creation, deployment or prize assurance.

Implemented locally: zero-dependency Node server, offline two-stage fixture pipeline, quote verification, public-source import restrictions, single-process budget ledger, Otari hosted adapter scaffold, synthetic tests. Responsive UI and JSON/Markdown export implemented; 57 automated tests pass. Independent core review found lookup/DNS/IPv6/unknown-billing issues; all were fixed with regression tests. Browser QA passed exercised offline workflows after stale-result and source-label corrections; see docs/qa/BROWSER_QA.md for exact coverage and limits.

Mode: OFFLINE_FIXTURE. Actual model calls: 0. Actual native Otari features verified: 0. No key read/created, no paid inference. No automatic live activation. Not submission-ready.

Private branch `otari-hackathon` first integration code commit: `b724fc515f424a52ee560490af0b6e80ebbe6792` (offline MVP + hosted adapter scaffold, not a live call). Parent `198a9ea20f76d57c83815b162df39be93c947db8`; main remains at that initial commit. Branch and key files were read back successfully. Current follow-up aligns explicit origin/auth configuration with hosted UI evidence; no key or model call.

Blocking live proof: approved credential flow and usage cap; deployed API discovery/model catalog/license/pricing; durable reconciliation and native feature tests. Payment details unresolved and not part of code.

Private opt-in acceptance CLI and durable ledger implemented, 43 offline tests pass. No real credential read or API call yet. Explicit model/tool discovery never marks live ready. Inference waits for dedicated authorized key, issuer budget/credit checks, fresh complete pricing and independent pre-charge review.

One-shot enrollment helper added with isolated dummy tests and exact-model-ID no-write probe. Real credential transfer is pending browser rehearsal and authorization; no actual secret read/write occurred during implementation.

2026-11-02 17:39 UTC: actual nonsecret same-browser enrollment probe passed after standards-based same-origin Referrer-Policy correction; null/cross-site Origin remain rejected. No real credential transfer or model call is claimed by this probe.

Pre-rotation hardening: exact two-model request/served-identity guard, temporary native All-models limitation explicitly labeled, hosted-family format gate rejects stale public clipboard marker, known billing retained on output failures. 57 offline tests pass. Actual dedicated credential authentication and inference remain unverified; no real API call performed by the implementation runner.
