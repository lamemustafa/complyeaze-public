# P4 ComplyEaze customer-page redesign

**Status:** Approved design

**Repository:** `complyeaze-public`

**Branch:** `tapish-codex/p4-complyeaze-redesign`

**Base:** `origin/master` at `edaeb651d40f35f78af7adb1bb6790031ca2fc7e`

**Controlling gate:** C3 public-craft system approved by the owner at merge
`edaeb651d40f35f78af7adb1bb6790031ca2fc7e`.

## Outcome

Redesign the six customer-facing ComplyEaze routes with the C3-approved
**Ledger Atelier** craft system so a buyer can identify the right product and
continue to a product-specific, already verified destination:

- `/`;
- `/products/`;
- `/products/pack/`;
- `/products/tools/`;
- `/about/`;
- `/contact/`.

The chosen page system is **A: Evidence register cascade**. It leads with the
visitor's job and custody boundary, then presents proof, status, and one verified
next action for Axal, Pack, or Tools. Product color supports orientation without
turning the ComplyEaze site into three competing mini-sites.

## User and conversion goal

P4 primarily serves prospective buyers who need to choose the correct product.
The journey optimizes for product selection followed by an appropriate contact
or product-owned destination.

Each product receives its own action, limited to these destinations already
verified in the canonical manifest:

- Axal: `https://axal.complyeaze.com/`;
- Pack: the ComplyEaze Pack gateway at `/products/pack/`, then the canonical
  Pack public site at `https://pack.complyeaze.com/`;
- Tools: the ComplyEaze Tools gateway at `/products/tools/`, then the canonical
  Tools public site at `https://tools.complyeaze.com/`.

Source, release, support, privacy, and security links may accompany the primary
action only when their exact destination already exists in the canonical
manifest or current product-owned evidence.

P4 does not introduce forms, accounts, uploads, signup flows, lead storage, new
external application destinations, or runtime integrations.

## Route architecture

### `/`: decision entry point

The homepage introduces the family through the buyer's work and custody need.
Its reading order is:

1. the decision to make;
2. three job-and-boundary routes;
3. concise proof of why the products remain separate;
4. verified product actions and a secondary trust-evidence route.

The page must let a visitor distinguish Axal, Pack, and Tools in the first
viewport without implying that ComplyEaze itself performs their product jobs.

### `/products/`: comparison register

The product-family page compares Axal, Pack, and Tools in parallel. Every product
entry includes:

- job;
- proof source;
- custody boundary;
- current status or limitation;
- one product-specific verified action.

The comparison remains readable as an evidence sequence on mobile; it must not
collapse into a dense desktop-only table or a repeated generic card grid.

### `/products/pack/` and `/products/tools/`: product gateways

Each gateway answers, in order:

1. when this product is the appropriate destination;
2. what data or artifact custody it owns;
3. what ComplyEaze does not receive or control;
4. which product-owned evidence should be checked;
5. the verified next action.

Gateway copy may be improved substantially, but product capability, release,
privacy, security, and readiness statements must remain traceable to the
canonical manifest or product-owned evidence.

### `/about/`: family rationale

The About page explains why the public trust layer, authenticated Axal work,
browser-local Pack collection, browser-local Tools drafts, and the Sanchika
design contract remain distinct. It should establish credibility through clear
ownership and boundaries rather than origin-story or unsupported scale claims.

### `/contact/`: inquiry router

The Contact page routes visitors among:

- a product or buyer inquiry, with product destinations and a clear instruction
  to use the established private maintainer/product channel rather than a public
  issue;
- a public-site issue through
  `https://github.com/lamemustafa/complyeaze-public/issues`;
- a sensitive or security report through the repository security policy at
  `https://github.com/lamemustafa/complyeaze-public/blob/master/SECURITY.md`,
  which preserves the documented private-channel fallback while GitHub private
  vulnerability reporting is disabled.

No public URL for the private product channel is currently verified in the
repository. P4 therefore does not invent or expose one; the product-inquiry
entry is guidance plus the three verified product destinations, not a false CTA.

The page must warn users not to place client, taxpayer, credential, document,
phone, or portal details in public issues. It adds no form.

## Content system

P4 permits broader marketing copy than the parity baseline, subject to the
repository's evidence and public-safety rules.

Copy follows this order:

1. name the buyer's job;
2. state custody and ownership;
3. state the limitation or review boundary;
4. link to proof or status;
5. offer the verified next action.

New wording must not claim government endorsement, statutory correctness,
filing outcomes, production readiness, unsupported security guarantees, Chrome
Web Store availability, or private-app behavior that is not proven by current
repository or product-owned evidence.

Canonical content remains in the typed ComplyEaze route manifest. Astro
components own presentation and composition, not parallel marketing facts.

## Visual system

The C3-approved ComplyEaze identity is an **evidence register**:

- deep teal as the dominant brand anchor;
- chalk-white surfaces;
- redaction-black primary text;
- compact provenance and proof treatments;
- calm archival hierarchy rather than dashboard chrome or editorial-magazine
  styling.

Product identities are controlled orientation signals within that system:

- Axal: a restrained teal/family-ownership signal on ComplyEaze pages;
- Pack: moss or lime used only where it clarifies Pack ownership;
- Tools: a restrained ComplyEaze-compatible utilitarian treatment until a
  separate Tools identity is approved in its owning phase.

