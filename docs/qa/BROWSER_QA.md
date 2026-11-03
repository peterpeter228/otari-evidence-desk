# Actual browser QA — 2026-11-02

Tested 16:55–17:02 UTC by a separate QA agent using CUA cloud Chromium against `http://127.0.0.1:8787/`. Node was started in the cloud-native terminal from the shared workspace (not an external deployment). No provider call, key, sign-in, payment, or contest submission was performed. No DevTools bypass or browser security change was used.

## Verified through the actual browser
- Loaded synthetic example and ran three-source review. Curated offline fixture renders source-supported, contradicted, and insufficient outcomes. Every curated verdict explicitly says it is predefined fixture behavior, not AI. Contradicted Atlas retention shows both 30-day and 14-day quotes with source titles.
- Ran a two-source review after removal, and arbitrary edited inputs. They remain insufficient under deterministic fallback; no invented live reasoning.
- Edited source text, question, and source title after a completed run: final implementation hides prior result/export immediately. Initially stale result remained; engineer fixed this and QA retested.
- Removed third source and added a new one: initial S4 input / S3 result mismatch was found and fixed. Final browser recheck confirms input and report both S3 with matching title and quote.
- Add capped at three sources. Empty question and missing new-source title trigger browser required-field validation. HTTP loopback URL is rejected with URL_POLICY; the error clears previous output and the form remains usable.
- Double-clicked Review evidence; completed without duplicate visible cards. This does not establish paid-call concurrency behavior.
- Navigated How it works and browser Back. Reload resets inputs/results to a fresh workspace, with no stale brief reappearing.
- Stopped only the local QA server and submitted: visible Failed to fetch, no stale result. Restarted same server and reran successfully.
- OFFLINE FIXTURE / NO MODEL CALLS and NOT LIVE VERIFIED labels are visible. Trace explicitly contains fixture:not-a-model and zero offline model cost.
- Downloaded JSON and Markdown with actual browser controls. Final run ID `c8770ddb-f499-4255-9e7c-c7420f957299`; 9 claim texts/reasons, question, source titles/quotes and statuses agree across UI and exports. Markdown duplicate identical quotes/source-title omissions found earlier were fixed; final export uses source-supported human label. JSON retains canonical supported enum.
- Ordinary OS window resizing tested document widths 1165 px and 485 px. Read-only DOM measurement found scrollWidth equals clientWidth at both widths. Inspected screenshots: no horizontal overflow; narrow form and result controls stack and remain readable. This is not a 375 px/device-emulation claim.

## Evidence artifacts
- `result-final-desktop.jpg`: actual page-only full-page screenshot, 1165×3418.
- `result-final-narrow.jpg`: actual page-only full-page screenshot, 485×4559.
- `form-narrow.jpg`: actual empty form screenshot, 485×1861.
- `browser-download.json`, `browser-download.md`: actual downloaded synthetic report. No personal or account data.

## Explicitly not browser-verified
- Budget exhaustion: permanently zero-cost fixture UI has no route to exhaust paid budget. Unit/integration results are separate evidence, not a browser pass.
- Live hosted Otari model discovery, two-model execution, semantic correctness, native tools/fallback/guardrails/budgets and billing.
- External source fetch success, mobile touch devices, 375 px viewport, full keyboard/a11y audit, malicious oversized POST bodies and paid concurrency.

Verdict: offline demonstration UI is usable for the exercised workflows after fixes. This is not hosted integration or contest submission readiness.

## 2026-11-03 conflict fixture regression

Actual cloud browser clicked synthetic example → Review, showing faithful source-supported claims and a separate S1/S3 30/14 conflict. Markdown and JSON exports were downloaded and read back; conflict-browser-download.md/.json preserve the fixture outputs. Invalid question `short` hid old results and showed the 8–1000 validation error. Example reload and repeat review recovered. Screenshot conflict-fixture-browser.jpg records the fixture conflict UI. This does not test live model inference in the UI.
