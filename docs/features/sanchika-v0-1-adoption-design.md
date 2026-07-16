# Sanchika v0.1.0 public adoption design

**Status:** Approved

**Repository:** `complyeaze-public`

**Branch:** `tapish-codex/sanchika-v0-1-adoption`

**Base:** `origin/main` at `2f59de69a31615ef0ea77d46c1f73b13aa38681f`

## Outcome

Adopt the published Sanchika `v0.1.0` release artifacts across the ComplyEaze,
Axal, and Pack Astro applications in one focused P2 pull request. Prove the
ComplyEaze foundation first inside the branch, then extend the same bounded
shell baseline to Axal and Pack. Make adoption mechanically verifiable without
pulling P3 craft patterns, route redesigns, deployment, or private-app work into
P2.

## Release authority

P2 consumes the non-draft, non-prerelease GitHub release tagged `v0.1.0` from
`lamemustafa/sanchika`. The tag and source commit resolve to:

```text
050e444d50e8e4800f471709411eefca40058ab4
```

The three consumer packages are:

```text
@sanchika/tokens@0.1.0
@sanchika/primitives@0.1.0
@sanchika/patterns@0.1.0
```

They must be installed from the exact GitHub release tarball URLs, not npm,
workspace links, local files, the nested Sanchika repository, or package source
paths. Pnpm overrides must map the packed internal `0.1.0` token and primitive
dependencies to the same reviewed GitHub assets so resolution cannot fall
through to npm.

The adoption manifest will record two checksum layers:

- the SHA-256 values listed by the release's canonical `SHA256SUMS` asset for
  the three tarballs;
- the GitHub asset digest reported for each uploaded tarball.

The implementation must fetch or inspect the published `SHA256SUMS` file before
encoding those values. A mismatch between the release assets, manifest,
lockfile, or installed package identity is a hard failure.

The published values verified during design are:

| Package | `SHA256SUMS` value | GitHub asset digest |
| --- | --- | --- |
| `@sanchika/tokens` | `92148781457a3797db7f643235c8f23d881a4842426d50961bf6ec65bd718c55` | `sha256:92148781457a3797db7f643235c8f23d881a4842426d50961bf6ec65bd718c55` |
| `@sanchika/primitives` | `2d22f4a07f3d0ae1064e663551cecafc3dedeae4bf700889a0c900935e8b9585` | `sha256:2d22f4a07f3d0ae1064e663551cecafc3dedeae4bf700889a0c900935e8b9585` |
| `@sanchika/patterns` | `3b0b6e6e5b42712222bcf5badeca63a9fee6c0466904de0a2f5d27f2cd5428f5` | `sha256:3b0b6e6e5b42712222bcf5badeca63a9fee6c0466904de0a2f5d27f2cd5428f5` |

## Chosen approach

Use a shared-shell baseline across all three applications.

Rejected alternatives:

- A foundation-only adoption would prove package installation but provide too
  little visible or browser-verifiable consumer evidence.
- Early product-pattern adoption would pull P3 composition design into P2 and
  weaken the C3 craft approval boundary.

The selected approach maps Sanchika semantic roles and existing primitive jobs
while preserving every current route composition. It gives reviewers visible
proof that the packages work in real consumers without treating P2 as a
redesign.

## Dependency and CSS architecture

Each application declares the three exact release tarballs. The workspace root
owns the exact internal dependency overrides and the lockfile records the
resolved release artifacts.

Each app adds `src/styles/sanchika.css` with this order:

```css
@import "@sanchika/tokens/theme.css";
@import "@sanchika/primitives/styles.css";
@import "@sanchika/patterns/styles.css";
```

The owning layout imports this file before its existing consumer styles.
Consumer CSS therefore stays last and may map app-specific roles without
copying resolved Sanchika values or overriding undocumented package internals.

Patterns CSS is shipped and the public package entrypoint is smoke-tested in
P2. No `sk-pattern-*` composition class is applied to page markup until P3.
This proves the complete release set while keeping composition design behind
the craft-review phase.

Fonts remain app-owned or system-based. P2 does not import font binaries from
Sanchika, add remote font dependencies, or start the later approved-font
migration.

## Adoption manifest and evidence route

Add one machine-readable public adoption manifest containing:

- schema version;
- release tag and version;
- Sanchika source commit;
- release URL;
- all three package names, tarball URLs, release checksums, and GitHub asset
  digests;
- adopted apps and shell surfaces;
- CSS import order;
- package-entrypoint smoke expectations;
- rollback version `v0.0.2` and rollback asset URLs;
- explicit non-goals.

The manifest is the adoption evidence source, not a new route-content source or
general governance framework.

Add a noindex ComplyEaze `/sanchika/` evidence route outside primary product
navigation. It summarizes the adopted release, source commit, artifact method,
three consumer apps, verification boundary, rollback, and limitations from the
manifest. It must not claim npm publication, AI runtime, compliance judgement,
production cutover, or private-app adoption.

This route increases the canonical manifest-backed public inventory from 21 to
22 routes. It remains excluded from primary navigation and retains
`noindex, nofollow`. The existing ComplyEaze sitemap includes it consistently
with the other current noindex public evidence routes while the site remains
globally blocked by `robots.txt`; P3 review routes remain a separate excluded
class.

## Application changes

### ComplyEaze first

Prove the integration first in `PublicPageLayout` and the new evidence route:

- use Sanchika semantic roles for typography, page/surface colors, text,
  borders, and focus;
- apply primitive button, card, and badge classes only where current elements
  already have those semantic jobs;
- preserve existing page hierarchy, copy, actions, navigation, metadata, and
  route-specific components.

