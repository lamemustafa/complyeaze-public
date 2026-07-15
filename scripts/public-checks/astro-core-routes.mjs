import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";

const manifestPath = "packages/public-content/src/complyeaze.routes.json";
const requiredSourceFiles = [
  "packages/public-content/src/schema.ts",
  "packages/public-shell/src/metadata.ts",
  "apps/complyeaze/src/layouts/PublicPageLayout.astro",
  "apps/complyeaze/src/pages/[...slug].astro",
];
const requiredRoutes = ["/about/", "/contact/"];

export function assertAstroCoreRouteSources(root) {
  const findings = [];
  for (const filePath of [manifestPath, ...requiredSourceFiles]) {
    if (!existsSync(path.join(root, filePath))) findings.push(`${filePath}: missing`);
  }
  const manifest = readManifest(root, findings);
  if (manifest) validateManifest(manifest, findings);
  if (findings.length > 0) {
    throw new Error(`Astro core-route source findings:\n${findings.join("\n")}`);
  }
}

export function assertAstroCoreRouteFixtures() {
  const nestedManifest = {
    app: "complyeaze",
    origin: "https://complyeaze.com",
    routes: [
      {
        description: "Nested route fixture",
        eyebrow: "Nested fixture",
        heading: "Nested route",
        primaryAction: { href: "/", label: "Home" },
        proof: ["Nested routes remain representable."],
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        secondaryAction: { href: "https://example.com/evidence", label: "Evidence" },
        signalTerms: ["nested"],
        slug: "products/pack",
        summary: "Nested public route fixture",
        title: "Nested route fixture",
        urlPath: "/products/pack/",
      },
    ],
    schemaVersion: 1,
  };
  definePublicRouteManifest(nestedManifest);

  const unsafeManifest = structuredClone(nestedManifest);
  unsafeManifest.routes[0].primaryAction.href = "javascript:alert(1)";
  let rejectedUnsafeHref = false;
  try {
    definePublicRouteManifest(unsafeManifest);
  } catch (error) {
    rejectedUnsafeHref = String(error.message).includes("internal trailing-slash path or HTTPS URL");
  }
  if (!rejectedUnsafeHref) throw new Error("Astro route fixture accepted an unsafe action URL");

  const malformedFindings = [];
  validateManifest({ ...nestedManifest, routes: [null] }, malformedFindings);
  if (!malformedFindings.some((finding) => finding.includes("routes[0] must be an object"))) {
    throw new Error("Astro route fixture did not report a malformed route entry");
  }
}

export function assertAstroCoreRouteBuild(root) {
  const findings = [];
  const manifest = readManifest(root, findings);
  if (!manifest) return fail(findings);
  validateManifest(manifest, findings);
  if (findings.length > 0) return fail(findings);

  const appDist = path.join(root, "apps", manifest.app, "dist");
  for (const route of manifest.routes ?? []) {
    const legacyOutputPath = path.join(
      root,
      "dist",
      route.urlPath.replace(/^\/+|\/+$/g, ""),
      "index.html",
    );
    const outputPath = path.join(
      root,
      "apps",
      manifest.app,
      "dist",
      route.urlPath.replace(/^\/+|\/+$/g, ""),
      "index.html",
    );
    if (!existsSync(legacyOutputPath)) {
      findings.push(`${route.urlPath}: missing legacy build output for parity check`);
      continue;
    }
    if (!existsSync(outputPath)) {
      findings.push(`${route.urlPath}: missing Astro build output`);
      continue;
    }
    const legacyHtml = readFileSync(legacyOutputPath, "utf8");
    const html = readFileSync(outputPath, "utf8");
    for (const [label, snippet] of [
      ["title", `<title>${route.title}</title>`],
      ["description", `name="description" content="${route.description}"`],
      ["canonical", `rel="canonical" href="${manifest.origin}${route.urlPath}"`],
      ["robots", 'name="robots" content="noindex, nofollow"'],
      ["main landmark", "<main"],
      ["skip link", 'href="#main-content"'],
    ]) {
      if (!html.includes(snippet)) findings.push(`${route.urlPath}: missing ${label}`);
    }
    const headingPattern = new RegExp(
      `<h1\\b[^>]*\\bid="page-title"[^>]*>${escapeRegExp(route.heading)}</h1>`,
    );
    if (!headingPattern.test(html)) findings.push(`${route.urlPath}: missing heading`);
    if (!html.includes(`class="brand" href="${manifest.origin}/"`)) {
      findings.push(`${route.urlPath}: preview brand must link to the production public home`);
    }
    for (const [label, value] of [
      ["title", route.title],
      ["description", route.description],
      ["eyebrow", route.eyebrow],
      ["heading", route.heading],
      ["summary", route.summary],
      ["primary action label", route.primaryAction.label],
      ["primary action href", route.primaryAction.href],
      ["secondary action label", route.secondaryAction.label],
      ["secondary action href", route.secondaryAction.href],
      ...route.sections.flatMap((section) => [
        ["section title", section.title],
        ["section body", section.body],
        ...(section.meta ? [["section meta", section.meta]] : []),
      ]),
      ...route.proof.map((item) => ["proof item", item]),
    ]) {
      if (!legacyHtml.includes(value)) {
        findings.push(`${route.urlPath}: legacy build diverges on ${label}`);
      }
      if (!html.includes(value)) {
        findings.push(`${route.urlPath}: Astro build diverges on ${label}`);
      }
    }
    for (const href of [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1])) {
      if (!href.startsWith("/")) continue;
      const targetPath = path.join(
        appDist,
        href.replace(/^\/+|\/+$/g, ""),
        "index.html",
      );
      if (!existsSync(targetPath)) findings.push(`${route.urlPath}: unresolved preview link ${href}`);
    }
  }
  if (findings.length > 0) fail(findings);
}

