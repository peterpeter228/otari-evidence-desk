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