P4 must not invent unverified full product identities. Product signals cannot
reduce text contrast or compete with the ComplyEaze hierarchy.

Typography uses large balanced headings for the decision and compact register
rows for comparison. Display headings must not exceed `6rem` or use tracking
tighter than `-0.04em`. Body lines target at most `65–75ch`.

The design excludes:

- generic SaaS gradient heroes;
- repeated icon-card grids;
- decorative hero metrics;
- tiny uppercase eyebrows on every section;
- numbered section markers without a real sequence;
- glassmorphism, gradient text, decorative stripe backgrounds, and excessive
  rounding or shadows.

## Composition and code architecture

Use the adopted Sanchika v0.1.1 public API where the semantics fit, including
`PublicHero`, `ProductRouteMap`, `ProofStrip`, and relevant evidence or
provenance patterns. P4 may add focused ComplyEaze-owned arrangements and CSS,
but it does not modify, source-import, republish, or release Sanchika packages.

The existing typed route kinds and manifest-backed Astro routing remain
canonical. Shared layout changes must be scoped so trust, docs, migration,
policy, status, release-evidence, Sanchika, and craft-review routes retain their
current presentation and behavior unless a minimal compatibility adjustment is
required. P7 owns their later redesign and hardening.

Server-rendered Astro and native HTML remain the default. P4 adds zero authored
client JavaScript and no hydrated islands.

## Responsive and accessible behavior

Desktop uses an asymmetric register layout. Mobile preserves the same semantic
reading order as a single evidence sequence: decision, job, boundary, proof,
status, action.

All six routes require:

- one main landmark and logical heading order;
- keyboard-reachable actions in document order;
- visible focus and forced-colors boundaries;
- minimum 44-pixel interactive targets;
- WCAG 2.2 AA text contrast;
- no horizontal overflow, clipping, overlap, collapsed meaningful text, or
  hidden default content;
- reduced-motion-safe rendering;
- long names and action labels that wrap without breaking the layout.

## Verification

Write focused manifest and rendered-contract tests before implementation. At a
minimum, they prove that every redesigned product representation includes its
job, custody boundary, proof/status, and one verified action; no new form or
authored client script is introduced; and the six-route scope is exact.

Run the six P4 routes at desktop, tablet, and mobile: 18 focused P4 cells inside
the full 25-route, 75-cell repository matrix. Verification covers:

- lint, TypeScript, tests, and all app builds;
- cautious public-claim and sensitive-pattern checks;
- links, metadata, canonical URLs, robots, sitemap, and route registry;
- axe critical and serious findings;
- keyboard order, focus, reduced motion, and forced colors;
- overflow, clipping, overlap, hit targets, broken assets, and readable text;
- zero authored JavaScript;
- existing CSS, font, and CLS budgets;
- `git diff --check`.

Before the PR, run the complete intended diff through the repository's local
review/rectify loop until clean. After every push, resolve all actionable GitHub
review threads, obtain a clean current-head Codex review, and wait for required
CI to pass. Merge requires explicit owner approval for the exact final head.

## Scope boundaries

### In scope

- the six named ComplyEaze customer-facing routes;
- their canonical typed manifest content;
- focused ComplyEaze components and styles;
- narrowly scoped shared-layout support required by those routes;
- focused and full verification evidence.

### Out of scope

- Axal customer-page redesign (P5);
- Pack customer-page redesign (P6);
- trust, docs, migration, privacy, terms, status, changelog, release-evidence,
  and Sanchika page redesign or broader hardening (P7);
- staging deployment (P8), hosting projects, DNS, redirects, or cutover;
- private-app routes, auth, tenant data, Prisma, Redis/BullMQ, documents,
  credentials, portal automation, or production infrastructure;
- new Sanchika APIs, package changes, releases, or source-path imports;
- new forms, accounts, uploads, signup flows, lead persistence, or product
  runtime behavior;
- unsupported product actions or claims.

## Failure and rollback behavior

Schema mismatch, incomplete buyer-choice fields, an unverified destination,
unsupported claims, sensitive-looking content, broken links or assets, authored
JavaScript, accessibility failures, budget regressions, or incomplete visual
evidence are implementation defects.

P4 changes only static public content and presentation. Rollback is a single P4
revert to the C3-approved `edaeb651` tree. No database, migration, deployment,
DNS, or private-application rollback is required.

## Acceptance criteria

P4 is implementation-complete when:

1. exactly the six approved ComplyEaze routes use the evidence-register cascade;
2. every product representation names its job, custody boundary, proof/status,
   and one verified next action;
3. the homepage distinguishes Axal, Pack, and Tools in the first viewport;
4. broader copy remains source-backed and passes public-safety checks;
5. the six routes are responsive, accessible, zero-JavaScript, and visually
   coherent at desktop, tablet, and mobile;
6. non-P4 ComplyEaze pages, Axal, and Pack retain their existing presentation
   and route behavior;
7. all focused and full repository gates pass on the exact PR head;
8. the final local and GitHub review state is clean with zero unresolved
   actionable threads;
9. no deployment, DNS, private-app, P5, P6, P7, or P8 work enters the diff.
