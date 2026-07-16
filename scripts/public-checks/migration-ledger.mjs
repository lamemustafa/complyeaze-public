import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { migrationLedger } from "../../packages/public-content/src/complyeaze.migration-ledger.ts";
import { migrationLedger as legacyMigrationLedger } from "../../src/migration-data.mjs";

const ledgerDocPath = "docs/ROUTE_MIGRATION_LEDGER.md";
const migrationPlanPath = "docs/MIGRATION.md";
const canonicalLedgerPath = "packages/public-content/src/complyeaze.migration-ledger.ts";
const contentPackagePath = "packages/public-content/package.json";
const requiredFamilies = ["Root public pages", "Axal marketing", "Pack public pages", "Tools public utilities"];
const requiredFields = ["source", "destination", "status", "cleanup", "parentCleanup", "evidence", "rollback"];
const familyFieldLabels = {
  cleanup: "Cleanup rule",
  destination: "Destination",
  evidence: "Evidence",
  parentCleanup: "Parent cleanup",
  rollback: "Rollback",
  source: "Source",
  status: "Status",
};
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
  ["Axal marketing", "axal.complyeaze.com", "/", "axal.complyeaze.com", "/"],
  ["Axal marketing", "axal.complyeaze.com", "/ca-practice-management-software", "axal.complyeaze.com", "/ca-practice-management-software"],
  ["Axal marketing", "axal.complyeaze.com", "/gst-notice-management-software", "axal.complyeaze.com", "/gst-notice-management-software"],
  ["Axal marketing", "axal.complyeaze.com", "/compliance-calendar-software-india", "axal.complyeaze.com", "/compliance-calendar-software-india"],
  ["Axal marketing", "axal.complyeaze.com", "/gst-reconciliation-evidence-review", "axal.complyeaze.com", "/gst-reconciliation-evidence-review"],
  ["Axal marketing", "axal.complyeaze.com", "/client-document-collection-portal-access", "axal.complyeaze.com", "/client-document-collection-portal-access"],
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

