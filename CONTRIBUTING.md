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
