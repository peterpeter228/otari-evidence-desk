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


## Verified scope and result

The setup workflow verified dedicated credential enrollment locally and authenticated read-only models/tools discovery (HTTP 200). Both approved model IDs were present. This proves authentication/catalog access, not working inference or contest scoring.

The first extractor attempt ended with `UNKNOWN_GATEWAY_OUTCOME`. Request ID, served model and cost are all `null`. Calls attempted: **1**; reviewer calls: **0**. The immutable sanitized acceptance artifact and durable ledger independently agree that **$0.05 remains unsettled** and manual reconciliation is required. This is a reservation, not a verified charge.

Evidence identifiers: acceptance artifact `65266f2f-b4b5-49fa-af95-cf05f4f640a8`; local run `63b61879-f0ab-4697-8ff4-a5cbc6e906d9`. No raw payload, credential, account email, or private configuration is included.

At 04:09 UTC the setup worker observed no usage/requests in the issuer UI. Absence at that time cannot establish that no provider call ran or no charge will settle. There was no automatic retry. Additional inference stays frozen until reconciliation. Unknown outcome is not a successful demo, nor evidence that billing is zero.

## Engineering fixes and verification

- Preflight models/tools GETs use a default 20-second per-endpoint deadline, configurable only within 1–20000 ms. Failures distinguish timeout, transport, invalid JSON and HTTP status without raw error fragments. No automatic retry.
- Inference remains capped at 25 seconds. Exact model roles, two-call maximum, $0.05 per-call reservation and durable $1 cumulative cap are unchanged.
- The official inline cost contract is a paired six-decimal USD string and pricing source. Strict parsing rejects missing pairs, malformed/negative/scientific amounts, unsafe magnitudes, numeric-only legacy mocks and invalid source tags. A valid priced zero is retained; unknown remains unknown.
- Original string cost is retained beside numeric accounting.
- **68/68 offline automated tests pass**, including uncertainty freezes and no-retry regressions; syntax checks pass. These tests do not establish live provider behavior.

Official contract: https://github.com/mozilla-ai/otari/blob/main/docs/api-reference.md#request-id-and-inline-cost (read 2026-11-03). A proposed `docs/hybrid-mode-protocol.md` source was unavailable (404) and was not used as evidence.

## Next step and stop condition

Obtain issuer-supported evidence for the first uncertain request before changing the held reservation. Without an authoritative result, remain blocked and do not resend. Do not claim complete dual-model acceptance or native guardrails/tool execution.

## Delayed issuer trace observed after initial timeout

At 04:10 UTC the setup worker refreshed the native issuer UI and found the one matching request, ID `32e7a581-3d83-48c7-b588-cc98764a9254`, reported **Success**, provider DeepInfra, model `Qwen/Qwen3.5-35B-A3B`, duration **68 seconds**, 547 input tokens and 1400 output tokens. The UI displayed total **$0.0015**, with meter amounts input $0.0000766 and output $0.0014. These displayed values are not an exact wire `cost_usd` settlement string; do not substitute the rounded total for authoritative settlement. The browser displayed start time 2026-11-03 13:08:50.139 without verified timezone, so it is not represented as UTC.

This later evidence supersedes any inference from the earlier empty usage list: the issuer reports completed model execution. The client still has no recovered response/citations or exact billed settlement. The immutable original timeout artifact remains unchanged, **$0.05 remains unsettled**, and no reviewer or retry was sent. Preserve the two observations separately: client timeout versus delayed issuer-reported success. Dual-model acceptance is still incomplete. Next step is to recover authoritative settlement and response evidence without resending inference.
