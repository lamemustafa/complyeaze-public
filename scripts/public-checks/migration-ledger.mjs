import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { migrationLedger } from "../../src/migration-data.mjs";

const ledgerDocPath = "docs/ROUTE_MIGRATION_LEDGER.md";
const requiredFamilies = ["Root public pages", "Axal marketing", "Pack public pages", "Tools public utilities"];
const requiredFields = ["source", "destination", "status", "cleanup", "parentCleanup", "evidence", "rollback"];
const requiredRouteFields = [
  "sourceHost",
  "sourceRoute",
  "destinationHost",
  "destinationRoute",
  "cleanupStatus",
  "evidenceStatus",
  "redirectStatus",
  "redirectPlan",
  "rollback",
  "rollbackCommandOrOwner",
  "hostedEvidenceUrl",
  "parentCleanupPr"
];

const expectedRouteInventory = [
  ["Root public pages", "complyeaze.com", "/", "complyeaze.com", "/"],
  ["Root public pages", "complyeaze.com", "/resources/about-us", "complyeaze.com", "/about/"],
  ["Root public pages", "complyeaze.com", "/resources/contact-us", "complyeaze.com", "/contact/"],
  ["Root public pages", "complyeaze.com", "/resources/privacy-policy", "complyeaze.com", "/privacy/"],
  ["Root public pages", "complyeaze.com", "/resources/terms-and-conditions", "complyeaze.com", "/terms/"],
  ["Axal marketing", "axal.complyeaze.com", "/", "complyeaze.com", "/products/axal/"],
  ["Axal marketing", "axal.complyeaze.com", "/ca-practice-management-software", "complyeaze.com", "/products/axal/ca-practice-management-software/"],
  ["Axal marketing", "axal.complyeaze.com", "/gst-notice-management-software", "complyeaze.com", "/products/axal/gst-notice-management-software/"],
  ["Axal marketing", "axal.complyeaze.com", "/compliance-calendar-software-india", "complyeaze.com", "/products/axal/compliance-calendar-software-india/"],
  ["Axal marketing", "axal.complyeaze.com", "/gst-reconciliation-evidence-review", "complyeaze.com", "/products/axal/gst-reconciliation-evidence-review/"],
  ["Axal marketing", "axal.complyeaze.com", "/client-document-collection-portal-access", "complyeaze.com", "/products/axal/client-document-collection-portal-access/"],
  ["Pack public pages", "pack.complyeaze.com", "/", "pack.complyeaze.com", "/"],
  ["Pack public pages", "pack.complyeaze.com", "/gst", "pack.complyeaze.com", "/gst"],
  ["Pack public pages", "pack.complyeaze.com", "/changelog", "pack.complyeaze.com", "/changelog"],
  ["Pack public pages", "pack.complyeaze.com", "/docs", "pack.complyeaze.com", "/docs"],
  ["Pack public pages", "pack.complyeaze.com", "/privacy", "pack.complyeaze.com", "/privacy"],
  ["Pack public pages", "pack.complyeaze.com", "/terms", "pack.complyeaze.com", "/terms"],
  ["Pack public pages", "pack.complyeaze.com", "/acceptable-use", "pack.complyeaze.com", "/acceptable-use"],
  ["Pack public pages", "pack.complyeaze.com", "/security", "pack.complyeaze.com", "/security"],
  ["Pack public pages", "pack.complyeaze.com", "/support", "pack.complyeaze.com", "/support"],
  ["Pack public pages", "pack.complyeaze.com", "/source", "pack.complyeaze.com", "/source"],
  ["Pack public pages", "pack.complyeaze.com", "/release-automation", "pack.complyeaze.com", "/release-automation"],
  ["Pack public pages", "pack.complyeaze.com", "/status", "pack.complyeaze.com", "/status"],
  ["Tools public utilities", "tools.complyeaze.com", "/evidence-packet", "tools.complyeaze.com", "/evidence-packet"],
  ["Tools public utilities", "tools.complyeaze.com", "/sanchika", "tools.complyeaze.com", "/sanchika"]
];

