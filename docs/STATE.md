# Current state — 2026-11-03 04:41 UTC

**PRIVATE_LOCAL_UI_IMPLEMENTED / VERIFIED_LIVE_REPLAY / FRESH_UI_PREFLIGHT_BLOCKED / NOT_SUBMISSION_READY.**

106/106 offline tests and complete syntax checks pass after independent review. The isolated opt-in loopback UI uses the reviewed fixed synthetic acceptance runner, exact model roles, existing durable budget, a fsynced single-operation claim, strict Host/Origin/CSRF, and read-only replay/polling. No startup inference, automatic retry or restart resume is allowed.

Real browser replay of the previously verified uncoached CLI artifact passed, with original timestamp, eight claims, the separate 30/14-day conflict, cost and trace. The replay is explicitly historical and incurs no new model charge. The fresh UI operation failed during read-only models discovery; native browser runtime diagnostic reported ECONNREFUSED. Zero inference dispatch and zero new reservations were verified. The consumed operation remains frozen; it was not reset or retried. Earlier CLI evidence remains valid: ten model calls, $0.006841 total, all settled.

See [local UI QA](qa/LIVE_LOCAL_QA_20261103.md), [bounded failure evidence](qa/LIVE_LOCAL_BLOCKED_20261103.json), and [participant recording checklist](LOCAL_DEMO_RECORDING.md). Fresh UI provider completion, this UI export readback and mobile/restart-completed browser QA remain unverified. General semantic reliability, native advanced feature enforcement, public judge access, owner demo/feedback and submission remain open. Next: validate ordinary issuer connectivity in an authorized environment before considering a separately reviewed future operation; do not bypass restrictions or erase the consumed record.

## Historical CLI and earlier state snapshots

# State — 2026-11-03 04:24 UTC

## Latest narrow conflict acceptance — 2026-11-03 04:24 UTC

**LIVE_DUAL_MODEL_TRANSPORT_PASS / SYNTHETIC_CONFLICT_CASE_PASS / NOT_SUBMISSION_READY.**

Run `fa5bed5c-6794-4607-8b5a-f9499f1f2c12` at 04:24:32.056 UTC used a generic reviewer prompt with no Atlas/30/14 answer hint and live source text with no explanatory conflict cue. Eight bounded claims were preserved with source quotes and reviewer reasons. The reviewer separately identified “Atlas retention days differ between sources,” citing S1's exact 30-day sentence and S3's exact 14-day sentence. Source-attributed retention claims remain source-supported rather than being mislabeled false. The deterministic gate verified the expected pair of distinct literal citations. This passes only this single synthetic conflict case, not general accuracy or real-world reliability.

Qwen request `93eb5749-bfd0-4a10-978a-4b37cef1ba2a`: **$0.000693**. GPT-OSS-20B request `30b7dd9e-bb5b-4dec-b61c-1723d9fabeaa`: **$0.000251**. Both served by DeepInfra with stop/valid_json. All ten calls across six controlled runs total **$0.006841**, all settled. No additional API run is implied by this report.

The preceding coached run cost $0.001097; it contained an expected-answer hint and is explicitly excluded as evidence of independent conflict detection. It remains in the accounting audit, not discarded. The final case's claim text and conflict description were independently inspected; general semantic accuracy remains unverified.

**90/90 automated tests and full syntax checks pass.** Actual browser fixture QA: synthetic example → review → source-supported claims plus separate 30/14 conflict; Markdown/JSON downloads read back correctly; invalid short question hid stale results and displayed the 8–1000-character error; reloading example/review recovered. This is offline fixture UI testing, not live UI inference. See `conflict-browser-download.md`, `conflict-browser-download.json`, and `conflict-fixture-browser.jpg` in docs/qa.

Default UI remains OFFLINE_FIXTURE. Native tools, guardrails, routing/fallback and user-budget feature execution are not proven. Remaining work includes broader quality evaluation, a judge-ready live demonstration flow, public visibility only when authorized, the participant's own demo and complete submission materials.

Evidence: [sanitized live conflict artifact](qa/LIVE_CONFLICT_ACCEPTANCE_20261103.json). Historical snapshots below retain earlier failures and limits; current status is this section.

## Earlier state snapshots

# State — 2026-11-03 04:19 UTC

## Current status

**HOSTED_DUAL_MODEL_TRANSPORT_PASS / SEMANTIC_ACCEPTANCE_UNVERIFIED / NOT_SUBMISSION_READY.**

A completed synthetic acceptance run at 04:19:15 UTC used Qwen as extractor and GPT-OSS-20B as reviewer through authenticated hosted Otari, both served by DeepInfra. Both returned parseable JSON and stop finish reasons. Seven claims passed literal citation-presence checks; all were labeled supported. Because the input contains conflicting retention statements and this sanitized artifact does not retain claim text/reasons, semantic correctness and conflict handling remain unverified. Do not describe this as full product acceptance.

Six total model calls across four controlled runs cost exactly **$0.004800**, all settled, no unresolved reservations. Final pair cost $0.000740. Previous timeouts and parser failures remain part of the audit. No automatic retries, budget resets or model-role expansions were added. Dedicated credential stays local and ignored; native All models scope remains the explicitly approved temporary exception, not a native two-model restriction.

Offline tests: **85/85 plus full syntax checks pass**. Preflight deadline max20s; inference deadline default/max120s. Extractor reasoning_effort:none is opt-in and effect unverified; reviewer max output tokens is bounded1..4096 and shared by price estimation and request payload. Native tools, guardrails and fallback execution remain unverified. The default web UI remains OFFLINE_FIXTURE.

