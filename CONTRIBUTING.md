# Contributing

ComplyEaze Public is a public-site repository for compliance-adjacent content.
Contributions must protect public trust, trademark boundaries, and sensitive
taxpayer data.

## Ground Rules

- Use synthetic examples only.
- Keep changes small, reviewable, and tied to a public-page outcome, bug, or
  release gate.
- Do not commit real taxpayer identifiers, portal screenshots, notices,
  documents, credentials, local environment files, browser profiles, or private
  deployment details.
- Do not add claims about statutory correctness, government approval, security,
  privacy, automation, release status, or store availability without evidence.
- Keep implementation changes, content changes, governance changes, and generated
  artifacts separate unless one explicitly depends on another.

## Local Checks

Run focused checks first, then broaden:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm visual:check
pnpm public:check
pnpm links:check
pnpm metadata:check
git diff --check
```

Visual changes require desktop and mobile rendered evidence with synthetic data.

## Dependency Changes

Dependency and GitHub Actions updates must follow
[docs/DEPENDENCY_POLICY.md](docs/DEPENDENCY_POLICY.md). Keep updates scoped,
review release evidence when the dependency affects build, browser automation,
CI, artifacts, or deployment, and do not auto-merge dependency PRs.

## License And Trademark Boundaries

The source license is Apache License 2.0, but ComplyEaze-family marks remain
reserved. Review [LICENSE.brand.md](LICENSE.brand.md) and
[TRADEMARKS.md](TRADEMARKS.md) before changing brand, fork attribution,
endorsement, or compatibility language.

## Inbound Contribution Terms

By submitting a pull request, issue comment, patch, design asset, documentation
change, or other contribution that you intend for inclusion in this repository,
you agree that the contribution is submitted under the Apache License 2.0
section 5 inbound contribution terms: unless you explicitly state otherwise,
your contribution is submitted under Apache License 2.0 without additional terms
or conditions, unless a separate written agreement with the maintainers says
otherwise.

You also represent that:

- You have the right to submit the contribution.
- The contribution is your original work or is compatible with Apache License
  2.0 and this repository's brand and trademark boundaries.
- The contribution does not include proprietary, confidential, copied,
  unlicensed, or third-party content unless the license, source, attribution,
  and reason for inclusion are listed in the pull request.
- The contribution does not add third-party logos, screenshots, fonts, icons,
  datasets, regulatory text, government-portal material, or generated assets
  without source and license evidence.
- The source license grant does not grant trademark, endorsement, affiliation,
  certification, or government-approval rights.

## Pull Requests

Use the pull request template and fill every applicable section. Before review:

- CI must pass on the latest head SHA.
- The review-rectify loop must have no open Critical or High findings.
- Public claims must be source-backed.
- Screenshots must use synthetic data.
- Any known follow-up must be listed explicitly.

## Security Reports

Do not open public issues for vulnerabilities or accidental sensitive-data
exposure. Follow [SECURITY.md](SECURITY.md).
