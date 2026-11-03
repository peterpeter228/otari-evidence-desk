# Honest rubric mapping

Sources: https://otari.ai/devs-wilding and official linked rubric https://docs.google.com/document/d/1-spnCZ3f2SSki8cb6FnochjchdyttUsjjxfoE6aBnF4/edit . Official technical references: https://github.com/mozilla-ai/otari/tree/main/docs . Rules last checked 2026-11-02. Technical evidence updated 2026-11-03; recheck organizer rules before submission.

| Requirement / possible rubric item | Current evidence | Status |
|---|---|---|
| Meaningful open-weight model, 20 | Real hosted Qwen extraction with model/provider/request/cost evidence | technical evidence verified; judges decide score |
| Second distinct open-weight model, 10 | Real hosted GPT OSS independent review and cited cross-source conflict | narrow synthetic acceptance verified; judges decide score |
| Multimodel roles, advanced 10 | Real two-stage CLI run with separate role traces, citations and conflict evidence | technical evidence verified; no guaranteed rubric credit |
| Guardrails, advanced 10 | Application citation/input checks; native block payload scaffold | native unverified |
| Web fetch, advanced 10 | Safe local importer only | native planned |
| Budgets, advanced 10 | Native $1 no-reset budget configured; local reservations and exact request settlement verified | native limit enforcement not exercised; no earned score claimed |
| Routing/fallback, advanced 10 | Header preservation, no blind app retries | native planned |
| Code execution / MCP / native per-user budgets | Out of first MVP scope | not claimed |
| Working app 5 / clear demo 5 | Local fixture app, owner demo missing | partial, not earned score |

Advanced items cap at 60; judges decide. Do not convert theoretical coverage into a guaranteed score or probability. Hosted real usage and a first-integration code commit are recorded. Public judge access, the final feature/issue/PR list, a 3–5 minute participant-owned screen/voice demo, feedback and a verified submission receipt remain gating. Local live UI development is a separate milestone; do not confuse replay with new inference. See the dated live acceptance report for exact scope.
