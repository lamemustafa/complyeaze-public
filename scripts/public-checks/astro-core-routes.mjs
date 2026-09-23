import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";
import { canonicalUrl } from "../../packages/public-shell/src/metadata.ts";
import { createReleaseEvidenceFromBuild } from "../release-evidence.mjs";
import { publicRouteRegistry } from "../public-route-registry.mjs";

const requiredFiles = [
  "packages/public-content/src/complyeaze.routes.json",
  "packages/public-content/src/schema.ts",
  "packages/public-shell/src/metadata.ts",
  "apps/complyeaze/src/components/PublicEvidencePage.astro",
  "apps/complyeaze/src/components/PublicGatewayPage.astro",
  "apps/complyeaze/src/components/PublicHomePage.astro",
  "apps/complyeaze/src/components/PublicMigrationLedger.astro",
  "apps/complyeaze/src/components/PublicMigrationPage.astro",
  "apps/complyeaze/src/components/PublicPolicyPage.astro",
  "apps/complyeaze/src/components/PublicProductsPage.astro",
  "apps/complyeaze/src/components/PublicResourcePage.astro",
  "apps/complyeaze/src/components/PublicSanchikaAdoptionPage.astro",
  "apps/complyeaze/src/components/PublicServicePage.astro",
  "apps/complyeaze/src/components/PublicServicesPage.astro",
  "apps/complyeaze/src/layouts/PublicPageLayout.astro",
  "apps/complyeaze/src/pages/[...slug].astro",
  "apps/complyeaze/src/pages/index.astro",
  "apps/complyeaze/src/pages/robots.txt.ts",
  "apps/complyeaze/src/pages/sitemap.xml.ts",
];

const requiredRoutes = [
  "/", "/products/", "/products/pack/", "/products/tools/", "/trust/", "/docs/",
  "/migration/", "/about/", "/contact/", "/privacy/", "/terms/", "/status/",
  "/changelog/", "/release-evidence/", "/sanchika/",
  "/review/craft/",
  "/services/", "/services/accounting-integrations/", "/services/trust-reconciliation/",
];

export function assertAstroCoreRouteSources(root) {
  const findings = requiredFiles
    .filter((filePath) => !existsSync(path.join(root, filePath)))
    .map((filePath) => `${filePath}: missing`);
  const routes = publicRouteRegistry.filter((route) => route.app === "complyeaze");
  if (routes.length !== 19) findings.push(`expected 19 ComplyEaze routes, found ${routes.length}`);
  for (const routePath of requiredRoutes) {
    if (!routes.some((route) => route.urlPath === routePath)) findings.push(`missing ${routePath}`);
  }
  const manifest = definePublicRouteManifest(JSON.parse(
    readFileSync(path.join(root, "packages/public-content/src/complyeaze.routes.json"), "utf8"),
  ));
  const statusRoute = manifest.routes.find((route) => route.urlPath === "/status/");
  if (!statusRoute?.sections.some((section) => section.body.includes(`${routes.length} ComplyEaze routes`))) {
    findings.push("status migration posture must match the canonical ComplyEaze route count");
  }
  if (findings.length === 0) {
    const index = readFileSync(path.join(root, "apps/complyeaze/src/pages/index.astro"), "utf8");
    const catchAll = readFileSync(path.join(root, "apps/complyeaze/src/pages/[...slug].astro"), "utf8");
    const layout = readFileSync(path.join(root, "apps/complyeaze/src/layouts/PublicPageLayout.astro"), "utf8");
    const robots = readFileSync(path.join(root, "apps/complyeaze/src/pages/robots.txt.ts"), "utf8");
    const sitemap = readFileSync(path.join(root, "apps/complyeaze/src/pages/sitemap.xml.ts"), "utf8");
    if (!index.includes("definePublicRouteManifest") || !index.includes("PublicHomePage")) {
      findings.push("ComplyEaze root must render the canonical home route");
    }
    for (const kind of ["resource", "policy", "evidence", "gateway", "products", "migration", "adoption", "public-craft-review", "service", "services"]) {
      if (!catchAll.includes(`route.kind === "${kind}"`)) findings.push(`catch-all missing ${kind} branch`);
    }
    if (!catchAll.includes("assertNever(route)")) findings.push("catch-all rendering is not exhaustive");
    if (!layout.includes('aria-label="Primary navigation"')) findings.push("customer navigation missing");
    if (/href="\/(?:migration|status|docs)\/"/.test(layout)) findings.push("customer nav exposes methodology");
    if (!robots.includes("Disallow: /") || !robots.includes("/sitemap.xml")) {
      findings.push("ComplyEaze robots resource must block indexing and point to the sitemap");
    }
    if (!sitemap.includes("definePublicRouteManifest") || !sitemap.includes("route.urlPath")) {
      findings.push("ComplyEaze sitemap must derive routes from the typed manifest");
    }
  }
  if (findings.length > 0) throw new Error(`Astro core-route source findings:\n${findings.join("\n")}`);
}

