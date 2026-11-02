# One-shot private credential enrollment

A separate loopback helper exists solely for an already authorized dedicated Otari project key. It is not part of the public/fixture application and does not create a credential, authenticate with Otari, redeem credit or make model calls.

**Requires authorization and independent review before real use.** Development tests use dummy strings in isolated temporary files, never the actual project `.env.live`. A browser nonsecret rehearsal uses `--probe`: only the exact public model ID `openai/gpt-oss-20b` is accepted and no file is written. The production CLI never accepts a destination override.

```sh
# First: approved nonsecret browser-copy rehearsal, no file write.
npm run enroll -- --probe
# Only after rehearsal + authorization: dedicated key enrollment.
npm run enroll -- --enroll
# Fixed loopback URL: http://127.0.0.1:8790/
```

The helper serves a password form for two minutes. Paste only the dedicated restricted project key via the browser's normal copy/paste interaction. Never retrieve clipboard contents in a script, expose the input value through DOM inspection, capture developer network request bodies, paste a key into chat or include it in a command. After pasting, inspect only generic success/failure status, not input/clipboard contents.

Controls: exact loopback Host and same Origin; hidden random CSRF nonce; CSP forbids external loads and framing; no-store; 1024-byte request limit; strict single key/nonce fields, bounded RFC6750 token characters, and no whitespace/CRLF/quotes; exclusive `wx` write to the fixed project `.env.live` with 0600 mode; no overwrite; no GET credential route; no key logging or echo. Successful submission closes the listener. Timeout closes connections. Existing/partial configuration is not silently replaced.

The secret stays on loopback and local disk, not a hosted web endpoint. Local same-user malware or a compromised browser/OS is outside this helper's protection. Do not expose port 8790, bind to all interfaces, proxy the route or leave the listener running. If secure browser copy/paste is unavailable, stop and ask for a supported secure handoff rather than extracting the credential through screenshots, DOM or model-visible tool output.

## Browser Origin compatibility correction

A real **nonsecret** form rehearsal observed `Origin: null` with `Sec-Fetch-Site: same-origin`, while Host/method/path were valid. The original `Referrer-Policy: no-referrer` causes this for navigation-mode form POSTs. The helper now sends `Referrer-Policy: same-origin`: same-origin forms retain their real Origin and cross-origin requests still receive no referrer. Exact Origin/Host/nonce checks remain unchanged; `Origin: null` and cross-site requests still return 403. Probe-only diagnostics expose categorical transport state, never a request body or credential.

Reference: [MDN Referrer-Policy — Effect on the Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy#effect_on_the_origin_header), checked 2026-11-02. A successful nonsecret browser rerun is still required before any real enrollment.

2026-11-02 17:39 UTC: independent setup worker reran the actual same-browser public-model-ID copy/paste path after the header correction. The protected form reported **NONSECRET PROBE PASSED**, exact expected public ID received, no file written, listener closing. This proves the rehearsed transfer path only; it is not real credential installation, issuer authentication or a model-call test.

## Stale clipboard protection

A subsequent real-mode attempt received the old **public probe model ID**, not a credential. The setup worker verified only the exact nonsecret marker, removed only that invalid file, and made no authenticated API call. Real enrollment and both CLI paths now reject that marker before file creation or network dispatch.

The format gate accepts only the `otk_v1_` hosted family with a bounded nonempty token body. This family is based on the earlier **masked hosted setup-guide field** (`otk_v1_us_`), not inspection of a current plaintext key. It is a format plausibility check, not authentication, entropy verification or proof of active scope/budget. The [open-source default format adapter](https://github.com/mozilla-ai/otari/blob/main/src/gateway/adapters/api_key_format_adapter.py) instead mints `tk-` keys and is explicitly pluggable; it does not prove the hosted format.

For an approved future rotation, keep the one-time display open until: (1) the issuer's Copy Secret completion signal is visible, (2) the local helper confirms safe storage and a boolean-only format/permission check passes, and (3) an authorized read-only issuer preflight succeeds. Do not inspect or echo the copied secret. If storage contains a known public marker, reject it rather than sending it to the issuer. Any new rotation requires its own authorization.
