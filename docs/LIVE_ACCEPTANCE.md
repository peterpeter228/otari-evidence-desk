# Live acceptance gate — NOT YET PASSED

1. Explicit permission for credential setup and capped inference; safely configure outside repository. No credentials are currently loaded.
2. Read deployed OpenAPI on the explicitly selected hosted origin; current onboarding shows `https://otari.ai/api/v1` plus `Otari-Key`, unlike public docs using the API subdomain/Bearer. Select exactly one origin/path/header scheme from verified deployment evidence; never retry inference against alternate hosts/auth schemes.
3. Authenticated discovery `GET models` and `GET tools`. Select two distinct reachable open-weight IDs, record official model cards/licenses. Check context limits and real price schedule.
4. Define conservative whole-request reservation including prompt/output/tool billing. The private CLI now has a durable ledger and restart freeze; exercise actual native billing and manual reconciliation before any HTTP live serving. The web UI remains fixture-only.
5. Verify guardrail profile block availability. `unavailable`, HTTP 502 or missing evidence is not success.
6. Two role calls with request IDs, served models, usage and actual cost or explicit pending reconciliation. The app does not implement automatic retries/fallback.
7. For unknown billing, reconcile `GET /api/v1/usage/requests/{request_id}` if request ID exists; otherwise manual activity reconciliation. Do not reissue an uncertain call.
8. Native fetch only after `available:true`, safe domain constraints, native tool output and evidence of actual usage. Current URL importer is local application code.
9. Native routing policy/budget execution needs real configured-policy evidence and a safe rejection scenario; local tests do not satisfy it.
10. Sanitize persisted logs, review public-ready files, confirm contest branch + first adapter commit, publish only after authorized readiness check, record owner demo and feedback.

Current local adapter sends native block guardrails, but this is an untested protocol integration scaffold, not live verification. Native fetch, native budgets and native route-policy configuration remain TODO. No arbitrary code execution is planned.
