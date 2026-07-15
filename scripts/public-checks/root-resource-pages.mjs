import { readFileSync } from "node:fs";
import path from "node:path";
import rawManifest from "../../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";
import { rootResourcePages } from "../../src/root-resource-data.mjs";
import { pages } from "../../src/site-data.mjs";

const requiredRoutes = ["/about/", "/contact/"];
const unsafePatterns = [
  { label: "parent contact API route", pattern: /ROUTES\.api\.contact|Request a callback|Select Service/i },
  { label: "phone number", pattern: /\+?\d[\d\s().-]{8,}\d/ },
  { label: "office address", pattern: /RIICO|Housing Board|Sunsquare|Bhiwari|Alwar/i },
  { label: "individual profile link", pattern: /linkedin\.com|twitter\.com|x\.com/i },
  { label: "unsupported shield claim", pattern: /shield you from|fines or lawsuits|hassle-free compliance/i }
];

export function assertRootResourcePageSources() {
  const manifest = definePublicRouteManifest(rawManifest);
  const canonicalRoutes = manifest.routes.filter((route) => route.kind === "resource");
  const findings = [];
  if (rootResourcePages.length !== canonicalRoutes.length) {
    findings.push("legacy root resources must adapt every canonical resource route exactly once");
  }
  for (const route of canonicalRoutes) {
    const page = rootResourcePages.find((candidate) => candidate.urlPath === route.urlPath);
    if (!page) {
      findings.push(`${route.urlPath}: missing from legacy root-resource adapter`);
      continue;
    }
    for (const field of ["slug", "urlPath", "title", "description", "eyebrow", "heading", "summary"]) {
      if (page[field] !== route[field]) findings.push(`${route.urlPath}: legacy adapter diverges on ${field}`);
    }
  }
  if (findings.length > 0) {
    throw new Error(`Root resource source findings:\n${findings.join("\n")}`);
  }
}

export function assertRootResourcePages(root) {
  const manifest = definePublicRouteManifest(rawManifest);
  const pagePaths = new Set(pages.map((page) => page.urlPath));
  const dataPaths = new Set(rootResourcePages.map((page) => page.urlPath));
  const findings = [];

  for (const route of requiredRoutes) {
    if (!pagePaths.has(route)) findings.push(`${route}: missing from site pages`);
    if (!dataPaths.has(route)) findings.push(`${route}: missing from root resource data`);
  }

  const resourceRoutes = manifest.routes.filter((route) => route.kind === "resource");
  if (rootResourcePages.length !== resourceRoutes.length) {
    findings.push("legacy root resources must adapt every canonical resource route exactly once");
  }

  for (const route of resourceRoutes) {
    const page = rootResourcePages.find((candidate) => candidate.urlPath === route.urlPath);
    if (!page) continue;
    for (const field of ["slug", "urlPath", "title", "description", "eyebrow", "heading", "summary"]) {
      if (page[field] !== route[field]) findings.push(`${route.urlPath}: legacy adapter diverges on ${field}`);
    }
    if (page.primaryCta !== route.primaryAction || page.secondaryCta !== route.secondaryAction) {
      findings.push(`${route.urlPath}: legacy adapter must preserve canonical action objects`);
    }
  }

  for (const page of rootResourcePages) {
    const text = JSON.stringify(page);
    const html = readFileSync(path.join(root, "dist", page.outputPath), "utf8");
    for (const { label, pattern } of unsafePatterns) {
      if (pattern.test(text) || pattern.test(html)) findings.push(`${page.outputPath}: ${label}`);
    }
    if (page.urlPath === "/contact/" && !html.includes("must stay out of public issues")) {
      findings.push(`${page.outputPath}: missing sensitive-data public issue warning`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Root resource page findings:\n${findings.join("\n")}`);
  }
}
