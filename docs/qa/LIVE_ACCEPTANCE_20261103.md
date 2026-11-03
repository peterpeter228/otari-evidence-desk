# Live acceptance — 2026-11-03

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