export async function assertMigrationLedgerFixtures(root) {
  const contentPackage = JSON.parse(readFile(root, contentPackagePath));
  if (
    contentPackage.exports?.["./complyeaze-migration-ledger"] !==
    "./src/complyeaze.migration-ledger.ts"
  ) {
    throw new Error(`${contentPackagePath}: missing canonical migration-ledger export`);
  }
  const absolutePath = path.join(root, canonicalLedgerPath);
  if (!existsSync(absolutePath)) {
    throw new Error(`${canonicalLedgerPath}: missing canonical migration-ledger module`);
  }
  const module = await import(pathToFileURL(absolutePath).href);
  if (typeof module.defineMigrationLedger !== "function") {
    throw new Error(`${canonicalLedgerPath}: missing defineMigrationLedger export`);
  }
  if (!Array.isArray(module.migrationLedger)) {
    throw new Error(`${canonicalLedgerPath}: missing canonical migrationLedger export`);
  }
  if (JSON.stringify(module.migrationLedger) !== JSON.stringify(legacyMigrationLedger)) {
    throw new Error(`${canonicalLedgerPath}: canonical ledger diverges from the legacy adapter`);
  }
  const validLedger = [
    {
      cleanup: "Keep cleanup blocked until cutover evidence is reviewed.",
      destination: "complyeaze.com/trust/",
      evidence: "Hosted route and redirect evidence are pending.",
      family: "Fixture family",
      parentCleanup: "blocked; requires separate private-app cleanup PR",
      rollback: "Keep the source route until rollback is tested.",
      routes: [
        {
          cleanupStatus: "cleanup blocked",
          destinationHost: "complyeaze.com",
          destinationRoute: "/trust/",
          evidenceStatus: "hosted route evidence pending",
          hostedEvidenceUrl: "not recorded",
          parentCleanupPr: "not linked",
          redirectPlan: "redirect not configured",
          redirectStatus: "redirect not configured",
          rollback: "keep source route",
          rollbackCommandOrOwner: "owner not assigned",
          sourceHost: "complyeaze.com",
          sourceRoute: "/legacy-trust",
        },
      ],
      source: "complyeaze.com/legacy-trust",
      status: "seeded; cleanup blocked",
    },
  ];
  module.defineMigrationLedger(validLedger);

  const malformedHostLedger = structuredClone(validLedger);
  malformedHostLedger[0].routes[0].sourceHost = "https://complyeaze.com/private";
  assertRejectedLedger(
    module.defineMigrationLedger,
    malformedHostLedger,
    "migration ledger accepted a malformed source host",
  );

  const malformedRouteLedger = structuredClone(validLedger);
  malformedRouteLedger[0].routes[0].destinationRoute = "https://complyeaze.com/trust/";
  assertRejectedLedger(
    module.defineMigrationLedger,
    malformedRouteLedger,
    "migration ledger accepted a non-root-relative destination route",
  );

  const duplicateFamilyLedger = [validLedger[0], structuredClone(validLedger[0])];
  duplicateFamilyLedger[1].routes[0].sourceRoute = "/another-legacy-trust";
  assertRejectedLedger(
    module.defineMigrationLedger,
    duplicateFamilyLedger,
    "migration ledger accepted duplicate family names",
  );

  const duplicateRouteLedger = structuredClone(validLedger);
  duplicateRouteLedger[0].routes.push({
    ...duplicateRouteLedger[0].routes[0],
    destinationRoute: "/docs/",
  });
  assertRejectedLedger(
    module.defineMigrationLedger,
    duplicateRouteLedger,
    "migration ledger accepted duplicate source host and route identities",
  );

  const missingFieldLedger = structuredClone(validLedger);
  delete missingFieldLedger[0].evidence;
  assertRejectedLedger(
    module.defineMigrationLedger,
    missingFieldLedger,
    "migration ledger accepted a family with a missing required field",
  );

  const completedEvidenceLedger = structuredClone(validLedger);
  completedEvidenceLedger[0].routes[0].evidenceStatus = "hosted route evidence complete";
  assertRejectedLedger(
    module.defineMigrationLedger,
    completedEvidenceLedger,
    "migration ledger accepted evidence that was not explicitly pending",
  );

  const unblockedCleanupLedger = structuredClone(validLedger);
  unblockedCleanupLedger[0].routes[0].cleanupStatus = "cleanup ready";
  assertRejectedLedger(
    module.defineMigrationLedger,
    unblockedCleanupLedger,
    "migration ledger accepted cleanup that was not explicitly blocked",
  );

  const unsafeParentCleanupLedger = structuredClone(validLedger);
  unsafeParentCleanupLedger[0].parentCleanup = "blocked pending later review";
  assertRejectedLedger(
    module.defineMigrationLedger,
    unsafeParentCleanupLedger,
    "migration ledger accepted parent cleanup without a separate private-app cleanup PR",
  );

  const emptyRoutesLedger = structuredClone(validLedger);
  emptyRoutesLedger[0].routes = [];
  assertRejectedLedger(
    module.defineMigrationLedger,
    emptyRoutesLedger,
    "migration ledger accepted a family without route-level entries",
  );

  const docsText = readFile(root, ledgerDocPath);
  const firstRoute = migrationLedger[0].routes[0];
  const firstMarkdownRow = formatMarkdownRouteRow(firstRoute);
  assertMarkdownMutationDetected(
    docsText.replace(firstMarkdownRow, ""),
    "migration ledger accepted Markdown with a missing route row",
  );
  assertMarkdownMutationDetected(
    docsText.replace(
      firstMarkdownRow,
      firstMarkdownRow.replace("`complyeaze.com`", "`wrong.example`"),
    ),
    "migration ledger accepted Markdown with a stale route host",
  );
  assertMarkdownMutationDetected(
    docsText.replace(
      firstMarkdownRow,
      firstMarkdownRow.replace(firstRoute.evidenceStatus, "hosted evidence unexpectedly complete"),
    ),
    "migration ledger accepted Markdown with stale route evidence",
  );
  assertMarkdownMutationDetected(
    docsText.replace(
      firstMarkdownRow,
      firstMarkdownRow.replace(firstRoute.parentCleanupPr, "cleanup-pr-123"),
    ),
    "migration ledger accepted Markdown with a stale cleanup PR",
  );
  assertMarkdownMutationDetected(
    `${docsText}\n${firstMarkdownRow.replace("`/`", "`/stale-route`")}`,
    "migration ledger accepted Markdown with an unexpected stale route row",
  );
  assertMarkdownMutationDetected(
    `${docsText}\n${firstMarkdownRow}`,
    "migration ledger accepted Markdown with a duplicate route row",
  );
  const packEntry = migrationLedger.find((entry) => entry.family === "Pack public pages");
  const docsWithoutPackStatus = mutateMarkdownFamilySection(
    docsText,
    packEntry.family,
    (section) => section.replace(`- Status: ${packEntry.status}`, ""),
  );
  assertMarkdownMutationDetected(
    docsWithoutPackStatus,
    "migration ledger accepted Markdown with a missing family-scoped status",
  );
  const docsWithRootRowMovedToPack = mutateMarkdownFamilySection(
    mutateMarkdownFamilySection(docsText, migrationLedger[0].family, (section) =>
      section.replace(firstMarkdownRow, ""),
    ),
    packEntry.family,
    (section) => `${section}\n${firstMarkdownRow}`,
  );
  assertMarkdownMutationDetected(
    docsWithRootRowMovedToPack,
    "migration ledger accepted a Markdown route row moved between families",
  );

  const renderedFamilyArticles = migrationLedger.map((entry) => formatRenderedFamilyArticle(entry));
  const renderedLedger = `<section>${renderedFamilyArticles.join("")}</section>`;
  const firstRenderedRow = formatRenderedRouteRow(firstRoute);
  assertRenderedMutationDetected(
    renderedLedger.replace(firstRenderedRow, ""),
    "migration ledger accepted rendered HTML with a missing route row",
  );
  assertRenderedMutationDetected(
    renderedLedger.replace(
      firstRenderedRow,
      firstRenderedRow.replace(firstRoute.evidenceStatus, "hosted evidence unexpectedly complete"),
    ),
    "migration ledger accepted rendered HTML with stale route evidence",
  );
  const packArticle = formatRenderedFamilyArticle(packEntry);
  const packArticleWithoutParentCleanup = packArticle.replace(
    formatRenderedFamilyField("parentCleanup", packEntry.parentCleanup),
    "",
  );
  assertRenderedMutationDetected(
    renderedLedger.replace(packArticle, packArticleWithoutParentCleanup),
    "migration ledger accepted rendered HTML with a missing family-scoped parent cleanup",
  );
  const rootArticle = renderedFamilyArticles[0];
  const rootArticleWithoutFirstRoute = rootArticle.replace(firstRenderedRow, "");
  const packArticleWithRootRoute = packArticle.replace("</table>", `${firstRenderedRow}</table>`);
  assertRenderedMutationDetected(
    renderedLedger
      .replace(rootArticle, rootArticleWithoutFirstRoute)
      .replace(packArticle, packArticleWithRootRoute),
    "migration ledger accepted a rendered route row moved between families",
  );
}

