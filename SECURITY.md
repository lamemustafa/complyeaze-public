# Security Policy

This repository is public and must not contain secrets, private infrastructure
details, real taxpayer data, portal responses, credentials, or production
screenshots.

## Reporting A Vulnerability

Do not open a public issue for suspected vulnerabilities or sensitive-data
exposure.

Use GitHub private vulnerability reporting when available, or contact the
maintainers through the established private maintainer channel.

Include:

- Affected page, file, workflow, or artifact.
- Reproduction steps using synthetic data.
- Impact, including whether users could be misled or sensitive data could be
  exposed.
- Redacted screenshots or logs only.

## Public-Site Security Requirements

- No secrets in source, examples, screenshots, CI logs, or generated artifacts.
- No real PAN, GSTIN, Aadhaar, phone numbers, taxpayer names, notices,
  documents, portal HTML, cookies, OTPs, CAPTCHA data, local paths, or tokens.
- Public claims must match implementation and evidence.
- Links, downloads, redirects, and forms must avoid unsafe targets and misleading
  collection of sensitive data.
- Forks must not imply official ComplyEaze operation or endorsement.
- Dependency and GitHub Actions security updates must follow
  [docs/DEPENDENCY_POLICY.md](docs/DEPENDENCY_POLICY.md), stay scoped to public
  repo needs, and preserve pinned Actions plus the full public gate.

## Verification

Security-sensitive public changes should run the focused checks plus:

```bash
pnpm public:check
pnpm links:check
pnpm metadata:check
git diff --check
```
