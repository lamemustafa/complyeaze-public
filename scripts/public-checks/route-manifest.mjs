import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { publicRouteRegistry } from "../public-route-registry.mjs";

const evidencePath = "test-results/public-build/route-manifest.json";

function readManifest(root) {
  const absolutePath = path.join(root, evidencePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing ${evidencePath}. Run pnpm build first.`);
  }
  return JSON.parse(readFileSync(absolutePath, "utf8"));
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

  if (manifest.schemaVersion !== 1) findings.push("schemaVersion must be 1");
  if (manifest.pageCount !== publicRouteRegistry.length) {
    findings.push(
      `pageCount ${manifest.pageCount} does not match canonical route count ${publicRouteRegistry.length}`,
    );
  }
  if (routes.length !== publicRouteRegistry.length) {
    findings.push(
      `routes length ${routes.length} does not match canonical route count ${publicRouteRegistry.length}`,
    );
  }

  assertUnique(routes.map((route) => `${route.origin}${route.urlPath}`), "route ownership", findings);
  assertUnique(routes.map((route) => route.buildEvidence), "buildEvidence", findings);

  const routesByOwner = new Map(routes.map((route) => [`${route.origin}${route.urlPath}`, route]));
  for (const source of publicRouteRegistry) {
    const owner = `${source.origin}${source.urlPath}`;
    const route = routesByOwner.get(owner);
    if (!route) {
      findings.push(`${owner}: missing release-evidence entry`);
      continue;
    }
    for (const field of [
      "app",
      "slug",
      "urlPath",
      "outputPath",
      "title",
      "description",
      "origin",
      "robots",
    ]) {
      if (route[field] !== source[field]) findings.push(`${owner}: ${field} does not match manifest`);
    }
    if (route.canonical !== owner) findings.push(`${owner}: canonical does not match ownership`);
    const expectedBuildEvidence = `apps/${source.app}/dist/${source.outputPath}`;
    if (route.buildEvidence !== expectedBuildEvidence) {
      findings.push(`${owner}: buildEvidence does not match ${expectedBuildEvidence}`);
    }
    if (!existsSync(path.join(root, expectedBuildEvidence))) {
      findings.push(`${owner}: built HTML is missing`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Route manifest findings:\n${findings.join("\n")}`);
  }
}
