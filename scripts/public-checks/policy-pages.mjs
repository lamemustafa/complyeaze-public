import { readFileSync } from "node:fs";
import path from "node:path";
import rawManifest from "../../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";
import { policyPages } from "../../src/policy-data.mjs";
import { pages } from "../../src/site-data.mjs";

const requiredPolicyPaths = ["/privacy/", "/terms/", "/status/", "/changelog/", "/release-evidence/"];
const unsafeClaims = [
  /private app uptime is (green|operational|healthy)/i,
  /production ready/i,
  /government approved/i,
  /GSTN approved/i,
  /CBIC approved/i,
  /certified GST filing/i,
  /nothing leaves your device/i,
  /zero data collection/i,
  /CA verified/i,
  /DPDP compliant/i
];

const requiredStatusTerms = [
  "not app uptime",
  "Governance posture",
  "git diff --check",
  "Legal governance",
  "repository-settings gates",
  "contributor-intake rules",
  "dependency-surface policy",
  "CODEOWNERS",
  "issue contact links",
  "scripts/check-public-repo.mjs",
  "source-license",
  "trademark",
  "supply-chain",
  "public-issue boundaries",
  "Pages deploy is gated",
  "readiness-only",
  "route-level cleanup rows",
  "separate private-app cleanup PR",
  "does not authorize cleanup",
  "not production-host or parent-route cleanup evidence"
];

const requiredChangelogTerms = [
  "Dependency surface policy",
  "scripts/public-checks/dependency-policy.mjs",
  "package.json",
  "pnpm-lock.yaml",
  "Dependabot update blocks",
  "workflow pnpm and Node versions",
  "lifecycle scripts",
  "runtime dependencies",
  "pinned external GitHub Actions",
  "public static-site trust boundary",
  "Contributor intake governance",
  "scripts/public-checks/contributor-intake.mjs",
  "Repository settings gates",
  "scripts/public-checks/repository-settings.mjs",
  "Legal governance checks",
  "scripts/public-checks/legal-governance.mjs",
  "git diff --check",
  "CODEOWNERS",
  "issue contact links",
  "protected-check names",
  "Pages guard prerequisites",
  "custom-domain cutover blockers",
  "Apache-2.0 source-license boundaries",
  "ComplyEaze-family trademark reservations",
  "anti-endorsement language",
  "fork/operator clarity",
  "Route cleanup governance",
  "Route-level migration ledger",
  "Hosted route cutover checks",
  "scripts/check-hosted-routes.mjs",
  "without enabling Pages by default",
  "separate private-app cleanup PR"
];

const requiredReleaseEvidenceTerms = [
  "Visual artifacts",
  "reduced-motion state",
  "focus targets",
  "touch-target",
  "blank-section",
  "first-viewport overlap evidence",
  "missing dependency-surface policy",
  "Dependency surface evidence",
  "scripts/public-checks/dependency-policy.mjs",
  "package.json private",
  "blocks runtime dependencies and lifecycle scripts",
  "reviews devDependencies",
  "devDependencies",
  "Playwright",
  "Astro",
  "Astro Check",
  "TypeScript",
  "pnpm-lock.yaml",
  "workspace dependency surface",
  "Dependabot groups and reviewers",
  "pnpm@10.28.2",
  "Node 24",
  "external GitHub Action",
  "pinned to a reviewed SHA",
  "reviewed SHA",
  "Contributor intake evidence",
  "Repository settings evidence",
  "Legal governance evidence",
  "CODEOWNERS",
  "issue contact links",
  "owner-reviewed",
  "security or sensitive-data reports",
  "sensitive conduct reports",
  "support-boundary questions",
  "protected check names",
  "review-gate workflow posture",
  "pinned checkout actions",
  "CNAME cutover blocking",
  "git diff --check alignment",
  "Apache-2.0 source-license terms",
  "ComplyEaze-family trademark rights",
  "GSTN",
  "CBIC",
  "endorsement claims",
  "fork/operator clarity",
  "scripts/public-checks/repository-settings.mjs",
  "scripts/public-checks/legal-governance.mjs",
  "Hosted route evidence",
  "Route cleanup governance",
  "route-level ledger rows",
  "dist/route-manifest.json",
  "robots.txt",
  "sitemap.xml",
  "redirect evidence is not checked",
  "preview hosts do not prove production cutover",
  "do not authorize cleanup",
  "separate private-app cleanup PR"
];

