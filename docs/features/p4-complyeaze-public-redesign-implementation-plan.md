# P4 ComplyEaze customer-page redesign implementation plan

**Design:** `docs/features/p4-complyeaze-public-redesign-design.md`

**Branch:** `tapish-codex/p4-complyeaze-redesign`

**Base:** `edaeb651d40f35f78af7adb1bb6790031ca2fc7e`

## Delivery shape

Keep one implementation PR and three logical code lanes:

1. buyer-choice contract and focused failing checks;
2. canonical copy and six-route evidence-register presentation;
3. responsive/browser verification and review rectification.

## Task 1: buyer-choice contract

Add a focused P4 public check that fails until:

- the scope is exactly `/`, `/products/`, `/products/pack/`,
  `/products/tools/`, `/about/`, and `/contact/`;
- the homepage and About/Contact routes consume the canonical product register
  instead of duplicating product facts;
- every product exposes job, custody boundary, proof/status, evidence, and a
  verified product action;
- the contact route exposes the real public-issue and private-security paths;
- the six rendered pages carry the P4 scope marker, buyer-choice composition,
  and zero authored scripts or forms.

Observe the focused check fail before production edits.

## Task 2: canonical content and composition

Revise only the six manifest records with buyer-led, source-backed copy. Keep
product facts in the existing `/products/` register and pass that canonical
record to the homepage and resource presentations where product actions are
needed.

Create one focused P4 visual stylesheet and use Sanchika public pattern classes
for the evidence-register compositions. Preserve the existing generic
components and presentation for non-P4 routes.

The six pages use:

- a decision-led `PublicHero` treatment;
- `ProductRouteMap`-style product register rows;
- proof/provenance strips;
- route-specific gateway and inquiry arrangements;
- a shared P4 layout scope class for navigation, canvas, spacing, and focus
  treatment.

No new dependency, font, image, JavaScript, form, API, or route is introduced.

## Task 3: focused verification and visual iteration

Run the focused source/build contract, then lint, typecheck, tests, builds,
public claims, links, and metadata. Run the full browser matrix and inspect the
six P4 routes at desktop, tablet, and mobile, with emphasis on:

- first-viewport product distinction;
- long-copy wrapping and product action clarity;
- contrast, keyboard order, forced colors, and 44-pixel targets;
- mobile evidence sequence and tablet register reflow;
- zero authored JavaScript, broken assets, CSS/font budgets, and CLS.

Apply an honest Impeccable critique/rectify pass and rerun affected gates.

## Task 4: review and PR lifecycle

Run a complete local diff review. Fix every valid Critical/High issue and all
low-cost Medium issues, capped by the repository review policy. Commit the
implementation in logical lanes, push, open a ready PR, wait for all required
checks, request a current-head GitHub Codex review, and resolve every actionable
thread. Do not merge without explicit owner approval for the exact final head.

