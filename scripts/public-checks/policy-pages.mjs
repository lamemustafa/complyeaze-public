import { readFileSync } from "node:fs";
import path from "node:path";
import { policyPages } from "../../src/policy-data.mjs";
import { pages } from "../../src/site-data.mjs";

const requiredPolicyPaths = ["/privacy/", "/terms/", "/status/", "/changelog/", "/release-evidence/"];
const unsafeClaims = [
  /private app uptime is (green|operational|healthy)/i,
  /production ready/i,
  /government approved/i,
  /GSTN approved/i,
  /CBIC approved/i,
  /certified GST filing/i,
  /nothing leaves your device/i,
  /zero data collection/i,
  /CA verified/i,
  /DPDP compliant/i
];

export function assertPolicyPages(root) {
  const pagePaths = new Set(pages.map((page) => page.urlPath));
  const dataPaths = new Set(policyPages.map((page) => page.urlPath));
  const findings = [];

  for (const route of requiredPolicyPaths) {
    if (!pagePaths.has(route)) findings.push(`${route}: missing from site pages`);
    if (!dataPaths.has(route)) findings.push(`${route}: missing from policy data`);
  }

  for (const page of policyPages) {
    const htmlPath = path.join(root, "dist", page.outputPath);
    const html = readFileSync(htmlPath, "utf8");
    if (!html.includes("/privacy/") || !html.includes("/terms/")) {
      findings.push(`${page.outputPath}: footer policy links missing`);
    }
    if (page.urlPath === "/status/" && !html.includes("not app uptime")) {
      findings.push(`${page.outputPath}: status page must disclaim private app uptime`);
    }
    for (const pattern of unsafeClaims) {
      if (pattern.test(html)) findings.push(`${page.outputPath}: unsafe unsupported claim ${pattern}`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Policy page findings:\n${findings.join("\n")}`);
  }
}