function assertRejectedLedger(defineMigrationLedger, ledger, message) {
  let rejected = false;
  try {
    defineMigrationLedger(ledger);
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error(message);
}

function assertMarkdownMutationDetected(docsText, message) {
  const findings = [];
  assertMarkdownFamilyParity(docsText, migrationLedger, findings);
  assertMarkdownRouteParity(docsText, migrationLedger, findings);
  if (findings.length === 0) throw new Error(message);
}

function assertRenderedMutationDetected(html, message) {
  const findings = [];
  assertRenderedFamilyParity(html, "rendered fixture", migrationLedger, findings);
  assertRenderedRouteParity(html, "rendered fixture", migrationLedger, findings);
  if (findings.length === 0) throw new Error(message);
}

export function assertMigrationLedger(root) {
  const docsText = readFile(root, ledgerDocPath);
  const migrationPlan = readFile(root, migrationPlanPath);
  const normalizedDocsText = docsText.toLowerCase();
  const findings = [];
  const routeSourceCounts = new Map();

  if (!migrationPlan.includes(canonicalLedgerPath)) {
    findings.push(`${migrationPlanPath}: missing canonical migration-ledger path`);
  }

  for (const family of requiredFamilies) {
    if (!normalizedDocsText.includes(family.toLowerCase())) {
      findings.push(`${ledgerDocPath}: missing family ${family}`);
    }
    if (!migrationLedger.some((entry) => entry.family.toLowerCase() === family.toLowerCase())) {
      findings.push(`${canonicalLedgerPath}: missing family ${family}`);
    }
  }

  const rootPublicPages = migrationLedger.find((entry) => entry.family === "Root public pages");
  for (const route of ["/trust/", "/docs/", "/migration/"]) {
    if (!rootPublicPages?.destination.includes(route)) {
      findings.push(`Root public pages: destination summary missing ${route}`);
    }
  }

  const axalMarketing = migrationLedger.find((entry) => entry.family === "Axal marketing");
  const axalFamilyCopy = [
    axalMarketing?.destination,
    axalMarketing?.evidence,
    axalMarketing?.status,
  ]
    .join(" ")
    .toLowerCase();
  if (
    !axalFamilyCopy.includes("typed preview parity") ||
    !axalFamilyCopy.includes("apps/axal") ||
    !axalFamilyCopy.includes("cleanup blocked")
  ) {
    findings.push(
      "Axal marketing: family copy must record apps/axal typed preview parity while keeping cleanup blocked",
    );
  }
  if (
    !axalMarketing?.routes.every((route) => {
      const evidenceStatus = route.evidenceStatus.toLowerCase();
      return ["typed preview parity", "apps/axal", "hosted", "pending"].every((term) =>
        evidenceStatus.includes(term),
      );
    })
  ) {
    findings.push(
      "Axal marketing: every route must record apps/axal typed preview parity and pending hosted evidence",
    );
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
    }
  }

  assertMarkdownFamilyParity(docsText, migrationLedger, findings);
  assertMarkdownRouteParity(docsText, migrationLedger, findings);

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
  const renderedOutputs = [
    ["migration/index.html", path.join(root, "dist", "migration", "index.html")],
    [
      "apps/complyeaze/dist/migration/index.html",
      path.join(root, "apps", "complyeaze", "dist", "migration", "index.html"),
    ],
  ];
  for (const [label, migrationHtmlPath] of renderedOutputs) {
    if (!existsSync(migrationHtmlPath)) {
      findings.push(`${label}: missing rendered migration ledger`);
      continue;
    }
    const migrationHtml = readFileSync(migrationHtmlPath, "utf8");
    assertRenderedFamilyParity(migrationHtml, label, migrationLedger, findings);
    assertRenderedRouteParity(migrationHtml, label, migrationLedger, findings);
  }
}

