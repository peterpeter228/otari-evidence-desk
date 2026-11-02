# Acceptance record

2026-11-02, Node 24.22.1 / npm 11.9.0, local implementation workspace.

## Executed

- `npm install --package-lock-only --ignore-scripts`: passed; zero dependencies. npm emits environment `http-proxy` deprecation warning (not an application failure).
- `npm test`: **51 passed, 0 failed**.
- `npm run check`: all nine application JS files syntax checked successfully.
- HTTP integration test: loopback server, status route, all 3 assets, full 2-source fixture POST, both role traces, conservative insufficient conclusions.
- Test coverage includes fabricated source IDs/quotes, duplicate/missing review, contradictory review preservation, input limits, concurrent budget reservations, unknown pricing/billing, no retry on network failure, prompt-injection strings cannot set fixture configuration, private/mixed DNS/address filtering, pinned resolution, redirects, unsupported types, oversized streams, Host/Origin checks.
- Fixture tests use synthetic data and fake injected fetch responses. They are not hosted gateway proof.

## Not passed / blocked

- Actual browser QA passed exercised offline workflows after fixes: source/question/title edits invalidate reports, add/remove IDs stay aligned, three curated verdicts are disclosed, JSON/Markdown downloads match, safe URL errors and server failure/recovery behave correctly. See [browser QA](qa/BROWSER_QA.md) and sanitized page-only screenshots. Widths 1165 and 485 px tested; no claim of 375 px or full accessibility audit. Initial direct sandbox attempts failed; successful testing used the cloud-native terminal and Chromium.
- HTTPS public-site import not exercised against a real external site; mocked transport checks plus local HTTP app checks only.
- No actual Otari API call, model catalog authentication, hosted guardrail, native tool, native fallback or native budget test. No expenditure.
- No build/bundle command required: static browser ES module and native Node ESM. Syntax check is not a typecheck; no TypeScript or lint framework is claimed.
- No public deployment, public repository access validation, owner video, contest submission or scoring claim.

## Reviewer cautions

Exact quotes verify provenance only. The fixture cannot reason and marks arbitrary-input conclusions insufficient; exact synthetic demo texts use clearly labeled predefined supported/contradicted/insufficient expectations. Local budget is in-memory/single-process; live server remains disabled pending durable reconciliation. Native HTTP adapter is scaffold; configurations need deployed-schema and pricing validation before credentials/inference.

## Independent review fixes

Fresh-agent pinned DNS lookup now honors Node 24 `options.all`; actual HTTPS lookup contract regression passes. DNS cap and whole-fetch deadline prevent indefinite source locks. IPv4-only dialing rejects mixed private A answers; AAAA is never dialed. Unknown cost freezes the local user and stops the next paid role. Rejected streams are destroyed instead of drained. These controls were independently rechecked before the final fixture/UI enhancements.

## Private acceptance-runner tests

Added opt-in/missing-key pre-network rejection, durable crash reservation freeze, exclusive lock, cross-run/restart $1 cap, invalid ledger total rejection, unknown billing request-ID persistence, immutable blocked-run evidence, known-secret redaction, two-call bound, explicit JSON/native-guardrail contract, unknown/stale pricing and no-inference discovery. These are offline injected transport tests, not hosted proof.

## Enrollment helper offline tests

Dummy-only temporary-file tests verify no secret echo, mode 0600, exact Host/Origin and nonce checks, CRLF rejection, no credential GET route, no overwrite, and timeout shutdown. No actual project key or `.env.live` was read/written by these tests.

No-write probe regression accepts only the exact expected public model ID and needs no destination; mismatches cannot install credentials.
