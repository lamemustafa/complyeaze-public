# Canonical validator verification

Validated at `2026-07-23T20:51:32+05:30` with Sanchika commit
`3fde1381b90f1c9ea73e77feaaae7bd266e1151a`, merged through Sanchika PR #55.

From the consumer repository root, run the canonical Sanchika checkout with
the consumer root explicitly named:

```bash
node /path/to/sanchika/skills/sanchika-craft/scripts/validate-run.mjs \
  craft/runs/complyeaze-public-family-s11/state.json \
  --repo-root . \
  --previous craft/runs/complyeaze-public-family-s11/transitions/previous-state.json
```

Result: `Craft run valid: complyeaze-public-family-s11 (reconcile/active)`.
This validates the retained consumer-owned run and its manifest-authenticated
previous state. It is repository evidence, not production or user validation.
