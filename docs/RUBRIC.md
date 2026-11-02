# Honest rubric mapping

Sources: https://otari.ai/devs-wilding and official linked rubric https://docs.google.com/document/d/1-spnCZ3f2SSki8cb6FnochjchdyttUsjjxfoE6aBnF4/edit . Official technical references: https://github.com/mozilla-ai/otari/tree/main/docs . Read 2026-11-02; hosted deployment not verified.

| Requirement / possible rubric item | Current evidence | Status |
|---|---|---|
| Meaningful open-weight model, 20 | Adapter + fixtures only | planned, no earned score claimed |
| Second distinct open-weight model, 10 | Two role contracts, independent source review prompt | implemented_mock |
| Multimodel roles, advanced 10 | Pipeline tests; no real two-model run | implemented_mock |
| Guardrails, advanced 10 | Application citation/input checks; native block payload scaffold | native unverified |
| Web fetch, advanced 10 | Safe local importer only | native planned |
| Budgets, advanced 10 | Local reservations + unknown billing tests | native planned |
| Routing/fallback, advanced 10 | Header preservation, no blind app retries | native planned |
| Code execution / MCP / native per-user budgets | Out of first MVP scope | not claimed |
| Working app 5 / clear demo 5 | Local fixture app, owner demo missing | partial, not earned score |

Advanced items cap at 60; judges decide. Do not convert theoretical coverage into a guaranteed score or probability. Required hosted real usage, public repository, branch and first integration commit, actual feature list, truthful issues/PR list, 3–5 minute owner screen/voice demo and feedback are still gating.
