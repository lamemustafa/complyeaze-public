---
name: ComplyEaze Public
description: Public website and trust surfaces for the ComplyEaze product family.
register: brand
colors:
  ink: "#0F172A"
  surface: "#FFFFFF"
  muted: "#F5F5F5"
  border: "#E5E5E5"
  axal-blue: "#2F80ED"
  axal-purple-brand: "#5B21B6"
typography:
  display:
    fontFamily: "Selected during the first brand shape pass"
    usage: "Public brand pages only; do not inherit authenticated app typography by default."
  body:
    fontFamily: "Selected during the first brand shape pass"
    usage: "Public content, policy, and docs; optimize for trust copy and long-form readability."
---

# Design System: ComplyEaze Public

## Overview

ComplyEaze Public is a brand and trust surface, not an authenticated workflow
tool. It must explain the product family with evidence, restrained claims, and a
distinct public identity.

## Colors

The first implementation slice must choose a public brand palette deliberately.
Do not default to generic SaaS purple gradients, beige editorial restraint, or a
dark dashboard theme. Preserve Axal purple only where the Axal mark requires it.

## Typography

The first implementation slice must choose public-site typography after a brand
shape pass. Do not reuse authenticated app typography by default just because it
exists.

## Components

Public pages should use responsive sections, navigation, docs layouts, status
blocks, evidence callouts, changelog entries, policy pages, and comparison
tables only where they support the page's job.

## Do's And Don'ts

Do show source, status, release, privacy, and support evidence when making
public claims.

Do verify desktop and mobile renderings before commit.

Do not use real taxpayer data or production screenshots.

Do not imply government approval, statutory advice, or unsupported readiness.