function validateManifest(manifest, findings) {
  try {
    definePublicRouteManifest(manifest);
  } catch (error) {
    findings.push(`${manifestPath}: ${error.message}`);
  }
  if (manifest.schemaVersion !== 1) findings.push(`${manifestPath}: schemaVersion must be 1`);
  if (manifest.app !== "complyeaze") findings.push(`${manifestPath}: app must be complyeaze`);
  if (manifest.origin !== "https://complyeaze.com") {
    findings.push(`${manifestPath}: production origin must be https://complyeaze.com`);
  }
  const routes = Array.isArray(manifest.routes) ? manifest.routes : [];
  const routeObjects = routes.filter((route, index) => {
    const isObject = typeof route === "object" && route !== null && !Array.isArray(route);
    if (!isObject) findings.push(`${manifestPath}: routes[${index}] must be an object`);
    return isObject;
  });
  const paths = routeObjects.map((route) => route.urlPath);
  for (const requiredRoute of requiredRoutes) {
    if (!paths.includes(requiredRoute)) findings.push(`${manifestPath}: missing ${requiredRoute}`);
  }
  if (new Set(paths).size !== paths.length) findings.push(`${manifestPath}: duplicate route paths`);

  for (const route of routeObjects) {
    for (const field of ["slug", "urlPath", "title", "description", "heading", "summary"]) {
      if (typeof route[field] !== "string" || !route[field].trim()) {
        findings.push(`${manifestPath}: ${route.urlPath ?? "unknown"} missing ${field}`);
      }
    }
    if (route.robots !== "noindex, nofollow") {
      findings.push(`${manifestPath}: ${route.urlPath} must stay noindex before cutover`);
    }
    if (!Array.isArray(route.sections) || route.sections.length === 0) {
      findings.push(`${manifestPath}: ${route.urlPath} needs sections`);
    }
    if (!Array.isArray(route.proof) || route.proof.length === 0) {
      findings.push(`${manifestPath}: ${route.urlPath} needs proof`);
    }
    if (JSON.stringify(route).includes("ComplyEaze Public")) {
      findings.push(`${manifestPath}: ${route.urlPath} exposes repository-boundary branding`);
    }
  }
}

function readManifest(root, findings) {
  const absolutePath = path.join(root, manifestPath);
  if (!existsSync(absolutePath)) return null;
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (error) {
    findings.push(`${manifestPath}: invalid JSON ${error.message}`);
    return null;
  }
}

function fail(findings) {
  throw new Error(`Astro core-route build findings:\n${findings.join("\n")}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
