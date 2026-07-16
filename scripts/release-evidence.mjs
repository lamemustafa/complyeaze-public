import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { appDistPath } from "./public-route-registry.mjs";

export function createReleaseEvidence(routes, readHtml) {
  const ownership = new Set();
  const evidenceRoutes = routes.map((route) => {
    const canonical = new URL(route.urlPath, route.origin).href;
    const owner = `${route.origin}${route.urlPath}`;
    if (ownership.has(owner)) throw new Error(`Duplicate release-evidence route ${owner}`);
    ownership.add(owner);
    const html = readHtml(route);
    for (const [label, expected] of [
      ["title", `<title>${escapeHtml(route.title)}</title>`],
      ["description", `name="description" content="${escapeHtml(route.description)}"`],
      ["robots", `name="robots" content="${escapeHtml(route.robots)}"`],
      ["canonical", `rel="canonical" href="${escapeHtml(canonical)}"`],
    ]) {
      if (!html.includes(expected)) throw new Error(`${owner}: built HTML has mismatched ${label}`);
    }
    const headingPattern = new RegExp(`<h1\\b[^>]*>${escapeRegex(escapeHtml(route.heading))}</h1>`);
    if (!headingPattern.test(html)) throw new Error(`${owner}: built HTML has mismatched heading`);
    return {
      app: route.app,
      buildEvidence: appDistPath(route),
      canonical,
      description: route.description,
      discoverability: route.discoverability ?? "standard",
      origin: route.origin,
      outputPath: route.outputPath,
      robots: route.robots,
      slug: route.slug,
      title: route.title,
      urlPath: route.urlPath,
    };
  });
  return { pageCount: evidenceRoutes.length, routes: evidenceRoutes, schemaVersion: 1 };
}

export function createReleaseEvidenceFromBuild(root, routes) {
  assertExactHtmlOutputs(root, routes);
  return createReleaseEvidence(routes, (route) => {
    const filePath = path.join(root, appDistPath(route));
    if (!existsSync(filePath)) throw new Error(`${appDistPath(route)}: missing built HTML`);
    return readFileSync(filePath, "utf8");
  });
}

function assertExactHtmlOutputs(root, routes) {
  for (const app of new Set(routes.map((route) => route.app))) {
    const dist = path.join(root, "apps", app, "dist");
    if (!existsSync(dist)) throw new Error(`apps/${app}/dist: missing; run Astro builds first`);
    const expected = routes.filter((route) => route.app === app).map((route) => route.outputPath).sort();
    const actual = walk(dist)
      .filter((filePath) => filePath.endsWith(".html"))
      .map((filePath) => path.relative(dist, filePath))
      .sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`apps/${app}/dist: HTML outputs do not match canonical manifest`);
    }
  }
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const filePath = path.join(directory, name);
    return statSync(filePath).isDirectory() ? walk(filePath) : [filePath];
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
