# Live acceptance — latest 2026-11-03 04:19 UTC

## Latest narrow conflict acceptance — 2026-11-03 04:24 UTC

**LIVE_DUAL_MODEL_TRANSPORT_PASS / SYNTHETIC_CONFLICT_CASE_PASS / NOT_SUBMISSION_READY.**

Run `fa5bed5c-6794-4607-8b5a-f9499f1f2c12` at 04:24:32.056 UTC used a generic reviewer prompt with no Atlas/30/14 answer hint and live source text with no explanatory conflict cue. Eight bounded claims were preserved with source quotes and reviewer reasons. The reviewer separately identified “Atlas retention days differ between sources,” citing S1's exact 30-day sentence and S3's exact 14-day sentence. Source-attributed retention claims remain source-supported rather than being mislabeled false. The deterministic gate verified the expected pair of distinct literal citations. This passes only this single synthetic conflict case, not general accuracy or real-world reliability.

Qwen request `93eb5749-bfd0-4a10-978a-4b37cef1ba2a`: **$0.000693**. GPT-OSS-20B request `30b7dd9e-bb5b-4dec-b61c-1723d9fabeaa`: **$0.000251**. Both served by DeepInfra with stop/valid_json. All ten calls across six controlled runs total **$0.006841**, all settled. No additional API run is implied by this report.

The preceding coached run cost $0.001097; it contained an expected-answer hint and is explicitly excluded as evidence of independent conflict detection. It remains in the accounting audit, not discarded. The final case's claim text and conflict description were independently inspected; general semantic accuracy remains unverified.

**90/90 automated tests and full syntax checks pass.** Actual browser fixture QA: synthetic example → review → source-supported claims plus separate 30/14 conflict; Markdown/JSON downloads read back correctly; invalid short question hid stale results and displayed the 8–1000-character error; reloading example/review recovered. This is offline fixture UI testing, not live UI inference. See `conflict-browser-download.md`, `conflict-browser-download.json`, and `conflict-fixture-browser.jpg` in docs/qa.

Default UI remains OFFLINE_FIXTURE. Native tools, guardrails, routing/fallback and user-budget feature execution are not proven. Remaining work includes broader quality evaluation, a judge-ready live demonstration flow, public visibility only when authorized, the participant's own demo and complete submission materials.

Evidence: [sanitized live conflict artifact](LIVE_CONFLICT_ACCEPTANCE_20261103.json). Historical snapshots below retain earlier failures and limits; current status is this section.

## Earlier snapshots


## Current conclusion

**Authenticated hosted two-model transport, model identity, JSON parsing and literal citation-presence checks passed. Semantic accuracy is unverified; not submission-ready.**

Completed run `24367009-0aaa-4fb0-b4a5-736e081396eb` at 04:19:15.242 UTC:
- Extractor Qwen, DeepInfra, request `e92cd039-ff41-4068-8381-99aaf725d0eb`, exact cost `"0.000610"`.
- Reviewer GPT-OSS-20B, DeepInfra, request `f814159d-6998-4b5e-b0f4-a48176ba07a6`, exact cost `"0.000130"`.
- Both finish reason stop, valid JSON; seven claims all literal citations verified, all reviewer verdicts supported.
- Final pair **$0.000740**, all six calls across four runs **$0.004800**, all settled. No unsettled reservations.

The synthetic inputs deliberately contain conflicting Atlas retention periods. This sanitized artifact omits claim text and reviewer reasoning, so the all-supported output cannot establish whether claims were correctly qualified or the conflict was overlooked. Do not infer semantic success or failure without those missing details. Exact citation matching is not truth verification. Native guardrails were explicitly off/unverified; no native tool/fallback execution is claimed. The requested reasoning-effort control's exact model effect remains unverified.

## Intermediate compatibility run

The third run reached both roles. Extractor `c4c3f343-a38c-4582-8fb3-1e9a5f3ee506` settled $0.000881. Reviewer `0aa60059-1fc0-42ae-919f-880f471cea2e` settled $0.000225 but failed JSON parsing with finish reason length, content length1761 and reasoning length3706. These diagnostics support a bounded output-budget investigation, not a general provider-quality claim.

The reviewed fix allows reviewerMaxOutputTokens1..4096 (default1400), shared with conservative estimation. Extractor remains1400. The successful run used the reviewed bounded configuration. Inference deadline default/max120s, preflight default/max20s, no automatic retries. **85/85 tests and full syntax checks pass**.

## Evidence and next step

[Sanitized transport JSON](LIVE_TRANSPORT_20261103.json) preserves exact request/cost metadata and local reservation history, without credentials, private account configuration, raw reasoning or customer data. Preserve prior failures and settlements below. Next verify full synthetic claims/reasons and contradiction handling before presenting a quality claim or participant demo.

## Historical audit snapshots (superseded by current conclusion above)

# Live acceptance — 2026-11-03

Current offline validation: **78/78 tests and full syntax checks pass**. Safe output diagnostics now retain only bounded length counts, enum finish reason and parser category; no raw response or reasoning. These diagnostics were added after the second failed response and cannot reconstruct it retroactively.

## Second, separately authorized run — 2026-11-03 04:14 UTC

The new extractor request `13166859-ff58-4d69-94c8-b230e4a8ed4d` returned enough metadata to establish cost and served model, but failed `INVALID_STRUCTURED_OUTPUT`. Cost **$0.001477** was automatically settled; served model reported `Qwen/Qwen3.5-35B-A3B`. This run made one extractor call and no reviewer call. The two requests total **$0.002954**, with no unsettled reservation after this result. No further call is authorized by this report; diagnosis continues before any new execution.

