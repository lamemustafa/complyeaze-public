import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pages } from "../../src/site-data.mjs";

const ORIGIN = "https://complyeaze.com";

function readManifest(root) {
  const manifestPath = path.join(root, "dist", "route-manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error("Missing dist/route-manifest.json. Run pnpm build first.");
  }
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function assertUnique(values, label, findings) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) findings.push(`duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

export function assertRouteManifest(root) {
  const manifest = readManifest(root);
  const findings = [];
  const routes = Array.isArray(manifest.routes) ? manifest.routes : [];
  const sitemap = existsSync(path.join(root, "dist", "sitemap.xml"))
    ? readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8")
    : "";

  if (manifest.schemaVersion !== 1) findings.push("schemaVersion must be 1");
  if (manifest.origin !== ORIGIN) findings.push(`origin must be ${ORIGIN}`);
  if (manifest.pageCount !== pages.length) {
    findings.push(`pageCount ${manifest.pageCount} does not match source page count ${pages.length}`);
  }
  if (routes.length !== pages.length) {
    findings.push(`routes length ${routes.length} does not match source page count ${pages.length}`);
  }

  assertUnique(routes.map((route) => route.urlPath), "urlPath", findings);
  assertUnique(routes.map((route) => route.outputPath), "outputPath", findings);
  assertUnique(routes.map((route) => route.canonical), "canonical", findings);

  const routesByPath = new Map(routes.map((route) => [route.urlPath, route]));
  for (const page of pages) {
    const route = routesByPath.get(page.urlPath);
    const canonical = `${ORIGIN}${page.urlPath}`;
    if (!route) {
      findings.push(`${page.urlPath}: missing route manifest entry`);
      continue;
    }

    for (const field of ["slug", "urlPath", "outputPath", "title", "description"]) {
      if (route[field] !== page[field]) {
        findings.push(`${page.urlPath}: ${field} does not match source page data`);
      }
    }
    if (route.type !== (page.type ?? "core")) {
      findings.push(`${page.urlPath}: type does not match source page data`);
    }
    if (route.canonical !== canonical) {
      findings.push(`${page.urlPath}: canonical does not match ${canonical}`);
    }
    if (!existsSync(path.join(root, "dist", page.outputPath))) {
      findings.push(`${page.urlPath}: outputPath file is missing`);
    }
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
      findings.push(`${page.urlPath}: canonical is missing from sitemap.xml`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Route manifest findings:\n${findings.join("\n")}`);
  }
}