function assertMarkdownFamilyParity(docsText, ledger, findings) {
  for (const entry of ledger) {
    const section = markdownFamilySection(docsText, entry.family);
    if (section === null) {
      findings.push(`${ledgerDocPath}: missing family section ${entry.family}`);
      continue;
    }
    for (const field of requiredFields) {
      const expectedLine = `- ${familyFieldLabels[field]}: ${entry[field]}`;
      if (!section.includes(expectedLine)) {
        findings.push(`${ledgerDocPath}: ${entry.family} diverges on ${field}`);
      }
    }
  }
}

function assertRenderedFamilyParity(html, label, ledger, findings) {
  const articles = renderedFamilyArticles(html);
  for (const entry of ledger) {
    const article = findRenderedFamilyArticle(articles, entry.family);
    if (!article) {
      findings.push(`${label}: missing rendered family article ${entry.family}`);
      continue;
    }
    const status = article.match(/<header\b[^>]*>[\s\S]*?<span\b[^>]*>([\s\S]*?)<\/span>/i);
    if (!status || normalizeRenderedText(status[1]) !== entry.status) {
      findings.push(`${label}: missing rendered status for ${entry.family}`);
    }
    const definitionValues = new Map(
      [...article.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)].map(
        (match) => [normalizeRenderedText(match[1]), normalizeRenderedText(match[2])],
      ),
    );
    for (const field of requiredFields.filter((field) => field !== "status")) {
      const expected = normalizePlainText(entry[field]);
      if (definitionValues.get(familyFieldLabels[field]) !== expected) {
        findings.push(`${label}: missing rendered ${field} for ${entry.family}`);
      }
    }
  }
}

function assertRenderedRouteParity(html, label, ledger, findings) {
  const articles = renderedFamilyArticles(html);
  for (const entry of ledger) {
    const article = findRenderedFamilyArticle(articles, entry.family);
    if (!article) continue;
    const expectedRows = (entry.routes ?? []).map((route) =>
      renderedRouteRowKey(Object.values(routeDisplayFields(route))),
    );
    const actualRows = renderedRouteRows(article);
    assertRowCountParity(expectedRows, actualRows, `${label}: ${entry.family}`, findings);
  }
}

