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
    if (!html.includes(page.externalHref)) findings.push(`${page.outputPath}: missing external product host link`);
    if (!html.includes("Evidence before route cleanup")) findings.push(`${page.outputPath}: missing cleanup evidence section`);
    for (const { label, pattern } of unsafePatterns) {
      if (pattern.test(text) || pattern.test(html)) findings.push(`${page.outputPath}: ${label}`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Gateway page findings:\n${findings.join("\n")}`);
  }
}