The ComplyEaze slice must pass package smoke, typecheck, build, public checks,
and browser review before Axal or Pack markup changes begin.

### Axal second

Replace the independent foundation variables in `AxalPageLayout` with the same
Sanchika semantic roles and primitive jobs. Preserve the current Axal identity,
synthetic workbench, six routes, layout, content, actions, and noindex posture.
P2 must not flatten Axal into an identical ComplyEaze skin.

### Pack third

Apply the same foundation and primitive treatment to Pack's one noindex
foundation route. Do not add customer routes, install actions, store links,
release readiness, or capability claims.

## Mechanical adoption check

Extend the existing focused public-check architecture with one narrow Sanchika
adoption check. It must verify:

- exact release tag, source commit, artifact URLs, checksums, and asset digests;
- all three app dependency declarations and root pnpm overrides;
- lockfile resolution to the reviewed GitHub tarballs;
- CSS import order in each app;
- no `../sanchika`, nested repository, workspace, local file, or package-source
  import;
- public package entrypoints for tokens, primitives, and patterns are usable;
- built CSS for every app contains Sanchika `--sk-` variables and expected
  primitive and pattern stylesheet classes;
- app markup contains the approved primitive adoption but no `sk-pattern-*`
  composition class;
- the adoption manifest and `/sanchika/` evidence route agree;
- the route registry contains 22 unique host/path owners;
- current metadata, robots, sitemap, link, public-claim, and zero-client-script
  contracts remain intact.

This is a consumer adoption boundary check, explicitly allowed during the
governance freeze. It must not become a general-purpose scoring or policy
framework.

## Error handling and atomicity

Adoption is atomic across the three packages and three apps. The PR fails if:

- a tarball or checksum differs from the published release;
- pnpm resolves an internal Sanchika dependency from npm or a local path;
- one app is missing a package, stylesheet layer, or built Sanchika output;
- the evidence route overstates the manifest;
- pattern composition is used before P3;
- an existing public route, identity, metadata, action, or noindex boundary
  regresses.

No fallback silently substitutes local Sanchika source. Network or artifact
unavailability is reported as a dependency-resolution failure; already locked
and installed artifacts may support offline verification after the trusted
install is complete.

## Test-driven implementation

Implement four red-green-refactor slices:

1. Release artifact and adoption-manifest contract.
2. ComplyEaze package smoke, shared-shell baseline, and evidence route.
3. Axal and Pack shared-shell adoption.
4. Built-output, 22-route, 66-cell visual, rollback, and forbidden-import
   enforcement.

Every slice begins with a focused failing check whose message names the missing
contract. Production code follows only after the expected red result is
observed.

## Verification

Focused checks prove package resolution, manifest truth, CSS order, package
entrypoints, built CSS markers, primitive use, absence of pattern composition,
route ownership, sitemap/robots behavior, and rollback data.

The complete tree must pass:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm public:check
pnpm links:check
pnpm metadata:check
pnpm visual:check
git diff --check
pnpm verify
```

The visual matrix expands to 22 pages across desktop, tablet, and mobile: 66
unique cells with zero final findings. Review also checks cascade regressions,
identity loss, accidental P3 adoption, accessibility, package provenance, and
rollback completeness.

Run the authenticated repository-settings audit if the dependency or workflow
posture changes its documented expectations.

## Rollback

Rollback changes the complete package set together:

1. Replace all three `v0.1.0` tarball declarations with the reviewed `v0.0.2`
   assets.
2. Change the pnpm override selectors and URLs to the matching `v0.0.2` token
   and primitive artifacts.
3. Remove v0.1-only CSS/API/primitive usage and the v0.1 adoption evidence
   route or revise it to truthful rollback evidence.
4. Regenerate and inspect the lockfile.
5. Rerun package smoke, typecheck, build, public checks, and browser evidence.

Rollback does not change databases, private applications, deployment, DNS,
redirects, or route cleanup.

## PR lifecycle

Use one ready P2 PR. Before every commit, review and rectify the complete
intended diff. After every push, obtain a current-head GitHub Codex review,
reply to and resolve actionable threads, and rerun affected gates. Merge only
the unchanged reviewed head after required checks are green and branch
protection is satisfied; request exact-head admin-bypass approval only if it is
actually required. Then prove merged-tree equality, post-merge `main` CI and
artifacts, late-review cleanliness, and task-owned branch/worktree cleanup.

## Non-goals

- P3 `/review/craft/` routes or product-pattern composition;
- page redesign, customer-copy rewrite, or new product routes other than the
  adoption evidence route;
- deployment, Pages enablement, staging, DNS, CNAME, domains, redirects,
  indexing, or private-route cleanup;
- private application, auth, tenant, portal, document, queue, or infrastructure
  changes;
- npm publication or Sanchika source/release changes;
- Tools adoption;
- new fonts, analytics, telemetry, client frameworks, or runtime APIs.

## Acceptance

- one PR adopts the exact published Sanchika `v0.1.0` artifact set in all three
  apps;
- ComplyEaze is proven before Axal and Pack within the implementation history;
- release provenance, checksums, overrides, lockfile, and installed identities
  agree;
- each app independently builds with ordered Sanchika CSS and visible primitive
  shell adoption;
- patterns are shipped and smoke-tested but not composed;
- `/sanchika/` truthfully renders manifest-backed noindex evidence;
- 22 routes and 66 visual cells pass without identity, accessibility, metadata,
  link, public-claim, or zero-JS regression;
- rollback to the reviewed `v0.0.2` set is complete and mechanical;
- no deployment or later-phase claim is introduced.
