# P4.1 ComplyEaze structured-data implementation plan

**Design:** `docs/features/p4-structured-data-design.md`

**Branch:** `tapish-codex/p4-structured-data`

## Task 1: failing rendered metadata contract

Extend the existing ComplyEaze metadata assertion so the built canonical route
contains one parseable JSON-LD graph with Organization and WebSite entries. The
contract must reject missing, duplicated, malformed, origin-mismatched, or
unsupported schema data. Run it against the pre-change build and observe the
expected missing-graph failure.

## Task 2: minimal shared graph

Add a serialized static graph in `PublicPageLayout.astro`. Derive absolute
identifiers and the WebSite URL from the passed manifest origin. Include only:

- `Organization`: `@id`, `@type`, `name`, and `url`;
- `WebSite`: `@id`, `@type`, `name`, `url`, and `publisher` referring to the
  Organization `@id`.

Keep it server-rendered and shared; do not add a client script or route-level
schema variants.

## Task 3: verify and review

Run the focused source/build contract, then the repository metadata gate and
the full relevant verification bundle. Review the final diff for unverified
claims, duplicate schema, serialization safety, and route leakage before
committing the contract and implementation in logical lanes.