export function assertAstroCoreRouteFixtures() {
  if (canonicalUrl("https://complyeaze.com", "/products/") !== "https://complyeaze.com/products/") {
    throw new Error("canonical helper did not preserve the clean route");
  }
  const fixture = {
    app: "fixture",
    origin: "https://fixture.example",
    routes: [{
      description: "Fixture description", eyebrow: "Fixture", heading: "Fixture heading",
      kind: "resource", primaryAction: { href: "/", label: "Home" },
      proof: ["Evidence"], robots: "noindex, nofollow",
      sections: [{ body: "Fixture body", title: "Fixture" }],
      secondaryAction: { href: "https://example.com", label: "Evidence" },
      signalTerms: ["fixture"], slug: "fixture", summary: "Fixture summary",
      title: "Fixture title", urlPath: "/fixture/",
    }],
    schemaVersion: 1,
  };
  definePublicRouteManifest(fixture);
  const invalid = structuredClone(fixture);
  invalid.routes[0].robots = "index, follow";
  let rejected = false;
  try { definePublicRouteManifest(invalid); } catch { rejected = true; }
  if (!rejected) throw new Error("public route fixture accepted indexing before cutover");
  assertServiceRouteFixtures();
}

// The trust-reconciliation page must never print its banned vocabulary, and service
// downloads and contact addresses stay inside their narrow shapes.
function assertServiceRouteFixtures() {
  const manifest = JSON.parse(readFileSync(
    path.join(import.meta.dirname, "../../packages/public-content/src/complyeaze.routes.json"),
    "utf8",
  ));
  const trust = manifest.routes.find((route) => route.urlPath === "/services/trust-reconciliation/");
  if (!trust?.forbiddenTerms?.includes("audit")) {
    throw new Error("trust-reconciliation route must forbid the word audit");
  }
  const mutations = [
    ["banned word in copy", "forbidden term", (route) => { route.summary = `${route.summary} Think of it as an audit.`; }],
    ["banned word nested in a table cell", "forbidden term", (route) => { route.proofTable.rows[0][0] = "Audited bank balance"; }],
    ["banned word hidden by a zero-width space", "forbidden term", (route) => { route.facts[0].body = "We gua\u200Brantee it."; }],
    ["sample outside /samples/", "sample.href", (route) => { route.sample.href = "/files/sample.pdf"; }],
    ["contact email with a scheme", "contact.email", (route) => { route.contact.email = `mailto:${route.contact.email}`; }],
    ["unsourced fact", "sources must not be empty", (route) => { route.facts[0].sources = []; }],
  ];
  for (const [label, reason, mutate] of mutations) {
    const candidate = structuredClone(manifest);
    mutate(candidate.routes.find((route) => route.urlPath === trust.urlPath));
    let message = "";
    try { definePublicRouteManifest(candidate); } catch (error) { message = String(error.message); }
    if (!message.includes(reason)) {
      throw new Error(`service route fixture "${label}" was not rejected for ${reason}: ${message || "accepted"}`);
    }
  }
}

export function assertAstroCoreRouteBuild(root) {
  const evidence = createReleaseEvidenceFromBuild(root, publicRouteRegistry);
  if (evidence.pageCount !== 28) throw new Error(`expected 28 Astro outputs, found ${evidence.pageCount}`);
  const complyeazeDist = path.join(root, "apps/complyeaze/dist");
  const robots = readFileSync(path.join(complyeazeDist, "robots.txt"), "utf8");
  const sitemap = readFileSync(path.join(complyeazeDist, "sitemap.xml"), "utf8");
  if (!robots.includes("Disallow: /") || !robots.includes("https://complyeaze.com/sitemap.xml")) {
    throw new Error("built ComplyEaze robots resource does not preserve noindex readiness");
  }
  for (const route of publicRouteRegistry.filter((entry) => entry.app === "complyeaze" && entry.discoverability !== "review-only")) {
    if (!sitemap.includes(`<loc>${route.origin}${route.urlPath}</loc>`)) {
      throw new Error(`built ComplyEaze sitemap is missing ${route.urlPath}`);
    }
  }
  if (sitemap.includes("/review/craft/")) throw new Error("built ComplyEaze sitemap exposes the craft review route");
}
