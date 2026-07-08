const policySections = {
  privacy: [
    {
      title: "Repository boundary",
      body:
        "This public repository hosts website copy, static documentation, route ledgers, screenshots, and open-source governance files. It does not process tenant data, portal credentials, compliance documents, or authenticated Axal app workflows."
    },
    {
      title: "Data used in this repo",
      body:
        "Examples, screenshots, fixtures, and issue reports must use synthetic data. Public evidence must not include PAN, GSTIN, Aadhaar, phone numbers, taxpayer names, portal HTML, notices, orders, credentials, OTPs, CAPTCHA images, cookies, tokens, downloaded files, local browser profiles, or production screenshots."
    },
    {
      title: "Private app separation",
      body:
        "Authenticated services, workspace records, document processing, Prisma, Redis, workers, and portal automation stay outside this repository. Those systems need their own notices, controls, and review before their copy is migrated here."
    },
    {
      title: "Contact and issues",
      body:
        "Use the repository support and security policies for public website, claim, or vulnerability reports. Do not place sensitive taxpayer, client, credential, document, or portal information in public issues or pull requests."
    }
  ],
  terms: [
    {
      title: "Public-site use",
      body:
        "These terms describe use of the open public website repository and its static public pages. They are not a substitute for private product terms, customer agreements, professional advice, or third-party portal terms."
    },
    {
      title: "Open-source license",
      body:
        "Source code is provided under the Apache License 2.0 unless a file says otherwise. Brand names, logos, and marks are reserved separately and are not granted by the source license."
    },
    {
      title: "No official endorsement",
      body:
        "ComplyEaze public pages must not imply government approval, GSTN or CBIC endorsement, browser-store approval, statutory correctness, or production readiness unless the claim is backed by specific public evidence."
    },
    {
      title: "Evidence before reliance",
      body:
        "Public content may summarize product direction, migration status, and release gates, but users must verify source, release, and professional evidence before relying on compliance, tax, accounting, legal, or filing decisions."
    }
  ],
  status: [
    {
      title: "Current scope",
      body:
        "This status page covers the open public-site repository, static build gates, route migration readiness, and review evidence. It is not a private Axal app uptime page and does not report tenant service health."
    },
    {
      title: "Build posture",
      body:
        "The public site is intended to remain static by default. Release gates require lint, typecheck, tests, build, visual screenshots, public-content checks, link checks, metadata checks, git diff --check, and review-thread clearance."
    },
    {
      title: "Governance posture",
      body:
        "Legal governance, repository-settings gates, contributor-intake rules, dependency-surface policy, CODEOWNERS, and issue contact links are now checked by scripts/check-public-repo.mjs so source-license, trademark, supply-chain, review, and public-issue boundaries cannot drift silently."
    },
    {
      title: "Migration posture",
      body:
        "Root story, product-family, trust, migration, Axal marketing, and public policy/status/release routes are seeded. Route-level cleanup rows now stay blocked until hosted routing, canonical URLs, redirect behavior, rollback evidence, and a separate private-app cleanup PR are reviewed."
    },
    {
      title: "Hosting posture",
      body:
        "Pages deploy is gated and readiness-only behind ENABLE_GITHUB_PAGES_DEPLOY. A successful preview or artifact upload does not authorize cleanup because it is not production-host or parent-route cleanup evidence."
    },
    {
      title: "Incident language",
      body:
        "A public status update in this repo must distinguish static-site build or content issues from authenticated app incidents. Do not publish customer, tenant, credential, portal, or production infrastructure details here."
    }
  ],
  changelog: [
    {
      title: "2026-07-08 - Dependency surface policy",
      body:
        "Extended scripts/public-checks/dependency-policy.mjs so package.json, pnpm-lock.yaml, Dependabot update blocks, workflow pnpm and Node versions, lifecycle scripts, runtime dependencies, and pinned external GitHub Actions stay aligned with the public static-site trust boundary."
    },
    {
      title: "2026-07-08 - Contributor intake governance",
      body:
        "Expanded CODEOWNERS and issue contact links for owner-reviewed governance paths, private security and sensitive-data reports, conduct reports, and support boundaries, then added scripts/public-checks/contributor-intake.mjs to keep those intake guardrails enforced."
    },
    {
      title: "2026-07-08 - Repository settings gates",
      body:
        "Added scripts/public-checks/repository-settings.mjs, aligned pnpm verify and CI with git diff --check, pinned protected-check names, Pages guard prerequisites, review-gate posture, and custom-domain cutover blockers."
    },
    {
      title: "2026-07-08 - Legal governance checks",
      body:
        "Added scripts/public-checks/legal-governance.mjs so Apache-2.0 source-license boundaries, ComplyEaze-family trademark reservations, anti-endorsement language, fork/operator clarity, and contributor safety templates remain enforced."
    },
    {
      title: "2026-07-08 - Route cleanup governance",
      body:
        "Added route-cleanup issue intake, parent-route impact prompts, PR-template cutover checks, and static public checks so cleanup requests require hosted, redirect, rollback, ledger, and separate private-app cleanup PR evidence."
    },
    {
      title: "2026-07-08 - Route-level migration ledger",
      body:
        "Expanded the migration ledger from family summaries to source-route rows, rendered those blockers on /migration/, and added checks for duplicate routes, pending evidence, blocked cleanup, markdown alignment, and private-app PR requirements."
    },
    {
      title: "2026-07-08 - Hosted route cutover checks",
      body:
        "Added scripts/check-hosted-routes.mjs and the hosting cutover runbook so reviewers can verify hosted destination routes, robots, sitemap, route manifest, canonical tags, and preview-vs-production origin boundaries without enabling Pages by default."
    },
    {
      title: "2026-07-08 - Public policy/status/release routes",
      body:
        "Seeded public-repo-specific privacy, terms, status, changelog, and release-evidence routes with local policy checks and visual coverage. Parent legal/contact/about pages remain cleanup-blocked pending separate review."
    },
    {
      title: "2026-07-08 - Axal marketing route family",
      body:
        "Seeded the Axal product index and five static Axal detail pages with narrowed public claims, dedicated checks, and desktop/tablet/mobile screenshots. Parent cleanup remains blocked until hosted route evidence exists."
    },
    {
      title: "2026-07-08 - Migration ledger and route evidence model",
      body:
        "Added the rendered migration ledger, route-family data, release gates, and review-gate semantics so future cleanup depends on evidence rather than assumption."
    },
    {
      title: "2026-07-08 - Open-source governance baseline",
      body:
        "Established AGENTS.md, contribution policy, security/support files, Apache 2.0 source license, trademark reservation, issue templates, PR template, CI, and review-gate workflow."
    }
  ],
  releaseEvidence: [
    {
      title: "Route manifest",
      body:
        "The build script writes one static HTML file for each entry in src/site-data.mjs and emits dist/route-manifest.json, robots.txt, and sitemap.xml. Metadata checks compare the manifest with source route data, rendered files, canonical URLs, and sitemap entries."
    },
    {
      title: "Visual artifacts",
      body:
        "scripts/visual-check.mjs renders every public page at desktop, tablet, and mobile widths, writes screenshots under test-results/public-visual, and records a summary for review. CI retains this as the public-visual-evidence artifact."
    },
    {
      title: "Build artifacts",
      body:
        "CI retains the generated dist output as the public-site-build artifact so reviewers can inspect the route manifest, robots.txt, sitemap.xml, static HTML, and copied assets without treating the artifact as hosted cutover evidence."
    },
    {
      title: "Claim and safety checks",
      body:
        "scripts/check-public-repo.mjs rejects secret-like assignments, PAN-like and GSTIN-like identifiers, missing governance files, unsupported policy scope, broken route metadata, incomplete migration-ledger evidence, missing legal governance anchors, missing repository-settings gates, missing contributor-intake guardrails, missing dependency-surface policy, and missing route-cleanup governance prompts."
    },
    {
      title: "Dependency surface evidence",
      body:
        "scripts/public-checks/dependency-policy.mjs keeps package.json private, blocks runtime dependencies and lifecycle scripts, limits reviewed devDependencies to Playwright, verifies pnpm-lock.yaml stays within the current Playwright surface, checks Dependabot groups and reviewers, aligns pnpm@10.28.2 and Node 24 across workflows, and requires every external GitHub Action to be pinned to a reviewed SHA."
    },
    {
      title: "Contributor intake evidence",
      body:
        "CODEOWNERS keeps governance, release, policy, route data, rendering, docs, scripts, and package changes owner-reviewed. Issue contact links route security or sensitive-data reports, sensitive conduct reports, and support-boundary questions away from unsafe public issue content."
    },
    {
      title: "Repository settings evidence",
      body:
        "scripts/public-checks/repository-settings.mjs pins the documented public repo posture, protected check names, review-gate workflow posture, Pages guard prerequisites, pinned checkout actions, CNAME cutover blocking, and git diff --check alignment across pnpm verify and CI."
    },
    {
      title: "Legal governance evidence",
      body:
        "scripts/public-checks/legal-governance.mjs keeps Apache-2.0 source-license terms separate from ComplyEaze-family trademark rights, blocks unsupported government/GSTN/CBIC endorsement claims in content data, and preserves fork/operator clarity."
    },
    {
      title: "Hosted route evidence",
      body:
        "scripts/check-hosted-routes.mjs verifies hosted destination pages against dist/route-manifest.json, robots.txt, sitemap.xml, canonical tags, metadata, and main landmarks. Its summaries explicitly say redirect evidence is not checked by that script and preview hosts do not prove production cutover."
    },
    {
      title: "Route cleanup governance",
      body:
        "Route cleanup proposals need route-level ledger rows, rendered /migration/ evidence, hosted route summaries, redirect behavior, rollback evidence, and a separate private-app cleanup PR before any parent ComplyEaze route is removed or redirected. Public evidence pages do not authorize cleanup by themselves."
    },
    {
      title: "Pages deploy guard",
      body:
        "The GitHub Pages workflow is readiness-only unless it runs on main with ENABLE_GITHUB_PAGES_DEPLOY set to true. It runs the full verify gate before uploading only dist, and it is not parent-route cleanup evidence without hosted route, canonical, redirect, and rollback review."
    },
    {
      title: "Review gate",
      body:
        "The GitHub Review gate is designed to block unresolved review threads and requested-changes states. It complements, but does not replace, rendered review and the manual review-rectify loop."
    }
  ]
};

