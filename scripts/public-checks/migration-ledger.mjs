import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { migrationLedger } from "../../src/migration-data.mjs";

const ledgerDocPath = "docs/ROUTE_MIGRATION_LEDGER.md";
const requiredFamilies = ["Root public pages", "Axal marketing", "Pack public pages", "Tools public utilities"];
const requiredFields = ["source", "destination", "status", "cleanup", "parentCleanup", "evidence", "rollback"];
const requiredRouteFields = ["sourceRoute", "destinationRoute", "cleanupStatus", "evidenceStatus", "redirectStatus", "rollback"];

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
      if (!migrationHtml.includes(route.sourceRoute)) {
        findings.push(`migration/index.html: missing rendered source route ${route.sourceRoute}`);
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
    routeSourceCounts.set(route.sourceRoute, (routeSourceCounts.get(route.sourceRoute) ?? 0) + 1);
  }
  if (route.cleanupStatus && !route.cleanupStatus.toLowerCase().includes("blocked")) {
    findings.push(`${entry.family} ${route.sourceRoute}: cleanup must remain blocked until cutover evidence exists`);
  }
  if (route.evidenceStatus && !route.evidenceStatus.toLowerCase().includes("pending")) {
    findings.push(`${entry.family} ${route.sourceRoute}: evidence status must make pending evidence explicit`);
  }
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
