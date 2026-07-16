# Visual overlap detector hotfix implementation plan

**Design:** `docs/features/visual-overlap-detector-hotfix-design.md`

**Branch:** `tapish-codex/visual-overlap-detector-hotfix`

**Base:** `origin/main` at `fa32fae4dbd0e4310e97d705f897207a7bdd47d5`

## Objective

Make first-viewport overlap hit-testing stable when Linux font metrics leave only a subpixel strip of an element inside the viewport. Preserve meaningful overlap detection, keep the gateway rendering unchanged, and restore green PR and post-merge `main` CI.

## Success criteria

- subpixel viewport contact produces no hit-test sample points;
- meaningful visible content still produces interior sample points;
- fully off-screen content produces no points;
- fractional coordinates are finite and strictly inside the viewport;
- meaningful unrelated topmost targets still trigger the existing overlap finding;
- gateway HTML, copy, and CSS remain unchanged;
- all 108 visual cells pass locally and in Linux CI;
- the complete public gate, current-head review, merge-tree check, and post-merge CI pass.

## Explicit non-goals

- gateway spacing or content changes;
- removal or suppression of heading/article overlap checks;
- Axal route work;
- visual inventory reductions;
- deployment, Pages, DNS, redirects, indexing, rulesets, or governance changes.

## Preflight

1. Confirm the worktree is clean and based on `fa32fae`.
2. Install from the existing lockfile offline if workspace dependencies are absent.
3. Run the existing test and lint lanes.
4. Record the two exact Linux failures and retain them in the design document.

## Slice 1 — behavior-preserving geometry extraction

Extract the current rectangle intersection and nine-point sampling calculation into a pure batch helper in `scripts/public-checks/visual-geometry.mjs` without changing thresholds or clamping.

Expose the imported batch helper to each Playwright page with `page.exposeFunction`. Inside the existing metrics evaluation, serialize the overlap candidates' client rectangles, call the helper once for the combined candidate list, and use the returned point groups for `elementFromPoint` checks. This keeps geometry calculation in one directly testable implementation without dynamic evaluation or per-element IPC calls.

Run the existing tests and full visual check. This slice must remain green and must not change generated screenshots or summary schema.

## Slice 2 — RED viewport-edge fixtures

Add `assertVisualGeometryFixtures` and wire it into `node scripts/check-public-repo.mjs --test`.

Required fixtures:

- `0.5px` bottom-edge contact expects no points;
- a normal visible heading expects nine interior points;
- a fully off-screen rectangle expects no points;
- fractional rectangles expect only finite, strictly interior points.

Run the test lane and confirm the subpixel fixture fails against the behavior-preserving extraction for the intended reason.

## Slice 3 — GREEN viewport-edge-aware sampling

Implement the minimum behavior change:

- require at least one CSS pixel of visible width and height before sampling;
- clamp sample coordinates to a half-pixel inside viewport bounds;
- discard non-finite coordinates;
- treat zero generated points as insufficient evidence for an overlap claim.

Append compact rectangle, intersection, viewport, and point-count evidence only when a meaningfully visible element still fails hit-testing. Preserve the existing human-readable finding prefix and visual-summary schema.

Run the focused test until green, then rerun lint and the real visual matrix.

## Slice 4 — regression and integration proof

Run:

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

Verify:

- 36 visual pages;
- 108 PNG artifacts;
- 108 passing summary rows;
- no gateway-source or built-output diff;
- no new public claims or sensitive content;
- changed application/check files remain focused and readable.

If the local package-manager wrapper cannot perform online signature verification, run the exact workspace-local binaries and scripts, then require Linux GitHub CI to prove the normal wrappers.

## Review and PR lifecycle

1. Review the complete diff and classify findings.
2. Fix all Critical/High findings and low-cost Medium findings.
3. Commit the implementation only after all local gates pass.
4. Push one focused hotfix PR.
5. Request `@codex review` on the latest head.
6. Inspect flat comments, reviews, inline comments, and GraphQL review threads.
7. Require Public site gates, Review gate, and security checks to pass.
8. Merge only the exact reviewed head; do not mutate the ruleset.
9. Verify the merge tree equals the reviewed head tree.
10. Require the post-merge `main` CI and both evidence artifacts to pass.
11. Fast-forward the base clone and remove the clean task worktree and local branch.

## Remaining work after the hotfix

Once `main` is green, resume the six-route Axal marketing port as a separate design and implementation increment.
