# Private local live demonstration

Default `npm start` remains the unchanged fixture-only server. The separate live-local server binds **127.0.0.1 only**, defaults to port 8788, and never infers during startup, page load, GET, status polling or replay. No public deployment is included.

## Launch

From the repository root, with Node >=24:

```sh
# Read-only replay; does NOT load credentials or permit inference.
node src/live-local.js --live-local --replay-only --port=8788 --replay-file=acceptance.VERIFIED-UUID.json --replay-sha=VERIFIED_SHA256

# Explicit live-capable mode; still no inference until the button POST.
node src/live-local.js --live-local --port=8788 --replay-file=acceptance.VERIFIED-UUID.json --replay-sha=VERIFIED_SHA256
```

Replace placeholders only with an operator-verified existing synthetic artifact's exact basename and SHA-256. Actual filename must match `acceptance.[hex-and-hyphens].json`; hash must be 64 lowercase hexadecimal characters. Paths are always under this project's `.private/`. No frontend path, model, URL, key, account or budget inputs exist. Replay hash is checked before bounded schema projection; a replay also requires its synthetic semantic gate to have passed. Replay says **Saved live result · replay · no new model calls**, retaining original run ID/time.

Live-capable startup validates `.otari-live.json` before loading only its fixed project credential file, which must be a regular non-symlink file with mode 0600. It uses the existing reviewed acceptance runner, exact approved models, private durable ledger and budget limits. No other project's credentials or environment fallback are allowed in this server. There is no paid top-up, new credential, public publishing or external action.

## HTTP/security contract

- `GET /live/status`: operation state, server-generated ID and per-process CSRF nonce; no key/config/path.
- `GET /live/replay`: allowlisted historical sanitized result, no calls.
- `GET /live/result`: persisted result only, no calls.
- `POST /live/run`: exact same-origin browser request, JSON object containing only `operationId` and `csrf`; triggers the fixed synthetic acceptance only.
- Exact `Host: 127.0.0.1:<bound-port>` is required. POST also requires exact `Origin: http://127.0.0.1:<bound-port>`; absent, null and foreign origins fail. Nonce, input-size and field allowlists apply. No CORS permission or automatic retry.

A singleton exclusive lock and fixed `.private/live-local-operation.json` protect one fresh operation. A durable pending record is written/fsynced and the directory fsynced **before dispatch**. Duplicates return existing status; changing the client ID does not authorize a fresh operation. Completed records survive restart as read-only results. Pending records become uncertain on restart and never resume. Unknown costs, runner errors or result-persistence errors consume/freeze the operation. Failed claim persistence never dispatches. Stale locks fail closed and are not automatically removed. There is no reset endpoint; do not delete records or locks to manufacture another run. Any future campaign migration requires separate operator review/authorization and reconciliation.

The application is not proof of general semantics: the UI shows claims, cross-source conflicts, uncertainty, the synthetic semantic gate and exact provider traces. This-run cost and cumulative settled ledger spend are separate; unknown cumulative cost remains unknown. Native tools and guardrails are not claimed.

## Verification

Offline HTTP tests use synthetic injected runners only. Coverage includes absent/null/foreign origins, Host, CSRF, wrong operation IDs, unexpected fields, oversized/cancelled bodies, simultaneous duplicates, restart pending/completed, malformed state, singleton lock, unknown-cost/throw freezes, claim/result persistence failures, replay hash/schema, redaction and no automatic inference. Browser interaction and live execution require separate evidence; test success does not prove either.

## Stopping safely

Ctrl-C/SIGINT or SIGTERM closes the server. When no runner is pending, the process releases its own singleton lock, so replay-only mode can be stopped and live-capable mode started without clearing files. If dispatch is pending, the durable claim and lock remain; startup fails closed until an operator reconciles actual provider activity. Do not kill a pending run merely to restart it. Neither a crash nor graceful stop authorizes a second charge.