function assertMarkdownRouteParity(docsText, ledger, findings) {
  for (const entry of ledger) {
    const section = markdownFamilySection(docsText, entry.family);
    if (section === null) continue;
    const expectedRows = (entry.routes ?? []).map((route) => formatMarkdownRouteRow(route));
    const actualRows = section
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^\|\s*`/.test(line));
    assertRowCountParity(expectedRows, actualRows, `${ledgerDocPath}: ${entry.family}`, findings);
  }
}

function assertRowCountParity(expectedRows, actualRows, label, findings) {
  const expectedCounts = countRows(expectedRows);
  const actualCounts = countRows(actualRows);

  for (const [row, expectedCount] of expectedCounts) {
    const actualCount = actualCounts.get(row) ?? 0;
    if (actualCount < expectedCount) {
      findings.push(`${label}: missing exact route row: ${row}`);
    } else if (actualCount > expectedCount) {
      findings.push(`${label}: duplicate route row: ${row}`);
    }
  }
  for (const row of actualCounts.keys()) {
    if (!expectedCounts.has(row)) {
      findings.push(`${label}: unexpected route row: ${row}`);
    }
  }
}

function renderedFamilyArticles(html) {
  return [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)].map(
    (match) => match[0],
  );
}

function findRenderedFamilyArticle(articles, family) {
  return articles.find((candidate) => {
    const heading = candidate.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
    return heading && normalizeRenderedText(heading[1]) === family;
  });
}

function renderedRouteRows(article) {
  return [...article.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match) =>
      [...match[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((cell) =>
        normalizeRenderedText(cell[1]),
      ),
    )
    .filter((cells) => cells.length === 9 && cells[0].toLowerCase() !== "source host")
    .map(renderedRouteRowKey);
}

function countRows(rows) {
  const counts = new Map();
  for (const row of rows) counts.set(row, (counts.get(row) ?? 0) + 1);
  return counts;
}

function formatMarkdownRouteRow(route) {
  const fields = routeDisplayFields(route);
  return `| \`${fields.sourceHost}\` | \`${fields.sourceRoute}\` | \`${fields.destinationHost}\` | \`${fields.destinationRoute}\` | ${fields.cleanup} | ${fields.evidence} | ${fields.redirect} | ${fields.cleanupPr} | ${fields.rollback} |`;
}

function formatRenderedRouteRow(route) {
  return `<tr>${Object.values(routeDisplayFields(route))
    .map((value) => `<td>${escapeHtmlText(value)}</td>`)
    .join("")}</tr>`;
}

function formatRenderedFamilyArticle(entry) {
  return `<article><header><h2>${escapeHtmlText(entry.family)}</h2><span>${escapeHtmlText(entry.status)}</span></header><dl>${requiredFields
    .filter((field) => field !== "status")
    .map((field) => formatRenderedFamilyField(field, entry[field]))
    .join("")}</dl><table>${entry.routes.map((route) => formatRenderedRouteRow(route)).join("")}</table></article>`;
}

function formatRenderedFamilyField(field, value) {
  return `<div><dt>${familyFieldLabels[field]}</dt><dd>${escapeHtmlText(value)}</dd></div>`;
}

function mutateMarkdownFamilySection(docsText, family, mutate) {
  const section = markdownFamilySection(docsText, family);
  const heading = `## ${family}`;
  const start = docsText.indexOf(heading);
  const sectionEnd = start + section.length;
  return `${docsText.slice(0, start)}${mutate(section)}${docsText.slice(sectionEnd)}`;
}

function markdownFamilySection(docsText, family) {
  const heading = `## ${family}`;
  const start = docsText.indexOf(heading);
  if (start === -1) return null;
  const end = docsText.indexOf("\n## ", start + heading.length);
  return docsText.slice(start, end === -1 ? docsText.length : end);
}

function routeDisplayFields(route) {
  return {
    sourceHost: route.sourceHost,
    sourceRoute: route.sourceRoute,
    destinationHost: route.destinationHost,
    destinationRoute: route.destinationRoute,
    cleanup: route.cleanupStatus,
    evidence: `${route.evidenceStatus}; hosted evidence: ${route.hostedEvidenceUrl}`,
    redirect: `${route.redirectStatus}; plan: ${route.redirectPlan}`,
    cleanupPr: route.parentCleanupPr,
    rollback: `${route.rollback}; owner/path: ${route.rollbackCommandOrOwner}`,
  };
}

function escapeHtmlText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeRenderedText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePlainText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function renderedRouteRowKey(cells) {
  return JSON.stringify(cells.map((cell) => normalizeRenderedText(cell)));
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
