# Otari Evidence Desk

A small, evidence-first comparison desk: import up to three public source texts or HTTPS pages, inspect cited claims, challenge the claims independently, and export a traceable research brief.

**Current status: hosted dual-model CLI transport and one uncoached synthetic conflict case passed. Default web UI remains OFFLINE_FIXTURE; separate private local UI and historical replay are verified, but fresh UI completion is blocked before inference. NOT submission-ready; general semantic accuracy and native advanced features remain unverified.**

On 2026-11-03 a generic-prompt live run preserved eight source-attributed claims and separately identified the Atlas retention conflict using exact 30-day and 14-day source citations, without an expected-answer prompt or explanatory source cue. This is one narrow synthetic case, not a reliability benchmark. All ten integration calls settled to $0.006841. Automated checks:106/106; actual offline browser conflict flow, exports and error recovery verified. See [live evidence and limits](docs/qa/LIVE_ACCEPTANCE_20261103.md) and [local UI QA](docs/qa/LIVE_LOCAL_QA_20261103.md).

## Run locally

Requires Node.js 24+. No third-party runtime or development dependencies.

```sh
npm ci
npm test
npm run check
npm start
# http://127.0.0.1:8787
```

Use the synthetic example, then run the review and download JSON/Markdown. The server is loopback-only, rejects foreign Host/Origin, never loads API keys and never turns live because an environment variable exists. Do not expose it as a multi-user service.

## Flow

1. Validate question and 1–3 sources; capture URL, timestamp, SHA-256 and the imported textual snapshot. URL HTML is stripped/whitespace-normalized; the hash covers this snapshot, not raw HTML.
2. Extract atomic claims with exact source IDs and quotes.
3. Independently challenge every claim using original sources.
4. Deterministically check citation existence, exact quote, unique IDs and complete review.
5. Show supported/contradicted/insufficient claims, unknowns, model/cost trace and export.

In fixture mode steps 2–3 are deterministic non-model fixtures. Live mode is dependency-injected and requires explicit setup; it cannot fall back silently to fixture. No native score is claimed.

## Boundaries

- Public/non-sensitive research only. No financial advice, audit assurance or customer records.
- Sources are untrusted input, not instructions. System prompts and exact-citation validation are separate application defenses, not a guarantee against injection.
- URL import: HTTPS, no credentials/query/fragment/custom ports; rejects private/reserved destinations and any mixed public/private IPv4 A answers (AAAA is never dialed); IPv6 import is disabled in this MVP; pins resolved IPv4; rejects redirects; 24 KB limit, 7-second whole-fetch deadline (including a 2-second DNS cap), text only. This restrictive importer is **not Otari native web fetch**.
- The web fixture has in-memory local safeguards; the opt-in CLI has durable reservations and an exclusive lock, **not authenticated user isolation or native Otari budgets**. Unknown pricing fails closed; unknown billing holds reservations. The CLI preserves reserved/unknown amounts across restart; the separate opt-in loopback live UI uses one durable operation and exact origin/CSRF checks. Its first fresh attempt failed at read-only preflight with zero new inference. See [private runner](docs/LIVE_RUNNER.md).
- No automatic inference retry or app fallback. Native fallback requires an independently verified route policy and execution evidence. Missing reported cost remains `null`, not zero.
- No database, telemetry, analytics or public hosted deployment is included. The separately authorized private CLI uses gift-credit-billed inference; the default UI never does.

## Otari integration plan

`src/provider.js` accepts only explicitly configured hosted origins `https://otari.ai` or `https://api.otari.ai` with an explicit `otari-key` or `bearer` auth scheme. On 2026-11-02 the current hosted onboarding UI showed `https://otari.ai/api/v1` and the `Otari-Key` header; public repository docs also describe a different API host/Bearer convention. That original 2026-11-02 UI observation alone was not a successful API call; the 2026-11-03 CLI evidence above now verifies hosted discovery and dual-model transport. No automatic cross-host/auth fallback is allowed. Preflight discovers models/tools, requires two distinct catalog IDs with open-weight evidence and a positive reservation. The adapter supports an explicit native guardrail configuration; tested live runs deliberately used off/unverified. It preserves Otari request/provider/model/fallback/attempt headers and cost metadata.

For each further authorized run, retain verified deployed OpenAPI, model cards, fresh pricing/conservative budget and native budget controls. Native guardrails remain explicitly off/unverified; reconciliation of the earlier timed-out request is recorded. Never put an API key into source, browser, report or chat. See [live checklist](docs/LIVE_ACCEPTANCE.md).

## Competition handoff

- Repository starts private to avoid publishing incomplete or sensitive material. Final rules require public judge-accessible code, contest branch, and first Otari integration commit link.
- Deadline from organizer email: **2026-11-11 23:59 EST / 2026-11-12 12:59 Beijing**.
- Owner must make the real 3–5 minute screen + own-voice demo and honest feedback; no generated video impersonation.
- Prize, eligibility and payment are organizer decisions, not guaranteed by code or rubric mapping.

See [PRD](docs/PRD.md), [STATE](docs/STATE.md), [TASKS](docs/TASKS.md), [ACCEPTANCE](docs/ACCEPTANCE.md), [rubric mapping](docs/RUBRIC.md), and [owner demo rehearsal](docs/DEMO_RUNBOOK.md).

For an already-authorized dedicated key, a separately reviewed [one-shot loopback enrollment helper](docs/KEY_ENROLLMENT.md) is available. Nonsecret browser rehearsal is required before real use; neither helper tests nor preflight establish live model operation.