The failed parser result does not by itself establish truncation, empty content or model noncompliance. These remain hypotheses until safely bounded response metadata is available. No successful dual-model evidence report exists yet. Preserve the exact known costs and both failure artifacts; do not reset the cumulative accounting.


## Latest reconciliation — 2026-11-03 04:13 UTC

**AUTHENTICATION_VERIFIED / FIRST_REQUEST_COST_RECONCILED / DUAL_MODEL_ACCEPTANCE_PENDING.** This section supersedes the historical unsettled status below.

One authorized read-only request to the deployed documented request-settlement endpoint returned HTTP 200 at 04:12:55 UTC for request `32e7a581-3d83-48c7-b588-cc98764a9254`: status success, exact `cost_usd` **`"0.001477"`**, 547 prompt tokens, 1400 completion tokens, 1947 total tokens and row_count 1. Audited manual reconciliation settled that reservation to **$0.001477**; no unsettled reservation remained at reconciliation time. The original client timeout artifact remains immutable. This was not a replay or automatic retry.

The original model output was not recovered: native Log View exposed no input/output. Successful issuer execution and reconciled cost do not prove usable citations or a complete evidence brief. A separately authorized new run may proceed within the existing cumulative $1 gift-credit limit; no result of a subsequent run is claimed here.

The reviewed inference deadline is now 120 seconds by default and maximum, strictly validated before credential/network use. The same abort signal covers POST and response-body parsing. No automatic retries were added; ambiguous outcomes still freeze the durable ledger. Original model roles, two-call maximum and budgets remain unchanged. **74/74 tests pass** with focused syntax checks; source remains private.


## Historical first-run snapshot: before settlement recovery

The setup workflow verified dedicated credential enrollment locally and authenticated read-only models/tools discovery (HTTP 200). Both approved model IDs were present. This proves authentication/catalog access, not working inference or contest scoring.

The first extractor attempt ended with `UNKNOWN_GATEWAY_OUTCOME`. Request ID, served model and cost are all `null`. Calls attempted: **1**; reviewer calls: **0**. The immutable sanitized acceptance artifact and durable ledger independently agree that **$0.05 remains unsettled** and manual reconciliation is required. This is a reservation, not a verified charge.

Evidence identifiers: acceptance artifact `65266f2f-b4b5-49fa-af95-cf05f4f640a8`; local run `63b61879-f0ab-4697-8ff4-a5cbc6e906d9`. No raw payload, credential, account email, or private configuration is included.

At 04:09 UTC the setup worker observed no usage/requests in the issuer UI. Absence at that time cannot establish that no provider call ran or no charge will settle. There was no automatic retry. Additional inference stays frozen until reconciliation. Unknown outcome is not a successful demo, nor evidence that billing is zero.

## Historical first-run engineering snapshot (25-second inference at that time)

- Preflight models/tools GETs use a default 20-second per-endpoint deadline, configurable only within 1–20000 ms. Failures distinguish timeout, transport, invalid JSON and HTTP status without raw error fragments. No automatic retry.
- Inference remains capped at 25 seconds. Exact model roles, two-call maximum, $0.05 per-call reservation and durable $1 cumulative cap are unchanged.
- The official inline cost contract is a paired six-decimal USD string and pricing source. Strict parsing rejects missing pairs, malformed/negative/scientific amounts, unsafe magnitudes, numeric-only legacy mocks and invalid source tags. A valid priced zero is retained; unknown remains unknown.
- Original string cost is retained beside numeric accounting.
- **68/68 offline automated tests pass**, including uncertainty freezes and no-retry regressions; syntax checks pass. These tests do not establish live provider behavior.

Official contract: https://github.com/mozilla-ai/otari/blob/main/docs/api-reference.md#request-id-and-inline-cost (read 2026-11-03). A proposed `docs/hybrid-mode-protocol.md` source was unavailable (404) and was not used as evidence.

## Historical first-run stop condition (later resolved)

Obtain issuer-supported evidence for the first uncertain request before changing the held reservation. Without an authoritative result, remain blocked and do not resend. Do not claim complete dual-model acceptance or native guardrails/tool execution.

## Historical delayed issuer trace: before exact settlement

At 04:10 UTC the setup worker refreshed the native issuer UI and found the one matching request, ID `32e7a581-3d83-48c7-b588-cc98764a9254`, reported **Success**, provider DeepInfra, model `Qwen/Qwen3.5-35B-A3B`, duration **68 seconds**, 547 input tokens and 1400 output tokens. The UI displayed total **$0.0015**, with meter amounts input $0.0000766 and output $0.0014. These displayed values are not an exact wire `cost_usd` settlement string; do not substitute the rounded total for authoritative settlement. The browser displayed start time 2026-11-03 13:08:50.139 without verified timezone, so it is not represented as UTC.

This later evidence supersedes any inference from the earlier empty usage list: the issuer reports completed model execution. The client still has no recovered response/citations or exact billed settlement. The immutable original timeout artifact remains unchanged, **$0.05 remains unsettled**, and no reviewer or retry was sent. Preserve the two observations separately: client timeout versus delayed issuer-reported success. Dual-model acceptance is still incomplete. Next step is to recover authoritative settlement and response evidence without resending inference.
