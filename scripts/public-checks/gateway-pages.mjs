import { readFileSync } from "node:fs";
import path from "node:path";
import { gatewayPages } from "../../src/gateway-data.mjs";
import { pages } from "../../src/site-data.mjs";

const requiredRoutes = ["/products/pack/", "/products/tools/"];
const unsafePatterns = [
  { label: "store readiness claim", pattern: /Chrome Web Store|store readiness|store listing status is|available in the Chrome Web Store/i },
  { label: "official approval claim", pattern: /government approved|GSTN approved|CBIC approved|official portal approval/i },
  { label: "extension permission detail", pattern: /host_permissions|activeTab|chrome\.downloads|selector behavior/i },
  { label: "hard local-only claim", pattern: /nothing leaves your device|zero data collection|no telemetry/i },
  { label: "backend/storage claim", pattern: /database write|backend save|document custody|tenant-data processing/i },
  { label: "filing/statutory claim", pattern: /statutory validation|GST filing|file returns|payment validation/i }
];
const internalMethodologyPattern =
  /evidence before route cleanup|migration ledger|route cleanup|cleanup blocked|review gate|deployment methodology/i;

export function assertGatewayPageSources(root) {
  const findings = [];
  const dataSource = readFileSync(path.join(root, "src", "gateway-data.mjs"), "utf8");
  const rendererSource = readFileSync(path.join(root, "src", "render-gateway.mjs"), "utf8");

  if (!dataSource.includes("definePublicRouteManifest")) {
    findings.push("src/gateway-data.mjs: gateway pages must adapt the typed manifest");
  }
  if (/const (?:packSections|toolsSections)|export const gatewayPages\s*=\s*\[/.test(dataSource)) {
    findings.push("src/gateway-data.mjs: duplicated gateway route data remains");
  }
  if (internalMethodologyPattern.test(dataSource) || internalMethodologyPattern.test(rendererSource)) {
    findings.push("legacy gateway sources: customer pages expose internal migration methodology");
  }
  for (const field of ["primaryAction", "secondaryAction", "evidenceLinks"]) {
    if (!rendererSource.includes(`page.${field}`)) {
      findings.push(`src/render-gateway.mjs: canonical ${field} is not rendered`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Gateway source findings:\n${findings.join("\n")}`);
  }
}

export function assertGatewayPages(root) {
  const pagePaths = new Set(pages.map((page) => page.urlPath));
  const dataPaths = new Set(gatewayPages.map((page) => page.urlPath));
  const findings = [];

  for (const route of requiredRoutes) {
    if (!pagePaths.has(route)) findings.push(`${route}: missing from site pages`);
    if (!dataPaths.has(route)) findings.push(`${route}: missing from gateway data`);
  }

  for (const page of gatewayPages) {
    const text = JSON.stringify(page);
    const html = readFileSync(path.join(root, "dist", page.outputPath), "utf8");
    if (page.slug.includes("/")) {
      findings.push(`${page.urlPath}: legacy gateway artifact slug must remain flat`);
    }
    if (!html.includes(page.primaryAction.href)) {
      findings.push(`${page.outputPath}: missing external product host link`);
    }
    if (!html.includes("Review product-owned evidence")) {
      findings.push(`${page.outputPath}: missing public evidence section`);
    }
    for (const link of page.evidenceLinks) {
      for (const value of [link.href, link.label, link.description]) {
        if (!html.includes(value)) findings.push(`${page.outputPath}: missing evidence value ${value}`);
      }
    }
    if (internalMethodologyPattern.test(text) || internalMethodologyPattern.test(html)) {
      findings.push(`${page.outputPath}: customer page exposes internal migration methodology`);
    }
    for (const { label, pattern } of unsafePatterns) {
      if (pattern.test(text) || pattern.test(html)) findings.push(`${page.outputPath}: ${label}`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Gateway page findings:\n${findings.join("\n")}`);
  }
}
