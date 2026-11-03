# Private local UI verification — 2026-11-03

## Result
Implemented, independently reviewed and tested. **106/106 offline tests and syntax checks pass.** Real browser replay works. **Fresh browser-to-provider completion remains blocked**, not passed.

The default fixture server is unchanged. A separate explicit opt-in loopback server uses the existing reviewed CLI runner, exact two models, $1 aggregate gifted-credit cap and $0.05 per-call reservations. It permits one durable operation, rejects foreign/absent/null origins, wrong Host/CSRF/IDs and unexpected inputs, and does not infer on startup, reload, replay or polling.

## Real desktop browser observations
- Opened port8788 replay-only; original live artifact hash checked before display.
- Displayed saved live result with original run ID/time, 8 claims/citations, 30-day versus14-day cross-source conflict, uncertainties and model trace.
- Explicit replay label states no new calls; per-run cost$0.000944 and historical cumulative$0.006841 are separate.
- Fixed the inherited narrow two-column layout; corrected desktop screenshot: `live-local-replay.jpg`. No application error overlay; extension-only console messages were not attributed to the app.
- Clicked safe JSON download. The browser initiated the download; this specific download was not read back from its separate filesystem, so file delivery/content verification is not claimed.
- Reload/replay kept ledger at10 settled calls, no operation record and no new fee.
- Stopped replay-only server gracefully; owned lock was removed without clearing state.
- Started live-capable server; page load left ledger unchanged.
- Clicked fresh comparison once, observed pending/disabled action, then reloaded read-only. Operation froze on models-discovery network failure.

## Failed fresh operation, preserved honestly
See `LIVE_LOCAL_BLOCKED_20261103.json`. Acceptance runner evidence says `PREFLIGHT_MODELS_NETWORK_ERROR`, callsAttempted0, requiresManualReconciliationfalse. Ledger remained10 settled calls/$0.006841, zero new reservations. A separate fixed-host unauthenticated read-only models GET returned TypeError/ECONNREFUSED from the browser-native runtime. No inference request was made and no additional fee was incurred. The consumed record remains frozen; no reset or blind retry occurred.

The browser-native runtime and prior CLI runtime have distinct network namespaces. This result does not invalidate the previous real CLI dual-model evidence, but cannot establish a live UI round trip. Complete that validation in an authorized environment with ordinary issuer connectivity; do not bypass access restrictions or erase the frozen operation.

## Automated and independent review
Real HTTP to actual acceptance-runner with mocked networking now verifies preflight failure classification and zero reservations. Other tests cover simultaneous duplicate requests, reload/restart state, malformed records, singleton lock, unknown-cost freeze, claim/result write failure, redaction, bounded replay and no automatic inference. An independent reviewer read full server, frontend, runner credential boundary, prompts and tests, then reran106 tests and syntax checks.

## Remaining scope
Fresh UI completion, mobile live-UI layout, this export readback and restart-completed browser behavior were not verified here. General semantic accuracy, production readiness, native tool/guardrail/routing enforcement, public judge access, owner recording/feedback and contest submission are not claimed. See `../LOCAL_DEMO_RECORDING.md` for an honest own-screen/own-voice recording checklist.
