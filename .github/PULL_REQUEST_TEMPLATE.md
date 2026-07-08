## Summary

## Decision Record

- What changed?
- Why is this the smallest safe public-site change?
- Which issue, route, review finding, or release gate does this close?

## Scope

- Pages/routes:
- Content/policy:
- Design/visual:
- CI/tooling:
- Explicitly out of scope:

## Public Safety

- [ ] Uses synthetic data only.
- [ ] No PAN, GSTIN, Aadhaar, phone numbers, taxpayer names, portal HTML,
      notices, credentials, OTPs, CAPTCHA data, cookies, tokens, local paths, or
      production screenshots.
- [ ] Public claims are backed by source, release, or runtime evidence.
- [ ] Trademark and affiliation boundaries are preserved.

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm visual:check`
- [ ] `pnpm public:check`
- [ ] `pnpm links:check`
- [ ] `pnpm metadata:check`
- [ ] `git diff --check`

## Review-Rectify

- [ ] Latest review has no open Critical or High findings.
- [ ] Medium findings are fixed or listed as follow-ups.
- [ ] Rendered desktop and mobile evidence uses synthetic data.

| Finding | Severity | Disposition | Evidence |
| --- | --- | --- | --- |
| | | | |

## Screenshots Or Runtime Evidence

Use synthetic data only.
