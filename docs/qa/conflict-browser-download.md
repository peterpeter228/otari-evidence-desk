# Evidence Desk brief

Mode: OFFLINE_FIXTURE
Run: 4134f04c-5b59-481d-a5f6-dc70a5adb0a2

## Question
Compare Atlas and Boreal retention, CSV export and monthly price. Identify contradictory evidence and what we cannot conclude.

## Claims

### source-supported: Atlas retains activity records for 30 days.

CURATED FIXTURE EXPECTATION, not AI: this source states this period; the cross-source conflict is listed separately.

> Atlas retains activity records for 30 days.

Source: S1 · Atlas — synthetic product policy

> Atlas retains activity records for 14 days.

Source: S3 · Atlas — synthetic help page

### source-supported: Atlas supports CSV export.

CURATED FIXTURE EXPECTATION, not AI: this literal statement is present in the synthetic source; truth and freshness are not established.

> Atlas supports CSV export.

Source: S1 · Atlas — synthetic product policy

### source-supported: Atlas costs $20 per month.

CURATED FIXTURE EXPECTATION, not AI: this literal statement is present in the synthetic source; truth and freshness are not established.

> Atlas costs $20 per month.

Source: S1 · Atlas — synthetic product policy

### insufficient: Boreal retains activity records for 90 days.

CURATED FIXTURE: this sentence does not establish a product comparison.

> Boreal retains activity records for 90 days.

Source: S2 · Boreal — synthetic product policy

### source-supported: Boreal supports CSV export.

CURATED FIXTURE EXPECTATION, not AI: this literal statement is present in the synthetic source; truth and freshness are not established.

> Boreal supports CSV export.

Source: S2 · Boreal — synthetic product policy

### source-supported: Boreal costs $35 per month.

CURATED FIXTURE EXPECTATION, not AI: this literal statement is present in the synthetic source; truth and freshness are not established.

> Boreal costs $35 per month.

Source: S2 · Boreal — synthetic product policy

### source-supported: Atlas retains activity records for 14 days.

CURATED FIXTURE EXPECTATION, not AI: this source states this period; the cross-source conflict is listed separately.

> Atlas retains activity records for 14 days.

Source: S3 · Atlas — synthetic help page

> Atlas retains activity records for 30 days.

Source: S1 · Atlas — synthetic product policy

### source-supported: Atlas supports CSV export.

CURATED FIXTURE EXPECTATION, not AI: this literal statement is present in the synthetic source; truth and freshness are not established.

> Atlas supports CSV export.

Source: S3 · Atlas — synthetic help page

### insufficient: This synthetic source deliberately conflicts with the product policy.

CURATED FIXTURE: this sentence does not establish a product comparison.

> This synthetic source deliberately conflicts with the product policy.

Source: S3 · Atlas — synthetic help page

## Cross-source conflicts
Reviewer assessment; semantic accuracy not independently proven.

Atlas retention is 30 days in S1 and 14 days in S3.
- S1: Atlas retains activity records for 30 days.
- S3: Atlas retains activity records for 14 days.

## Sources
- S1: Atlas — synthetic product policy
  URL: pasted text
  Retrieved: 2026-11-03T04:23:07.845Z
  SHA-256: ec9d8d7112bd1bc8d89a6ab62370eef48dfceac3455a3edf5f8202523f11a86c
- S2: Boreal — synthetic product policy
  URL: pasted text
  Retrieved: 2026-11-03T04:23:07.848Z
  SHA-256: cc14e97dbaff77e95f77c656bff601dd7022ff7ec74fba79df32385823773f7e
- S3: Atlas — synthetic help page
  URL: pasted text
  Retrieved: 2026-11-03T04:23:07.848Z
  SHA-256: 2f8f18b98235150dbc58038717b73f23d7b154e9e66bfaabc030eb9a5b6cc2de

## Uncertainties
- CURATED OFFLINE FIXTURE: verdicts are predefined expected outcomes for these exact synthetic texts, not model reasoning.
- Source authority, freshness, missing criteria and the final comparison require live independent review.
- Cross-source conflicts remain unresolved even where individual quotations are source-supported.
- Some claims are contradicted or insufficient; do not treat this report as a verified recommendation.

## Trace and budget
```json
{
  "trace": [
    {
      "role": "extractor",
      "modelRequested": "fixture:not-a-model",
      "modelServed": null,
      "requestId": null,
      "actualCostUsd": 0,
      "pricingSource": "no network/model call",
      "mode": "OFFLINE_FIXTURE",
      "nativeToolCalls": []
    },
    {
      "role": "reviewer",
      "modelRequested": "fixture:not-a-model",
      "modelServed": null,
      "requestId": null,
      "actualCostUsd": 0,
      "pricingSource": "no network/model call",
      "mode": "OFFLINE_FIXTURE",
      "nativeToolCalls": []
    }
  ],
  "budget": {
    "kind": "fixture: no model calls",
    "actualCostUsd": 0
  }
}
```

Quotes are source matches, not guarantees of truth.