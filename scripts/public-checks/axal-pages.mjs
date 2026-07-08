import { axalDetails, axalPages } from "../../src/axal-data.mjs";

export function assertAxalPages() {
  const detailRoutes = axalPages.filter((page) => page.type === "axalDetail");
  const riskyPatterns = [
    { label: "government approval claim", pattern: /government approved|government approval/i },
    { label: "automatic filing claim", pattern: /automatic filing|file[s]? .* automatically/i },
    { label: "unsafe credential storage wording", pattern: /credential capture|store[s]? portal password/i },
    { label: "hard production capability wording", pattern: /\bAxal gives\b|\bCreate or sync\b/i }
  ];
  const findings = [];

  if (axalDetails.length !== 5) {
    findings.push(`expected 5 Axal detail data pages, found ${axalDetails.length}`);
  }
  if (detailRoutes.length !== 5) {
    findings.push(`expected 5 Axal detail routes, found ${detailRoutes.length}`);
  }
  for (const page of detailRoutes) {
    if (!page.urlPath.startsWith("/products/axal/")) {
      findings.push(`${page.slug}: unexpected Axal URL path ${page.urlPath}`);
    }
    if (!page.carefulBoundary) {
      findings.push(`${page.slug}: missing professional-review boundary`);
    }
  }
  for (const page of axalDetails) {
    const text = JSON.stringify(page);
    for (const { label, pattern } of riskyPatterns) {
      if (pattern.test(text)) findings.push(`${page.slug}: ${label}`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Axal page findings:\n${findings.join("\n")}`);
  }
}
