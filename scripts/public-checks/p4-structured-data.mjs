import { readFileSync } from "node:fs";
import path from "node:path";
import { appDistPath, publicRouteRegistry } from "../public-route-registry.mjs";

const layoutPath = "apps/complyeaze/src/layouts/PublicPageLayout.astro";

export function assertP4StructuredDataSources(root) {
  const layout = readFileSync(path.join(root, layoutPath), "utf8");
  const findings = [];

  for (const requiredFragment of [
    "application/ld+json",
    '"@context": "https://schema.org"',
    '"@type": "Organization"',
    '"@type": "WebSite"',
    "schemaGraph",
  ]) {
    if (!layout.includes(requiredFragment)) findings.push(`${layoutPath}: missing ${requiredFragment}`);
  }

  if (findings.length > 0) {
    throw new Error(`P4 structured-data source findings:\n${findings.join("\n")}`);
  }
}

export function assertP4StructuredDataBuild(root) {
  const findings = [];
  const routes = publicRouteRegistry.filter((route) => route.app === "complyeaze");

  for (const route of routes) {
    const html = readFileSync(path.join(root, appDistPath(route)), "utf8");
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (scripts.length !== 1) {
      findings.push(`${route.urlPath}: expected one JSON-LD graph, found ${scripts.length}`);
      continue;
    }

    let schema;
    try {
      schema = JSON.parse(scripts[0][1]);
    } catch {
      findings.push(`${route.urlPath}: JSON-LD graph is not valid JSON`);
      continue;
    }

    const organizationId = `${route.origin}/#organization`;
    const websiteId = `${route.origin}/#website`;
    const entries = schema?.["@graph"];
    const organization = entries?.find((entry) => entry?.["@type"] === "Organization");
    const website = entries?.find((entry) => entry?.["@type"] === "WebSite");

    if (schema?.["@context"] !== "https://schema.org") findings.push(`${route.urlPath}: invalid JSON-LD context`);
    if (entries?.length !== 2) findings.push(`${route.urlPath}: graph must contain exactly two entities`);
    if (organization?.["@id"] !== organizationId || organization?.name !== "ComplyEaze" || organization?.url !== `${route.origin}/`) {
      findings.push(`${route.urlPath}: Organization must use the canonical ComplyEaze identity`);
    }
    if (website?.["@id"] !== websiteId || website?.name !== "ComplyEaze" || website?.url !== `${route.origin}/` || website?.publisher?.["@id"] !== organizationId) {
      findings.push(`${route.urlPath}: WebSite must use the canonical ComplyEaze identity`);
    }
    if (!hasOnlyKeys(organization, ["@id", "@type", "name", "url"])) {
      findings.push(`${route.urlPath}: Organization contains unsupported properties`);
    }
    if (!hasOnlyKeys(website, ["@id", "@type", "name", "url", "publisher"])) {
      findings.push(`${route.urlPath}: WebSite contains unsupported properties`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`P4 structured-data build findings:\n${findings.join("\n")}`);
  }
}

function hasOnlyKeys(value, allowedKeys) {
  return value
    && Object.keys(value).every((key) => allowedKeys.includes(key));
}
