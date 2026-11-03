# Private opt-in acceptance runner

Implemented but **not live verified**. No model/key access was used to implement or test this runner. The web server stays permanently `OFFLINE_FIXTURE`. Tests inject synthetic network responses; test execution is not live gateway evidence.

## Preconditions

The operator must have explicit approval for the dedicated credential and inference, issuer-verified $1 no-reset native cap restricted to the exact two approved model IDs, and gift-credit-only use with no paid top-up. Configuration fields are an operator attestation, **not independent proof that the issuer enforced a budget or that pricing is complete**. Verify those controls in the issuer UI before running. The application cannot guarantee zero cost beyond a provider-enforced cap.

Use only the dedicated, ignored project `.env.live` with `OTARI_API_KEY=...` (mode 0600), the dedicated `.secrets/otari-api-key` file, or explicitly supplied `OTARI_API_KEY`. Never search other projects or global credentials. The CLI does not read a secret until `--live` and configuration validation pass. Never put the key in command arguments, logs, committed files or browser inputs.

Create ignored `.otari-live.json` from `docs/live-config.example.json`, filling verified values. It must not contain `apiKey`. Do not change `authorized` merely to get past validation without actual authorization.

```sh
# Does nothing without --live; missing authorization/key fails closed.
npm run acceptance
# Read-only authenticated model/tool discovery. No inference, no liveReady claim.
npm run acceptance -- --live --discover
# Full preflight with pricing/schema controls, still no inference.
npm run acceptance -- --live
# Explicitly authorized synthetic-only two-call run.
npm run acceptance -- --live --execute
```

Discovery may be used to obtain pricing metadata before a complete pricing snapshot exists. Inference requires a snapshot verified within 24 hours, both prices, full fee coverage, context limits and verified JSON-mode compatibility. Structured-output UI support alone is not proof that a specific `json_object` request succeeds: unsupported requests fail closed, with no automatic alternate-format resend.

`nativeGuardrailMode` must be explicit: `required-block` requires verified availability and sends the native block profile; `off-unverified` deliberately omits native guardrails and reports that they are not verified. This is never an automatic fallback. Local source/citation checks remain separate and do not imply semantic safety.

## Limits and accounting

- Only the built-in synthetic 3-source fixture can be sent by this acceptance runner.
- Maximum 2 inference requests, output maximum 1400 tokens per request.
- Conservative input upper bound: UTF-8 byte count of payload/system prompt + 1024 overhead tokens; reject if context or verified price bound exceeds $0.05.
- Reserve $0.05 before each call, $0.10 maximum per run and $1 cumulative for the fixed local identity across restarts. Native budget is a separate required control.
- Durable reservation is flushed before dispatch. Crash-reserved entries become unsettled on next open. Unknown costs, unknown outcome or actual cost exceeding reservation freeze new calls pending manual reconciliation.
- The exclusive `.private/ledger.json.lock` is not automatically cleared if stale. Inspect prior process and issuer activity before any manual recovery; never delete the ledger to reset a limit.
- Ledger is atomic-written and validates per-user sums against reservations. It is local accounting, not tamper-proof authenticated tenancy.
- Evidence is immutable per-run `.private/acceptance.UUID.json`; blocked retries cannot overwrite prior reconciliation evidence. Request IDs are retained in the durable reservation as well as reports. Known key bytes are redacted if echoed.
- No automatic reconciliation, retry, reroute or budget reset is implemented. Read issuer usage by request ID with explicit authorization before repairing an unsettled record.

Current host/auth drift is explicit: `https://otari.ai/api/v1` + `Otari-Key` observed in hosted UI; the API subdomain/Bearer configuration exists for verified deployment compatibility, never automatic fallback. Only the issuer's two allowed origins are accepted.

## Temporary native-model-scope limitation

The hosted key picker rejected catalog IDs as invalid provider prefixes before creating a key. On 2026-11-02 the owner explicitly approved a temporary platform All models key, still bound to the $1 no-reset budget and expiry. This is **not native two-model restriction**. Evidence must say `not_enforced_user_approved_temporary`. The private CLI hardcodes the only permitted roles: extractor `alibaba/qwen-3.5-35b-a3b`, reviewer `openai/gpt-oss-20b`; any other model, alias or swapped role is rejected before reading the dedicated key or making discovery/inference calls. The generic reusable provider is not the approved execution entrypoint. Do not use this temporary credential in any other tool or project.

## Served-model and finite-billing checks

Requests are hard-restricted to the two approved role IDs. Responses must also identify the same role model via `Otari-Model`, or `body.model` when the header is absent. Only exact canonical IDs or independently verified same-model DeepInfra selectors are accepted; no arbitrary prefix stripping or alias guessing. Missing or mismatched identity stops the run before a second inference. Known finite reported cost/request ID are retained even if output JSON or identity validation fails. Missing billing remains unsettled and frozen. These checks have offline regressions; they do not claim a real response was received.

## Read-only discovery deadline and diagnostics

Each models/tools GET has a default 20-second deadline, configurable via `preflightTimeoutMs` only from 1 to 20000 milliseconds. The same abort signal covers response-body parsing. Errors expose only endpoint-specific timeout, transport, invalid-JSON or HTTP-status codes; raw transport/parser messages and response fragments are never surfaced. Discovery makes one attempt per endpoint and stops on failure. Inference remains at 25 seconds with no retries and unchanged model/budget restrictions. The catalog GET result does not verify inference or pricing completeness.

## Inline cost contract

The official API reference defines paired `usage.cost_usd` (a nonnegative six-decimal USD string) and `usage.pricing_source`. The adapter accepts strict six-decimal strings with a lowercase/underscore source tag of length 1–32 and a safe integer micro-dollar magnitude. Missing or invalid pairs remain unknown and freeze accounting. A priced `"0.000000"` with a valid source is legitimate rounded zero; a zero without its source is not proof of free usage. The original string is retained alongside the numeric accounting amount. Old numeric-only mock fixtures were corrected to the documented wire format rather than silently widening production parsing.

Reference checked 2026-11-03: https://github.com/mozilla-ai/otari/blob/main/docs/api-reference.md#request-id-and-inline-cost