export function assertPolicyPageSources(root) {
  const manifest = definePublicRouteManifest(rawManifest);
  const canonicalRoutes = manifest.routes.filter((route) => route.kind === "policy");
  const findings = [];
  if (policyPages.length !== canonicalRoutes.length) {
    findings.push("legacy policy adapter must map every canonical policy route exactly once");
  }
  for (const route of canonicalRoutes) {
    const page = policyPages.find((candidate) => candidate.urlPath === route.urlPath);
    if (!page) {
      findings.push(`${route.urlPath}: missing from legacy policy adapter`);
      continue;
    }
    for (const field of [
      "description",
      "eyebrow",
      "heading",
      "policySummary",
      "sections",
      "slug",
      "summary",
      "title",
      "urlPath",
    ]) {
      if (JSON.stringify(page[field]) !== JSON.stringify(route[field])) {
        findings.push(`${route.urlPath}: legacy policy adapter diverges on ${field}`);
      }
    }
  }
  const source = readFileSync(path.join(root, "src/policy-data.mjs"), "utf8");
  if (source.includes("const policySections")) {
    findings.push("src/policy-data.mjs: duplicated policy content must move to the canonical manifest");
  }
  if (findings.length > 0) {
    throw new Error(`Policy source findings:\n${findings.join("\n")}`);
  }
}

export function assertPolicyPages(root) {
  const pagePaths = new Set(pages.map((page) => page.urlPath));
  const dataPaths = new Set(policyPages.map((page) => page.urlPath));
  const findings = [];

  for (const route of requiredPolicyPaths) {
    if (!pagePaths.has(route)) findings.push(`${route}: missing from site pages`);
    if (!dataPaths.has(route)) findings.push(`${route}: missing from policy data`);
  }

  for (const page of policyPages) {
    const htmlPath = path.join(root, "dist", page.outputPath);
    const renderedOutputs = [
      [page.outputPath, readFileSync(htmlPath, "utf8")],
      [
        `apps/complyeaze/dist/${page.outputPath}`,
        readFileSync(path.join(root, "apps", "complyeaze", "dist", page.outputPath), "utf8"),
      ],
    ];
    for (const [outputPath, html] of renderedOutputs) {
      for (const [label, value] of Object.entries(page.policySummary)) {
        if (!html.includes(value)) {
          findings.push(`${outputPath}: rendered policy summary diverges on ${label}`);
        }
      }
      if (!html.includes("/privacy/") || !html.includes("/terms/")) {
        findings.push(`${outputPath}: footer policy links missing`);
      }
      if (page.urlPath === "/status/" && !html.includes("not app uptime")) {
        findings.push(`${outputPath}: status page must disclaim private app uptime`);
      }
      if (page.urlPath === "/status/") {
        assertTerms(outputPath, html, requiredStatusTerms, findings);
      }
      if (page.urlPath === "/changelog/") {
        assertTerms(outputPath, html, requiredChangelogTerms, findings);
      }
      if (page.urlPath === "/release-evidence/") {
        assertTerms(outputPath, html, requiredReleaseEvidenceTerms, findings);
      }
      for (const pattern of unsafeClaims) {
        if (pattern.test(html)) findings.push(`${outputPath}: unsafe unsupported claim ${pattern}`);
      }
    }
    if (page.urlPath === "/status/") {
      assertTerms("canonical policy data status", pageText(page), requiredStatusTerms, findings);
    }
    if (page.urlPath === "/changelog/") {
      assertTerms("canonical policy data changelog", pageText(page), requiredChangelogTerms, findings);
    }
    if (page.urlPath === "/release-evidence/") {
      assertTerms(
        "canonical policy data releaseEvidence",
        pageText(page),
        requiredReleaseEvidenceTerms,
        findings,
      );
    }
  }

  if (findings.length > 0) {
    throw new Error(`Policy page findings:\n${findings.join("\n")}`);
  }
}

function pageText(page) {
  return [page.title, page.description, page.eyebrow, page.heading, page.summary, ...(page.sections ?? []).flatMap((section) => [section.title, section.body])]
    .filter(Boolean)
    .join("\n");
}

function assertTerms(filePath, text, terms, findings) {
  const normalized = text.toLowerCase();
  for (const term of terms) {
    if (!normalized.includes(term.toLowerCase())) {
      findings.push(`${filePath}: missing ${term}`);
    }
  }
}
