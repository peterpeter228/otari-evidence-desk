# Otari integration feedback — internal draft, not sent

Observed 2026-11-02. This is an implementation log for later owner feedback, not a submitted issue or a claim of completed live integration. No credential, account ID, email, customer data or private budget identifier belongs here.

## Concrete friction observed

1. **Hosted URL/auth differs from some repository examples.** Current hosted onboarding showed `https://otari.ai/api/v1` with `Otari-Key`; repository material also described the API subdomain and Bearer conventions. We made origin/header choice explicit rather than retrying credentials against alternate endpoints. Suggest one deployment-specific, copyable configuration contract.
2. **Model picker versus restricted-key validation.** Selecting public catalog IDs for the two approved models in the key creation UI produced: `alibaba/qwen-3.5-35b-a3b: unknown provider or instance alibaba`. The attempt was rejected before a new key was created. Current official `model_access.py` validates allow-list entries as canonical `instance:model`, whereas catalog IDs may be `vendor/model`. This is consistent with a selector mismatch; the actual deployment's implementation/version still needs confirmation. We did not broaden to all models or guess a wildcard. Suggest the key picker submit the offering's canonical scope and show the effective restriction before creation.

Sources: [official model selector documentation](https://github.com/mozilla-ai/otari/blob/main/docs/models.md), [official allow-list validation](https://github.com/mozilla-ai/otari/blob/main/src/gateway/services/model_access.py), hosted UI observed by the authorized setup worker.

## Required owner feedback questions — draft answers

- **Tempted to bypass the gateway?** Not bypassed. Configuration drift and scoped-key selection friction required additional verification before the first inference. This is not evidence about latency, reliability or answer quality.
- **What glue code was necessary?** Explicit provider configuration/discovery, exact quote validation, conservative local durable reservations, immutable request-ID evidence and unknown-cost freeze. App-side controls are not native Otari feature claims.
- **Would we continue using Otari?** Undecided until real model requests, model provenance, billing and native feature behavior are verified. Do not replace this with a favorable claim merely for scoring.

Update this draft only from real subsequent observations. Obtain owner authorization before posting an issue or sending feedback; no external post has been made.
