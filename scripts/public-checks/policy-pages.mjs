import { readFileSync } from "node:fs";
import path from "node:path";
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
  "Pages deploy is gated",
  "readiness-only",
  "route-level cleanup rows",
  "separate private-app cleanup PR",
  "does not authorize cleanup",
  "not production-host or parent-route cleanup evidence"
];

const requiredChangelogTerms = [
  "Route cleanup governance",
  "Route-level migration ledger",
  "Hosted route cutover checks",
  "scripts/check-hosted-routes.mjs",
  "without enabling Pages by default",
  "separate private-app cleanup PR"
];

const requiredReleaseEvidenceTerms = [
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
    const html = readFileSync(htmlPath, "utf8");
    if (!html.includes("/privacy/") || !html.includes("/terms/")) {
      findings.push(`${page.outputPath}: footer policy links missing`);
    }
    if (page.urlPath === "/status/" && !html.includes("not app uptime")) {
      findings.push(`${page.outputPath}: status page must disclaim private app uptime`);
    }
    if (page.urlPath === "/status/") {
      assertTerms(page.outputPath, html, requiredStatusTerms, findings);
      assertTerms("src/policy-data.mjs status", pageText(page), requiredStatusTerms, findings);
    }
    if (page.urlPath === "/changelog/") {
      assertTerms(page.outputPath, html, requiredChangelogTerms, findings);
      assertTerms("src/policy-data.mjs changelog", pageText(page), requiredChangelogTerms, findings);
    }
    if (page.urlPath === "/release-evidence/") {
      assertTerms(page.outputPath, html, requiredReleaseEvidenceTerms, findings);
      assertTerms("src/policy-data.mjs releaseEvidence", pageText(page), requiredReleaseEvidenceTerms, findings);
    }
    for (const pattern of unsafeClaims) {
      if (pattern.test(html)) findings.push(`${page.outputPath}: unsafe unsupported claim ${pattern}`);
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
