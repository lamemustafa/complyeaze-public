# S11 local browser and accessibility evidence

**Evidence labels:** `browser-verified`, `not-user-validated`.

The current static build was checked by the repository visual runner across 25
public routes at desktop (1440x1100), tablet (834x1112), and mobile (390x844):
75 cells passed with no reported issue.

For the selected homepage section, each of the three viewport cells reported:

- exactly one `main` landmark;
- 23 named links and no unnamed links;
- no small targets, broken images, clipped controls, overlap findings, or
  horizontal overflow; and
- reduced-motion coverage and visible keyboard-focus traversal.

The same run exercised the static, no-auth public build. The section keeps
product, custody, proof, and next action in reading order at 390px, and the
register header is intentionally absent below the desktop layout breakpoint.

Command: `node scripts/visual-check.mjs`.

This is local browser verification, not human validation or deployed-route
evidence. Production still requires the owner production decision and a
post-deploy smoke check.

## Focused homepage matrix

Chromium 149.0.7827.55 additionally checked the selected homepage directly:

| Check | Result |
| --- | --- |
| 320, 390, 768, and 1440px | One `main`, 23 named links, no unnamed links, visible skip-link focus, no horizontal overflow, and no external asset requests at every viewport. |
| No JavaScript at 390px | One `main`, the product-family heading, and all three product actions remain present. |
| Forced colors at 390px | Forced-colors mode is active and the focused product link retains a visible focus indicator. |
| 200% page scale at 390px | Browser reports a scale of 2; one `main` and all three product actions remain present. |

This focused check does not claim human usability testing. The public
product-family content has no rendered identifier field, so there is no
identifier-specific long-value behavior to assert on this surface.
