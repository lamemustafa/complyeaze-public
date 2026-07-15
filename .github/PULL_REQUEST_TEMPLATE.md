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
- [ ] I have the right to submit this contribution.
- [ ] I understand intentional contributions are submitted under Apache License
      2.0 section 5 unless I explicitly state otherwise or a separate written
      agreement applies.
- [ ] No proprietary, confidential, copied, unlicensed, or third-party content
      is included unless license, source, attribution, and inclusion rationale
      are listed in the disclosure section below.

## Third-Party Or Proprietary Content Disclosure

List any third-party, proprietary, generated, copied, licensed, or attributed
content included in this PR. If none, write `None`.

| Content | License / permission | Source | Attribution | Inclusion rationale |
| --- | --- | --- | --- | --- |
| | | | | |

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
- [ ] Review-gate fixture checks passed when review policy or gate scripts changed.
- [ ] Dependency-policy review completed when npm, lockfile, or GitHub Actions changed.

## Route Migration Or Cutover, If Any

- [ ] No private-app route removal or redirect is claimed by this PR.
- [ ] Route-level migration ledger rows updated in `src/migration-data.mjs`.
- [ ] `docs/ROUTE_MIGRATION_LEDGER.md` mirrors the changed source host, source route, destination host, and destination route.
- [ ] Rendered `/migration/` evidence reviewed when route ledger rows changed.
- [ ] Destination route exists in `dist/route-manifest.json` when parent-route cleanup is proposed.
- [ ] `scripts/check-hosted-routes.mjs --base-url <url>` evidence attached when hosted routes changed.
- [ ] Redirect behavior and rollback evidence attached when parent-route cleanup is proposed.
- [ ] Rollback owner or revert path listed when parent-route cleanup is proposed.
- [ ] Separate private-app cleanup PR linked before removing or redirecting parent ComplyEaze routes.
- [ ] This PR does not enable Pages, DNS, CNAME, redirects, or parent-route cleanup unless explicitly listed above.

## Dependency Updates, If Any

- [ ] Changelog, release notes, source diff, or advisory evidence reviewed.
- [ ] GitHub Actions remain pinned to reviewed SHAs.
- [ ] No private app, tenant-data, portal automation, document-storage, Prisma,
      Redis, BullMQ, telemetry, or credential-handling dependency was added.

## Review-Rectify

- [ ] Local Codex review completed before every commit in this PR.
- [ ] Current-head GitHub Codex review completed after the latest push.
- [ ] Latest review has no open Critical or High findings.
- [ ] Medium findings are fixed or listed as follow-ups.
- [ ] Rendered desktop and mobile evidence uses synthetic data.

| Finding | Severity | Disposition | Evidence |
| --- | --- | --- | --- |
| | | | |

## Screenshots Or Runtime Evidence

Use synthetic data only.

- `public-site-build` artifact:
- `public-visual-evidence` artifact:
