# HALO TraceCore Experimental v0.2.0 — ORA Open Lab

This is a public, offline Node.js tool for planning, checking and summarizing submitted ORA Open Lab v0.3 receipts. It is not an execution service, an attestation authority, a provider identity verifier, a scientific certification or a canonical ORA Core Monarch trace implementation. It adapts explicit evidence-status, integrity and authority-separation principles; the Open Lab and Monarch schemas remain separate.

## Trust model

Use a trusted checkout of the published repository and an auditor-selected 40-character Git commit revision. Choose that revision independently of any submitted receipt. The reference command regenerates the protocol, all eight exact prompts and both rubrics from the local release implementation. It does **not** retrieve or verify the Git commit named by the revision argument. Independently compare the reference protocol digest and prompt/rubric digests with the official Open Lab manifest from that revision, and retain that manifest and source checkout. If the digests disagree, stop; do not relabel the receipt or change the reference to make it pass.

Official entry: https://knowledge.oracorehub.com/open-lab/
Reference manifest: https://knowledge.oracorehub.com/open-lab/manifest.json
Receipt format: https://knowledge.oracorehub.com/open-lab/receipt.schema.json
Readable protocol: [ORA_OPEN_LAB_MACHINE_FIRST.md](ORA_OPEN_LAB_MACHINE_FIRST.md).

The public gateway has no model execution endpoint. The following commands run locally and make no network calls. Node.js 22 LTS or a compatible later release is recommended; no external package is required.

## Commands

Run from the repository root, after checking out trusted source code. Set REV to the independently selected release revision (the source_revision in the retained official manifest, not a value supplied by a participant).

```sh
REV=04f2ea29ad7742c10b4892bf537a7cc430b6a284
node knowledge/halo-experimental.cjs reference "$REV" > reference.json
node knowledge/halo-experimental.cjs plan "$REV" pilot-seed-001 1 > pilot.json
node knowledge/halo-experimental.cjs validate "$REV" receipt.json
node knowledge/halo-experimental.cjs report "$REV" receipt1.json receipt2.json > report.json
node knowledge/halo-experimental.cjs verify-report "$REV" report.json
node --test knowledge/halo-experimental.test.cjs
```

The example revision identifies the original Open Lab v0.3 publication commit. Do not use it automatically for a later deployed snapshot. The planner does not call models. One repetition produces eight planned runs: two cases times four conditions. Keep assignments, seed and method mapping away from the reviewer; supply only anonymous outputs and the appropriate rubric after outputs have been locked. Use a fresh session for each exact prompt. Record model identity, settings and limitations. Keep failures, refusals and unavailable metrics.

## Meaning of outputs

- PASS receipt consistency: required fields, trusted-reference digest, submitted response digest and review consistency pass the adapter checks. This is not proof of execution.
- FAIL / CONFLICT: malformed input or detected inconsistency. Preserve the original input; do not silently repair an experimental record.
- UNB: independent provenance, execution, provider identity, review correctness and session isolation remain unverified. Even a perfectly constructed or rehashed fabricated receipt cannot become eligible for controlled comparison.
- Reports preserve input digests, rejected submissions, reported failures, missing conditions and duplicate flags. They include submitted descriptive scores when complete and a whitespace-based count of received response words. They do not compute effect sizes, validate review judgments, or rank models. Raw responses stay in the local original files. The output includes submitted identifiers/model labels; use pseudonymous identifiers and do not place secrets or personal data in receipts or reports.
- Report SHA-256 is a deterministic integrity checksum of the specified payload, not a signature or proof that the underlying claims are true. Keep an independently retained copy of the digest if later tamper detection is required.

Exit status: 0 for successful command / consistent receipt or report without detected conflicts; 1 for receipt or report conflict or failed report checksum; 2 for input, reference or usage errors. The CLI limits individual input files to 2 MB, aggregate report inputs to 32 MB and report input count to 1,000. Report verification also uses the 2 MB individual input limit; larger generated reports must be split into smaller batches before generation. The adapter's stricter receipt rules (e.g., UTC Z timestamps, nonempty response for executed status) are documented implementation restrictions, not a change to the canonical receipt schema.

## Qualification gate

The public benchmark result registry remains empty. All unit-test fixtures are synthetic and MUST NOT be published as evidence of LLM performance. For a genuine comparison, obtain independent execution records, a pre-registered matched design, raw outputs, reviewer evidence and session isolation evidence. Public fixtures create contamination risk and two cases cannot establish general superiority.

No results are sent or published by this tool. A local registry report is not a persistent public database, and a report covers only the files explicitly supplied. The auditor must retain the full submission inventory and originals, including failures, to detect selective reporting.

Source: [validator](../knowledge/halo-experimental.cjs) · [synthetic tests](../knowledge/halo-experimental.test.cjs) · [validation workflow](../.github/workflows/knowledge-public-http.yml).
