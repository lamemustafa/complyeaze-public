# S11 direction review — ComplyEaze public product-family section

**Evidence labels:** `ai-visual-proxy`, `not-user-validated`.

## Calibration

Four isolated reviewer roles passed the retained five-control calibration pack
without corrections or reruns. The calibration pack is used to detect generic
AI SaaS, off-brief editorial, false authority, and accessibility failure modes;
it is not the ComplyEaze comparison baseline.

## Controls

- Current ComplyEaze product-family baseline:
  `current-complyeaze-baseline-desktop-1440.png`.
- Fresh plain-request control, made with only the owner request and same-commit
  public-repository access: `without-skill-control.webp`. Its source code was
  deliberately discarded.

## Direction outcome

| Direction | Brand | Craft | Trust | Accessibility | Outcome |
| --- | --- | --- | --- | --- | --- |
| Evidence rail | viable reserve | mobile artifact invalid | no veto | no veto | not qualified this round |
| Custody cascade | weak | introduces unsupported route hierarchy | no veto | no veto | rejected |
| Decision register | preferred | preferred | preferred | preferred | qualifies for owner selection |

Decision register received preference over both controls from each isolated
reviewer. Its per-role scores satisfy the direction threshold: relevance,
distinctiveness, craft, and trust medians are at least 3; no trust or
accessibility veto remains. It has valid 1440×1100 and 390×844 renders. The
two blinded recognition proxies subsequently matched Decision register 3/3;
see `decision-register-recognition-evidence.md`.

## Review boundaries

- The result is AI proxy evidence, not user testing or human validation.
- This pre-selection review is immutable. The owner subsequently selected
  `decision-register` in `../owner-decision.json`; implementation is now
  limited to that selected direction.
- Production remains separately gated by integrated browser/accessibility,
  performance, repository, deployment, rollback, and explicit owner-production
  approval evidence.
