import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const rootManifestPath = "package.json";
const lockfilePath = "pnpm-lock.yaml";
const appDevDependencies = ["@astrojs/check", "astro", "typescript"];
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

  const workspaceManifests = discoverWorkspaceManifests(root);
  for (const filePath of workspaceManifests) {
    const text = readRequiredFile(root, filePath, findings);
    const manifest = text ? parseManifest(filePath, text, findings) : null;
    const allowedDevDependencies = filePath.startsWith("apps/") ? appDevDependencies : [];
    if (manifest) assertWorkspaceManifest(filePath, manifest, allowedDevDependencies, findings);
  }

  assertLockfile(lockfile, workspaceManifests, findings);
}

export function assertWorkspaceDependencySurfaceFixtures() {
  const root = mkdtempSync(path.join(tmpdir(), "public-workspace-dependency-"));
  const manifestPath = path.join(root, "packages", "experiment", "package.json");
  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(
    manifestPath,
    JSON.stringify({
      name: "@complyeaze-public/experiment",
      private: true,
      scripts: { postinstall: "node unsafe.mjs" },
      dependencies: { "unsafe-runtime": "1.0.0" },
    }),
    "utf8",
  );
  const findings = [];
  try {
    assertWorkspaceDependencySurface(
      root,
      JSON.stringify({
        private: true,
        packageManager: "pnpm@10.28.2",
        engines: { node: ">=24" },
        devDependencies: { playwright: "1.61.1" },
      }),
      "\nimporters:\n\n  .: {}\n\n  packages/experiment: {}\n\npackages:\n",
      findings,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  for (const expected of ["runtime dependencies are not allowed", "lifecycle script postinstall is not allowed"]) {
    if (!findings.some((finding) => finding.includes(expected))) {
      throw new Error(`Workspace dependency fixture missed: ${expected}`);
    }
  }
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

function assertLockfile(lockfile, workspaceManifests, findings) {
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
  const importersBlock = lockfile.match(/\nimporters:\n(?<block>[\s\S]*?)\npackages:\n/)?.groups?.block ?? "";
  const actualImporters = [...importersBlock.matchAll(/^  (\S[^:\n]*):(?:\s*\{\})?\s*$/gm)]
    .map((match) => match[1])
    .sort();
  const expectedImporters = [".", ...workspaceManifests.map((filePath) => path.dirname(filePath))].sort();
  if (actualImporters.join(",") !== expectedImporters.join(",")) {
    findings.push(`${lockfilePath}: workspace importers do not match discovered manifests`);
  }
}

function discoverWorkspaceManifests(root) {
  return ["apps", "packages"].flatMap((parent) => {
    const parentPath = path.join(root, parent);
    if (!existsSync(parentPath)) return [];
    return readdirSync(parentPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${parent}/${entry.name}/package.json`)
      .filter((filePath) => existsSync(path.join(root, filePath)));
  }).sort();
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