export function assertMigrationLedger(root) {
  const docsText = readFile(root, ledgerDocPath);
  const normalizedDocsText = docsText.toLowerCase();
  const findings = [];
  const routeSourceCounts = new Map();

  for (const family of requiredFamilies) {
    if (!normalizedDocsText.includes(family.toLowerCase())) {
      findings.push(`${ledgerDocPath}: missing family ${family}`);
    }
    if (!migrationLedger.some((entry) => entry.family.toLowerCase() === family.toLowerCase())) {
      findings.push(`src/migration-data.mjs: missing family ${family}`);
    }
  }

  for (const entry of migrationLedger) {
    const missingFields = requiredFields.filter((field) => !entry[field]);
    if (missingFields.length > 0) {
      findings.push(`${entry.family}: missing ${missingFields.join(", ")}`);
    }
    if (!Array.isArray(entry.routes) || entry.routes.length === 0) {
      findings.push(`${entry.family}: missing route-level cleanup entries`);
      continue;
    }
    if (!entry.parentCleanup.toLowerCase().includes("separate private-app cleanup pr")) {
      findings.push(`${entry.family}: parent cleanup must require a separate private-app cleanup PR`);
    }

    for (const route of entry.routes) {
      assertRouteEntry(entry, route, routeSourceCounts, findings);
      if (!docsText.includes(route.sourceRoute)) {
        findings.push(`${ledgerDocPath}: missing source route ${route.sourceRoute}`);
      }
      if (!docsText.includes(route.destinationRoute)) {
        findings.push(`${ledgerDocPath}: missing destination route ${route.destinationRoute}`);
      }
    }
  }

  for (const [sourceRoute, count] of routeSourceCounts) {
    if (count > 1) {
      findings.push(`duplicate source route entry: ${sourceRoute}`);
    }
  }
  assertExpectedRouteInventory(findings);

  if (findings.length > 0) {
    throw new Error(`Migration ledger findings:\n${findings.join("\n")}`);
  }
}

export function assertRenderedMigrationLedger(root, findings) {
  const migrationHtmlPath = path.join(root, "dist", "migration", "index.html");
  if (!existsSync(migrationHtmlPath)) return;

  const migrationHtml = readFileSync(migrationHtmlPath, "utf8");
  for (const entry of migrationLedger) {
    if (!migrationHtml.includes(entry.parentCleanup)) {
      findings.push(`migration/index.html: missing parent cleanup guard for ${entry.family}`);
    }
    for (const route of entry.routes ?? []) {
      if (!migrationHtml.includes(route.sourceHost)) {
        findings.push(`migration/index.html: missing rendered source host ${route.sourceHost}`);
      }
      if (!migrationHtml.includes(route.sourceRoute)) {
        findings.push(`migration/index.html: missing rendered source route ${route.sourceRoute}`);
      }
      if (!migrationHtml.includes(route.destinationHost)) {
        findings.push(`migration/index.html: missing rendered destination host ${route.destinationHost}`);
      }
      if (!migrationHtml.includes(route.destinationRoute)) {
        findings.push(`migration/index.html: missing rendered destination route ${route.destinationRoute}`);
      }
    }
  }
}

function assertRouteEntry(entry, route, routeSourceCounts, findings) {
  const missingFields = requiredRouteFields.filter((field) => !route[field]);
  if (missingFields.length > 0) {
    findings.push(`${entry.family}: route entry missing ${missingFields.join(", ")}`);
  }
  if (route.sourceRoute) {
    const sourceKey = `${route.sourceHost}${route.sourceRoute}`;
    routeSourceCounts.set(sourceKey, (routeSourceCounts.get(sourceKey) ?? 0) + 1);
  }
  if (route.sourceRoute?.startsWith("http") || route.destinationRoute?.startsWith("http")) {
    findings.push(`${entry.family} ${route.sourceRoute}: route fields must stay host-relative when sourceHost/destinationHost are present`);
  }
  if (route.sourceRoute && !route.sourceRoute.startsWith("/")) {
    findings.push(`${entry.family} ${route.sourceRoute}: sourceRoute must start with /`);
  }
  if (route.destinationRoute && !route.destinationRoute.startsWith("/")) {
    findings.push(`${entry.family} ${route.sourceRoute}: destinationRoute must start with /`);
  }
  if (route.cleanupStatus && !route.cleanupStatus.toLowerCase().includes("blocked")) {
    findings.push(`${entry.family} ${route.sourceRoute}: cleanup must remain blocked until cutover evidence exists`);
  }
  if (route.evidenceStatus && !route.evidenceStatus.toLowerCase().includes("pending")) {
    findings.push(`${entry.family} ${route.sourceRoute}: evidence status must make pending evidence explicit`);
  }
}

function assertExpectedRouteInventory(findings) {
  const actual = new Set(
    migrationLedger.flatMap((entry) =>
      (entry.routes ?? []).map((route) =>
        [entry.family, route.sourceHost, route.sourceRoute, route.destinationHost, route.destinationRoute].join("|"),
      ),
    ),
  );
  const expected = new Set(expectedRouteInventory.map((route) => route.join("|")));

  for (const route of expected) {
    if (!actual.has(route)) {
      findings.push(`missing expected host-aware route inventory: ${route}`);
    }
  }
  for (const route of actual) {
    if (!expected.has(route)) {
      findings.push(`unexpected host-aware route inventory: ${route}`);
    }
  }
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
