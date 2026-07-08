import { readFileSync } from "node:fs";
import path from "node:path";

const pullRequestTemplatePath = ".github/PULL_REQUEST_TEMPLATE.md";
const generalIssueTemplatePaths = [
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/content_or_claim.md",
  ".github/ISSUE_TEMPLATE/page_request.md"
];
const routeCleanupTemplatePath = ".github/ISSUE_TEMPLATE/route_cleanup.md";
const migrationDocsPath = "docs/ROUTE_MIGRATION_LEDGER.md";
const hostingCutoverPath = "docs/HOSTING_CUTOVER.md";
const reviewRectifyPath = "docs/REVIEW_RECTIFY.md";

const requiredTemplateTerms = [
  "No private-app route removal or redirect is claimed by this PR",
  "scripts/check-hosted-routes.mjs --base-url <url>",
  "docs/ROUTE_MIGRATION_LEDGER.md",
  "src/migration-data.mjs",
  "Rendered `/migration/` evidence",
  "dist/route-manifest.json",
  "Redirect behavior",
  "rollback evidence",
  "Rollback owner",
  "Separate private-app cleanup PR",
  "does not enable Pages, DNS, CNAME, redirects, or parent-route cleanup"
];

const requiredIssueTerms = [
  "Source route",
  "Public destination",
  "dist/route-manifest.json",
  "scripts/check-hosted-routes.mjs --base-url <url>",
  "Canonical URL and sitemap",
  "Redirect behavior",
  "Rollback action",
  "Separate private-app cleanup PR",
  "Private-app cleanup PR",
  "authenticated",
  "tenant data",
  "portal automation"
];

const requiredParentImpactTerms = [
  "Parent-Route Impact",
  "No parent-route cleanup or redirect is requested",
  "existing parent public route",
  "route-ledger",
  "hosted",
  "redirect",
  "rollback evidence"
];

export function assertRouteCleanupGovernance(root) {
  const pullRequestTemplate = readFile(root, pullRequestTemplatePath);
  const routeCleanupTemplate = readFile(root, routeCleanupTemplatePath);
  const migrationDocs = readFile(root, migrationDocsPath);
  const hostingCutover = readFile(root, hostingCutoverPath);
  const reviewRectify = readFile(root, reviewRectifyPath);
  const findings = [];

  assertTerms(pullRequestTemplatePath, pullRequestTemplate, requiredTemplateTerms, findings);
  assertTerms(routeCleanupTemplatePath, routeCleanupTemplate, requiredIssueTerms, findings);
  for (const filePath of generalIssueTemplatePaths) {
    assertTerms(filePath, readFile(root, filePath), requiredParentImpactTerms, findings);
  }

  if (!migrationDocs.includes("Family-level entries do not authorize cleanup")) {
    findings.push(`${migrationDocsPath}: missing family-level cleanup blocker`);
  }
  if (!hostingCutover.includes("Parent-route cleanup starts only after")) {
    findings.push(`${hostingCutoverPath}: missing parent-route cleanup blocker`);
  }
  if (
    !reviewRectify.includes("unsupported parent-route") ||
    !reviewRectify.includes("cleanup or cutover claim")
  ) {
    findings.push(`${reviewRectifyPath}: missing cleanup/cutover severity rule`);
  }

  if (findings.length > 0) {
    throw new Error(`Route cleanup governance findings:\n${findings.join("\n")}`);
  }
}

function assertTerms(filePath, text, terms, findings) {
  const normalized = text.toLowerCase();
  for (const term of terms) {
    if (!normalized.includes(term.toLowerCase())) {
      findings.push(`${filePath}: missing ${term}`);
    }
  }
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
