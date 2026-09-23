---
name: ComplyEaze Public
description: Public website and trust surfaces for the ComplyEaze product family.
register: brand
colors:
  paper: "#F3F5FA"
  paper-sheet: "#FBFCFE"
  carbon: "#16161D"
  carbon-soft: "#3D3B4D"
  ink: "#4B2E9E"
  ink-deep: "#37207A"
  ink-wash: "#E6E0F6"
  ink-rule: "#B9ADDF"
  ink-hair: "#D8D2EC"
typography:
  display:
    fontFamily: "Anek Latin (self-hosted variable, wdth 75-125), Arial Narrow, system-ui, sans-serif"
    usage: "Headlines and declarations, condensed to wdth 76-82% at weight 700-780, tracking no tighter than -0.025em, 6rem ceiling."
  body:
    fontFamily: "Anek Latin at wdth 100, system-ui, sans-serif"
    usage: "Body copy at 1.0625rem or larger with a 58-65ch measure."
  field:
    fontFamily: "Courier Prime (self-hosted), Courier New, monospace"
    usage: "Form field values, amounts, identifiers, repository names and stamp lettering only; never subtitles or labels."
---

# Design System: ComplyEaze Public

## Overview

Stamped and Acknowledged. Every CA office day ends with proof: a dated,
stamped acknowledgement. ComplyEaze makes the tools that get a firm to that
stamp, so the public site is printed on bond paper in carbon type and one
violet stamp-pad ink. It deliberately avoids the category default of a blue
SaaS hero, dashboard screenshots and "100% accuracy" badges.

The site is a brand and trust surface, not an authenticated workflow tool. It
shows what the products do with sample documents a CA would recognise, and it
keeps every claim checkable.

## Colors

Two inks on paper, nothing else.

- **Paper** (`paper`, `paper-sheet`): a cool bright bond, never cream. A fixed
  fractal grain layer tinted with ink sits over the page at low opacity.
- **Carbon** (`carbon`, `carbon-soft`): all type. `carbon-soft` carries
  secondary text; there are no neutral greys.
- **Violet stamp ink** (`ink` and its tints): actions, stamps, reviewer marks,
  links and the subject half of declarations. Tints (`ink-wash`, `ink-rule`,
  `ink-hair`) are the same ink at lower density for rules, cells and washes.

No gradients, no glow, no third accent. Product colours from the old register
(Pack lime, Tools amber) are retired; products are told apart by stamps and
copy, not hue.

## Typography

Anek Latin by Ek Type carries display and body from one variable file, using
the width axis for condensed headlines. Courier Prime is the typewriter of the
forms: GSTIN cells, amounts, invoice numbers, repository names and stamp
lettering. It is never used as a costume for labels or subtitles.

Headlines are sentences, not labels. There are no eyebrows, kickers or section
numbers above headings.

## Components

- **Acknowledgement slip:** perforated top edge (radial-gradient mask), label
  and value rows on dashed ink rules, boxed character cells for masked
  identifiers, a signature line, and a stamp across the lower corner. Always
  labelled as sample data.
- **Stamp (`.ce-stamp`):** double-ruled border in ink, uppercase Courier,
  rotated a few degrees, multiplied over the paper, worn by one of three SVG
  filters (`#ce-ink`, `#ce-ink-2`, `#ce-ink-3`) that combine displacement,
  ink gaps and a low-frequency pressure mask. Stamp size encodes how final a
  state is: saved or reviewed states print larger than preview or paused ones.
  States are printed as stamp words, never as pill badges.
- **Declaration row:** one display sentence per row, subject in ink and
  statement in carbon, with the supporting body set below and offset.
- **Product slip:** paper-sheet with a perforated top edge, role in body type,
  job, dashed form rules for "Where it runs" and "Check it", and a status
  stamp. Square corners.
- **Worksheet:** a sample review table in Courier figures with reviewer
  ballpoint loops around flags that need a look. On small screens each row
  becomes a stacked record.
- **Counterfoil:** the closing call to action, with punched half-disc notches
  and a dashed perforation separating the stub.
- **Service pages (`/services/`):** the same world for the owner's US
  services. A rate slip beside the hero claim carries a sourced reference
  table; declaration rows print each figure in ink with its claim, body and
  source links; an adding-machine tape shows labelled arithmetic; a rate sheet
  lists service, deliverables and price; a counterfoil closes with the email
  address. The trust-reconciliation page never carries a stamp, because a
  stamp reads as an attestation mark on that work.
- **Buttons:** solid ink primary, outlined ink secondary, square corners,
  one label per intent across the page.

## Motion

One authored moment: the hero slip feeds out and its stamp lands (scale from
1.8 to rest with an exponential ease-out). Lower stamps land on scroll through
`animation-timeline: view()` where supported. Everything collapses to the
final state under `prefers-reduced-motion`. No authored JavaScript.

## Do's And Don'ts

Do show source, status, release, privacy and support evidence when making
public claims, and label every illustrative document as sample data.

Do verify desktop and mobile renderings before commit.

Do not use real taxpayer data, unmasked identifiers or production screenshots.

Do not imply government approval, statutory advice or unsupported readiness.

Do not add eyebrows, section numbers, pill badges, gradients or a third colour.
