import { existsSync } from "node:fs";
import path from "node:path";

const requiredFiles = [
  "scripts/public-route-registry.mjs",
  "scripts/release-evidence.mjs",
  "scripts/generate-release-evidence.mjs",
];

export async function assertReleaseEvidenceSources(root) {
  const findings = requiredFiles
    .filter((filePath) => !existsSync(path.join(root, filePath)))
    .map((filePath) => `${filePath}: missing`);
  if (findings.length > 0) {
    throw new Error(`Release-evidence source findings:\n${findings.join("\n")}`);
  }

  const { publicRouteRegistry } = await import("../public-route-registry.mjs");
  if (publicRouteRegistry.length !== 21) {
    findings.push(`expected 21 canonical routes, found ${publicRouteRegistry.length}`);
  }
  const ownership = publicRouteRegistry.map((route) => `${route.origin}${route.urlPath}`);
  if (new Set(ownership).size !== ownership.length) {
    findings.push("canonical route registry contains duplicate host/path ownership");
  }

  const { createReleaseEvidence } = await import("../release-evidence.mjs");
  const fixture = {
    app: "fixture",
    description: "Fixture description",
    heading: "Fixture heading",
    origin: "https://fixture.example",
    outputPath: "index.html",
    robots: "noindex, nofollow",
    slug: "index",
    title: "Fixture title",
    urlPath: "/",
  };
  const html = '<title>Fixture title</title><meta name="description" content="Fixture description"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="https://fixture.example/"><main><h1>Fixture heading</h1></main>';
  const evidence = createReleaseEvidence([fixture], () => html);
  if (evidence.pageCount !== 1 || evidence.routes[0].canonical !== "https://fixture.example/") {
    findings.push("release-evidence fixture did not produce canonical route evidence");
  }
  assertRejected(
    () => createReleaseEvidence([fixture], () => html.replace("Fixture title", "Wrong title")),
    "release evidence accepted mismatched built metadata",
    findings,
  );
  assertRejected(
    () => createReleaseEvidence([fixture, fixture], () => html),
    "release evidence accepted duplicate route ownership",
    findings,
  );

  if (findings.length > 0) {
    throw new Error(`Release-evidence source findings:\n${findings.join("\n")}`);
  }
}

function assertRejected(operation, message, findings) {
  try {
    operation();
  } catch {
    return;
  }
  findings.push(message);
}
