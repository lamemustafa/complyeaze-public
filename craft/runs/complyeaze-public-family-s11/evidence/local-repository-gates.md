# S11 local repository gates

**Evidence labels:** `browser-verified`, `not-user-validated`.

The selected Decision Register integration passed these current-worktree checks:

- `node_modules/.bin/astro build` in `apps/complyeaze` — 16 static pages;
- `node scripts/check-public-repo.mjs --lint`;
- `node scripts/check-public-repo.mjs --typecheck`;
- `node scripts/check-public-repo.mjs --test`;
- `node scripts/test-craft-asset-evidence.mjs`;
- `node apps/complyeaze/scripts/sanchika-package-smoke.mjs` — 108 definitions;
- `node scripts/check-public-repo.mjs --public`;
- `node scripts/check-public-repo.mjs --links`;
- `node scripts/check-public-repo.mjs --metadata`;
- `node scripts/visual-check.mjs` — 25 public routes across three viewports,
  75 passing cells; and
- `git diff --check`.

The Sanchika craft state also passed the canonical validator using the consumer
repository root, and Sanchika repository validation passed including 98 craft
fixtures. This does not replace a current-head GitHub review, merge gate, or
post-deploy smoke.
