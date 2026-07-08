# ComplyEaze Public

Public website, documentation, trust, release, policy, and brand surfaces for
the ComplyEaze product family.

This repository is intended to be open source. It is separate from the private
ComplyEaze application repository, which owns authenticated Axal workflows,
tenant data, credentials, document processing, portal automation, Prisma,
Redis/BullMQ workers, and production app deployment infrastructure.

## Scope

In scope:

- Public ComplyEaze, Axal, Pack, Tools, and Sanchika pages.
- Public-safe docs, status, changelog, release, support, security, privacy, and
  terms pages.
- SEO assets such as metadata, robots, sitemaps, canonical URLs, and social
  preview assets.
- Synthetic examples and public review evidence.

Out of scope:

- Authenticated app routes and APIs.
- Tenant, workspace, client, credential, portal, document, or tax data.
- Private deployment secrets and infrastructure.
- Real taxpayer screenshots, files, identifiers, or portal responses.

## Development

The implementation stack will be finalized during the first build slice. The
initial repo contract assumes Node.js, pnpm, TypeScript, a static/public-site
framework, Playwright visual checks, and CI gates for lint, typecheck, tests,
build, links, metadata, and rendered screenshots.

## Governance

- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Support](SUPPORT.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Brand and trademark notice](LICENSE.brand.md)
- [Trademark policy](TRADEMARKS.md)
- [Review-rectify policy](docs/REVIEW_RECTIFY.md)
- [Migration plan](docs/MIGRATION.md)

## Public Pages

- `/about/` explains the public repo boundary and product-family proof model.
- `/contact/` routes public-site, security, and private-product inquiries without collecting form data.
- `/privacy/` defines the public-repo privacy boundary.
- `/terms/` defines public-site and open-source usage boundaries.
- `/status/` reports repository and static-site readiness, not private app uptime.
- `/changelog/` records source-backed migration slices.
- `/release-evidence/` lists the evidence expected before release or cleanup.