Next: preserve full synthetic claim/reason evidence safely and assess conflict handling before a real demo; do not claim successful semantics from exact-quote existence. No contest submission, public publication or owner-voice demo has been completed.

Evidence: [current report](qa/LIVE_ACCEPTANCE_20261103.md), [sanitized transport artifact](qa/LIVE_TRANSPORT_20261103.json).

## Historical audit notes below (not current instructions)

# State — 2026-11-03 04:10 UTC

Current offline validation: **78/78 tests and full syntax checks pass**. Safe output diagnostics now retain only bounded length counts, enum finish reason and parser category; no raw response or reasoning. These diagnostics were added after the second failed response and cannot reconstruct it retroactively.

## Second, separately authorized run — 2026-11-03 04:14 UTC

The new extractor request `13166859-ff58-4d69-94c8-b230e4a8ed4d` returned enough metadata to establish cost and served model, but failed `INVALID_STRUCTURED_OUTPUT`. Cost **$0.001477** was automatically settled; served model reported `Qwen/Qwen3.5-35B-A3B`. This run made one extractor call and no reviewer call. The two requests total **$0.002954**, with no unsettled reservation after this result. No further call is authorized by this report; diagnosis continues before any new execution.

The failed parser result does not by itself establish truncation, empty content or model noncompliance. These remain hypotheses until safely bounded response metadata is available. No successful dual-model evidence report exists yet. Preserve the exact known costs and both failure artifacts; do not reset the cumulative accounting.


## Latest reconciliation — 2026-11-03 04:13 UTC

**AUTHENTICATION_VERIFIED / FIRST_REQUEST_COST_RECONCILED / DUAL_MODEL_ACCEPTANCE_PENDING.** This section supersedes the historical unsettled status below.

One authorized read-only request to the deployed documented request-settlement endpoint returned HTTP 200 at 04:12:55 UTC for request `32e7a581-3d83-48c7-b588-cc98764a9254`: status success, exact `cost_usd` **`"0.001477"`**, 547 prompt tokens, 1400 completion tokens, 1947 total tokens and row_count 1. Audited manual reconciliation settled that reservation to **$0.001477**; no unsettled reservation remained at reconciliation time. The original client timeout artifact remains immutable. This was not a replay or automatic retry.

The original model output was not recovered: native Log View exposed no input/output. Successful issuer execution and reconciled cost do not prove usable citations or a complete evidence brief. A separately authorized new run may proceed within the existing cumulative $1 gift-credit limit; no result of a subsequent run is claimed here.

The reviewed inference deadline is now 120 seconds by default and maximum, strictly validated before credential/network use. The same abort signal covers POST and response-body parsing. No automatic retries were added; ambiguous outcomes still freeze the durable ledger. Original model roles, two-call maximum and budgets remain unchanged. **74/74 tests pass** with focused syntax checks; source remains private.


## Historical first-run status (superseded by latest sections above)

OFFLINE_MVP_COMPLETE / AUTHENTICATION_VERIFIED / LIVE_INFERENCE_BLOCKED.

The authorized setup workflow reports safe dedicated credential enrollment and successful authenticated read-only GET models and GET tools (HTTP 200), including both approved model IDs. No credential or private configuration is stored in this repository. Native key scope remains the user-approved temporary All models exception; application role restrictions remain exact. Native budget is $1 with no reset, gift-credit-only; this is distinct from the local accounting ledger.

One extractor inference attempt was dispatched. Its outcome is unknown: no request ID, served model or billed cost was received. Reviewer was not sent. The durable ledger holds $0.05 unsettled and freezes further inference pending manual reconciliation. The account UI observed at 04:09 UTC showed no usage/requests; this is not proof of nonexecution or zero cost. Do not clear the reservation, rotate again, or retry automatically.

The default web application remains OFFLINE_FIXTURE. A successful two-model evidence brief and native feature execution are not yet verified. Not submission-ready. See [sanitized acceptance report](qa/LIVE_ACCEPTANCE_20261103.md).

Tests: 68/68 offline automated tests and syntax checks pass. Read-only preflight now has a bounded 20-second default deadline and sanitized stage-specific errors. Inline cost parsing matches the official paired six-decimal string/source contract, preserving unknown billing rather than silently treating it as zero. No live inference was performed by the code-test worker.

Next step: reconcile the uncertain first request using issuer-supported usage evidence; only an authoritative resolution can determine whether the reservation is settled or released. Public repository publication, contest submission and the participant's own demo remain separate unfinished steps.

## Historical record (superseded where above differs)

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

## Historical delayed issuer trace before settlement

At 04:10 UTC the setup worker refreshed the native issuer UI and found the one matching request, ID `32e7a581-3d83-48c7-b588-cc98764a9254`, reported **Success**, provider DeepInfra, model `Qwen/Qwen3.5-35B-A3B`, duration **68 seconds**, 547 input tokens and 1400 output tokens. The UI displayed total **$0.0015**, with meter amounts input $0.0000766 and output $0.0014. These displayed values are not an exact wire `cost_usd` settlement string; do not substitute the rounded total for authoritative settlement. The browser displayed start time 2026-11-03 13:08:50.139 without verified timezone, so it is not represented as UTC.

This later evidence supersedes any inference from the earlier empty usage list: the issuer reports completed model execution. The client still has no recovered response/citations or exact billed settlement. The immutable original timeout artifact remains unchanged, **$0.05 remains unsettled**, and no reviewer or retry was sent. Preserve the two observations separately: client timeout versus delayed issuer-reported success. Dual-model acceptance is still incomplete. Next step is to recover authoritative settlement and response evidence without resending inference.
