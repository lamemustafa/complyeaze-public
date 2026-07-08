# Review-Rectify Policy

Use this policy for every non-trivial change before commit, PR, or deployment.

## Severity

- Critical: secret or real taxpayer data exposure, misleading government or
  statutory claim, malicious link/download behavior, or trademark misuse that
  implies official endorsement.
- High: unsupported security/privacy/release claim, broken primary public route,
  inaccessible critical page state, unsafe form behavior, or failed visual gate
  on a launch-critical page.
- Medium: broken secondary link, incomplete responsive state, weak empty/error
  state, unclear evidence, stale copy, or maintainability issue with realistic
  public impact.
- Low: wording, formatting, small layout polish, or local cleanup.

## Loop

1. Review the diff, rendered pages, screenshots, and current branch.
2. Record findings with severity, file or URL, evidence, and proposed fix.
3. Fix all Critical and High findings.
4. Fix Medium findings when low-cost; otherwise record a follow-up with owner
   and reason.
5. Re-run focused checks.
6. Run the full public gate.
7. Repeat until the review has no open Critical or High findings.

## Full Public Gate

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

The GitHub `Review gate` status enforces unresolved review-thread and
requested-changes blockers. It does not replace the review-rectify table in the
pull request or the maintainer's current-diff review.

## Visual Gate

Visual review must cover:

- Desktop, tablet, and mobile widths.
- Header, navigation, footer, and primary content.
- Long words, long product names, long URLs, and policy pages.
- Reduced-motion behavior.
- Keyboard focus and visible focus states.
- Contrast and text legibility.
- No broken images, blank sections, overlap, or clipped controls.
- Synthetic data only.
