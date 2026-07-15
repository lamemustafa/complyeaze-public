import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const rootManifestPath = "package.json";
const lockfilePath = "pnpm-lock.yaml";
const workspaceManifests = new Map([
  ["apps/axal/package.json", ["@astrojs/check", "astro", "typescript"]],
  ["apps/complyeaze/package.json", ["@astrojs/check", "astro", "typescript"]],
  ["apps/pack/package.json", ["@astrojs/check", "astro", "typescript"]],
  ["packages/public-content/package.json", []],
  ["packages/public-shell/package.json", []],
]);
const forbiddenLifecycleScripts = [
  "preinstall",
  "install",
  "postinstall",
  "prepare",
  "prepublish",
  "prepublishOnly",
  "prepack",
  "postpack",
];

export function assertWorkspaceDependencySurface(root, rootManifestText, lockfile, findings) {
  const rootManifest = parseManifest(rootManifestPath, rootManifestText, findings);
  if (rootManifest) assertRootManifest(rootManifest, findings);

  for (const [filePath, allowedDevDependencies] of workspaceManifests) {
    const text = readRequiredFile(root, filePath, findings);
    const manifest = text ? parseManifest(filePath, text, findings) : null;
    if (manifest) assertWorkspaceManifest(filePath, manifest, allowedDevDependencies, findings);
  }

  assertLockfile(lockfile, findings);
}

function assertRootManifest(manifest, findings) {
  if (manifest.private !== true) {
    findings.push(`${rootManifestPath}: package must stay private to avoid accidental npm publish`);
  }
  if (manifest.packageManager !== "pnpm@10.28.2") {
    findings.push(`${rootManifestPath}: packageManager must stay pinned to pnpm@10.28.2`);
  }
  if (manifest.engines?.node !== ">=24") {
    findings.push(`${rootManifestPath}: node engine must stay >=24`);
  }
  assertNoRuntimeDependencies(rootManifestPath, manifest, findings);

  const rootDevDependencies = Object.keys(manifest.devDependencies ?? {});
  if (rootDevDependencies.join(",") !== "playwright") {
    findings.push(`${rootManifestPath}: root devDependencies must contain only playwright`);
  }
  if (manifest.devDependencies?.playwright !== "1.61.1") {
    findings.push(`${rootManifestPath}: playwright must stay pinned to 1.61.1 until reviewed`);
  }
  assertNoLifecycleScripts(rootManifestPath, manifest, findings);
}

function assertWorkspaceManifest(filePath, manifest, allowedDevDependencies, findings) {
  if (manifest.private !== true) {
    findings.push(`${filePath}: workspace package must stay private`);
  }
  if (filePath.startsWith("apps/") && manifest.engines?.node !== ">=24") {
    findings.push(`${filePath}: node engine must stay >=24`);
  }
  assertNoRuntimeDependencies(filePath, manifest, findings);

  const actualDevDependencies = Object.keys(manifest.devDependencies ?? {}).sort();
  if (actualDevDependencies.join(",") !== [...allowedDevDependencies].sort().join(",")) {
    findings.push(`${filePath}: unexpected devDependency surface ${actualDevDependencies.join(", ")}`);
  }
  for (const dependency of allowedDevDependencies) {
    if (manifest.devDependencies?.[dependency] !== "catalog:") {
      findings.push(`${filePath}: ${dependency} must use the pinned workspace catalog`);
    }
  }
  assertNoLifecycleScripts(filePath, manifest, findings);

  if (filePath.startsWith("apps/")) {
    for (const scriptName of ["dev", "build", "typecheck"]) {
      if (!manifest.scripts?.[scriptName]?.includes("ASTRO_TELEMETRY_DISABLED=1")) {
        findings.push(`${filePath}: ${scriptName} must disable Astro telemetry`);
      }
    }
  }
}

function assertNoRuntimeDependencies(filePath, manifest, findings) {
  if (Object.keys(manifest.dependencies ?? {}).length > 0) {
    findings.push(`${filePath}: runtime dependencies are not allowed`);
  }
}

function assertNoLifecycleScripts(filePath, manifest, findings) {
  for (const scriptName of forbiddenLifecycleScripts) {
    if (manifest.scripts?.[scriptName]) {
      findings.push(`${filePath}: lifecycle script ${scriptName} is not allowed`);
    }
  }
}

function assertLockfile(lockfile, findings) {
  const requiredSnippets = [
    "  apps/axal:",
    "  apps/complyeaze:",
    "  apps/pack:",
    "  packages/public-content: {}",
    "  packages/public-shell: {}",
    "playwright:\n        specifier: 1.61.1",
    "'@astrojs/check@0.9.9':",
    "astro@7.0.9",
    "typescript@6.0.3",
  ];
  for (const snippet of requiredSnippets) {
    if (!lockfile.includes(snippet)) {
      findings.push(`${lockfilePath}: missing ${snippet}`);
    }
  }
  const catalogSpecifiers = lockfile.match(/specifier: 'catalog:'/g) ?? [];
  if (catalogSpecifiers.length !== 9) {
    findings.push(`${lockfilePath}: expected 9 catalog-pinned Astro tool specifiers`);
  }
}

function parseManifest(filePath, text, findings) {
  try {
    return JSON.parse(text);
  } catch (error) {
    findings.push(`${filePath}: invalid JSON ${error.message}`);
    return null;
  }
}

function readRequiredFile(root, filePath, findings) {
  const absolutePath = path.join(root, filePath);
  if (!existsSync(absolutePath)) {
    findings.push(`${filePath}: missing`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}
