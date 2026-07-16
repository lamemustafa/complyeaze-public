# Visual overlap detector hotfix design

Date: 2026-07-16
Status: Approved approach; awaiting written-spec review

## Outcome

Restore a green `main` CI signal by making first-viewport overlap sampling robust when an element touches the viewport by less than one CSS pixel. Preserve the current Pack and Tools gateway layout and preserve meaningful overlap detection.

## Verified failure

PR #40 and its post-merge `main` run failed on the same cell:

```text
/products/tools/ mobile: 1 overlapped first-viewport content blocks:
h2 Use Tools for a first-pass draft
```

Evidence:

- PR run `29469442235` failed only in the visual step after lint, typecheck, test, build, and browser installation passed.
- Post-merge run `29469850041` reproduced the same finding on merge commit `fa32fae4dbd0e4310e97d705f897207a7bdd47d5`.
- The local 36-page by 3-viewport matrix passed all 108 cells.
- Local desktop, tablet, mobile, 320px, and 200% text-resize checks found no gateway overlap or horizontal overflow.
- The failure targets the first boundary heading, whose position can differ by a subpixel when Linux system-font metrics change the preceding hero height.

The repeated environment-specific result makes the visual gate the active defect. It does not justify changing page spacing without evidence of a rendered overlap.

## Scope

In scope:

- first-viewport hit-test geometry in `scripts/visual-check.mjs`;
- a focused geometry helper under `scripts/public-checks/`;
- deterministic fixtures proving viewport-edge and real-overlap sampling behavior;
- more useful diagnostics when a meaningful visible area still fails hit-testing;
- the complete existing verification matrix and current-head PR review flow.

Out of scope:

- Pack or Tools gateway copy, markup, spacing, or styling;
- suppressing heading or article overlap checks;
- lowering the full visual-matrix page or viewport count;
- Axal route work;
- deployment, Pages, DNS, redirects, indexing, governance, or ruleset changes;
- final brand, Sanchika, or Tailwind work.

## Considered approaches

### A. Viewport-edge-aware hit testing — selected

Move the pure rectangle-intersection and sample-point calculation into a focused helper. Treat fewer than one visible CSS pixel as boundary contact rather than enough evidence to declare overlap. Clamp every sample point inside the viewport before calling `elementFromPoint`.

Benefits:

- addresses the environment-sensitive geometry directly;
- preserves meaningful overlap detection;
- can be proven with deterministic fixtures;
- does not perturb an already reviewed public layout.

Tradeoff:

- adds a small helper boundary to the visual checker.

### B. Move the gateway heading with CSS — rejected

Extra padding or margin could move this heading away from the current boundary, but Linux font metrics could place another element at the same boundary later. It would alter a reviewed layout without proving a layout defect.

### C. Exclude headings from overlap checks — rejected

This would remove useful coverage and allow genuine text occlusion to pass.

## Geometry contract

Add a pure helper that accepts DOMRect-like values and viewport dimensions and returns safe hit-test points.

The helper must:

1. Intersect every client rectangle with the viewport.
2. Reject rectangles with no positive intersection.
3. Treat an intersection under one CSS pixel in width or height as viewport-edge contact and return no sample points for that rectangle.
4. Generate the existing inset, midpoint, and far-edge sample pattern for meaningfully visible intersections.
5. Clamp every coordinate to a point strictly inside the viewport so device-pixel rounding cannot turn a valid coordinate into `x === innerWidth` or `y === innerHeight`.
6. Return only finite coordinates.

`hitTestPasses` will consume those points:

- zero points means there is insufficient visible area to make an overlap claim, so the element passes this overlap check;
- one related topmost target still passes;
- meaningful visible area whose sampled targets are all unrelated still fails as a genuine overlap candidate.

Other visual checks remain unchanged. In particular, horizontal overflow, clipped controls, blank content, target size, landmarks, signal terms, and reduced-motion checks continue to run independently.

## Diagnostics

When meaningful visible content fails hit-testing, retain the existing human-readable finding and append compact geometry evidence to that finding:

- element rectangle;
- visible intersection;
- viewport dimensions;
- number of sample points.

Do not change the visual-summary schema. Do not log page content beyond the existing synthetic control label, and do not emit screenshots or DOM fragments into logs.

## Test-driven implementation

Write focused fixtures before production changes and watch them fail against the current geometry behavior.

Required cases:

1. A rectangle with a `0.5px` visible strip at the bottom edge produces no hit-test points.
2. A rectangle with a meaningful visible area produces points strictly inside the viewport.
3. A fully off-screen rectangle produces no points.
4. A normal first-viewport heading continues to produce the expected sampling grid.
5. Coordinates remain finite and inside the viewport for fractional rectangles.

After the focused fixtures turn green, run the existing test suite and the real 108-cell visual matrix. The visual script itself remains the integration proof that meaningful overlaps still fail the gate.

## Acceptance criteria

- No gateway HTML, content, or CSS changes.
- The new viewport-edge fixture fails before the implementation and passes afterward.
- Existing geometry and public-repo tests pass.
- All 36 pages pass at desktop, tablet, and mobile widths: 108/108 cells.
- Lint, typecheck, test, build, public, link, metadata, and whitespace checks pass.
- Current-head GitHub review has no unresolved actionable findings.
- PR CI passes on Linux.
- Post-merge `main` CI passes on the exact merge commit.

## Rollback

Revert the hotfix commit to restore the previous inline sampling behavior. Because the change does not alter route data, generated HTML, CSS, or public claims, rollback has no content or migration consequence.