export const policyPages = [
  {
    slug: "privacy",
    type: "policy",
    outputPath: "privacy/index.html",
    urlPath: "/privacy/",
    title: "Privacy Boundary - ComplyEaze Public",
    description:
      "Public-repo privacy boundary for ComplyEaze website, trust, and migration evidence pages.",
    eyebrow: "Privacy boundary",
    heading: "This repo does not process tenant data",
    summary:
      "The public site can be inspected, forked, and reviewed without crossing into authenticated app data, portal sessions, compliance documents, or private infrastructure.",
    sections: policySections.privacy
  },
  {
    slug: "terms",
    type: "policy",
    outputPath: "terms/index.html",
    urlPath: "/terms/",
    title: "Public Site Terms - ComplyEaze Public",
    description:
      "Public-site terms for the ComplyEaze open website repository and static pages.",
    eyebrow: "Public-site terms",
    heading: "Open code is not an open trademark license",
    summary:
      "The website source is reviewable and Apache-licensed; the ComplyEaze-family marks, product claims, and professional-use boundaries remain controlled.",
    sections: policySections.terms
  },
  {
    slug: "status",
    type: "policy",
    outputPath: "status/index.html",
    urlPath: "/status/",
    title: "Public Site Status - ComplyEaze Public",
    description:
      "Repository and static public-site status for ComplyEaze Public.",
    eyebrow: "Repository status",
    heading: "Static-site readiness, not app uptime",
    summary:
      "Status here means public repo readiness, migration posture, and release-gate evidence. Authenticated app health belongs to a separate operational channel.",
    sections: policySections.status
  },
  {
    slug: "changelog",
    type: "policy",
    outputPath: "changelog/index.html",
    urlPath: "/changelog/",
    title: "Public Changelog - ComplyEaze Public",
    description:
      "Source-backed public changelog for ComplyEaze Public migration slices.",
    eyebrow: "Changelog",
    heading: "Migration history stays auditable",
    summary:
      "Each public slice records what moved, what stayed blocked, and which evidence must exist before parent routes are cleaned up.",
    sections: policySections.changelog
  },
  {
    slug: "release-evidence",
    type: "policy",
    outputPath: "release-evidence/index.html",
    urlPath: "/release-evidence/",
    title: "Release Evidence - ComplyEaze Public",
    description:
      "Release evidence categories for ComplyEaze Public static-site changes.",
    eyebrow: "Release evidence",
    heading: "No release without reviewable proof",
    summary:
      "A public-site change needs source checks, rendered screenshots, metadata, links, public-claim review, and a rollback story before private-route cleanup follows.",
    sections: policySections.releaseEvidence
  }
];
