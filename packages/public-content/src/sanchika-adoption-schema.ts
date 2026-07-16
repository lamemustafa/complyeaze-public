import type {
  SanchikaAdoptedApp,
  SanchikaAdoptionManifest,
  SanchikaArtifact,
} from "./sanchika-adoption-types.ts";

const releasePackages = [
  {
    assetDigest: "sha256:b8149ced363966fa72c9fbe802c0186e062b3be0a464909ec12799503e601c27",
    name: "@sanchika/tokens",
    sha256: "b8149ced363966fa72c9fbe802c0186e062b3be0a464909ec12799503e601c27",
    tarballUrl: "https://github.com/lamemustafa/sanchika/releases/download/v0.1.1/sanchika-tokens-0.1.1.tgz",
  },
  {
    assetDigest: "sha256:08f5ecefe626e65e8ce7656d7409753aa77e07a5467a5ca2876c20d540a6fcec",
    name: "@sanchika/primitives",
    sha256: "08f5ecefe626e65e8ce7656d7409753aa77e07a5467a5ca2876c20d540a6fcec",
    tarballUrl: "https://github.com/lamemustafa/sanchika/releases/download/v0.1.1/sanchika-primitives-0.1.1.tgz",
  },
  {
    assetDigest: "sha256:8b50491eaa2d4cdee4f07ec6e742c05253623e7c413d3974800a9bf437af9b83",
    name: "@sanchika/patterns",
    sha256: "8b50491eaa2d4cdee4f07ec6e742c05253623e7c413d3974800a9bf437af9b83",
    tarballUrl: "https://github.com/lamemustafa/sanchika/releases/download/v0.1.1/sanchika-patterns-0.1.1.tgz",
  },
] as const;

const rollbackPackages = [
  {
    assetDigest: "sha256:92148781457a3797db7f643235c8f23d881a4842426d50961bf6ec65bd718c55",
    name: "@sanchika/tokens",
    sha256: "92148781457a3797db7f643235c8f23d881a4842426d50961bf6ec65bd718c55",
    tarballUrl: "https://github.com/lamemustafa/sanchika/releases/download/v0.1.0/sanchika-tokens-0.1.0.tgz",
  },
  {
    assetDigest: "sha256:2d22f4a07f3d0ae1064e663551cecafc3dedeae4bf700889a0c900935e8b9585",
    name: "@sanchika/primitives",
    sha256: "2d22f4a07f3d0ae1064e663551cecafc3dedeae4bf700889a0c900935e8b9585",
    tarballUrl: "https://github.com/lamemustafa/sanchika/releases/download/v0.1.0/sanchika-primitives-0.1.0.tgz",
  },
  {
    assetDigest: "sha256:3b0b6e6e5b42712222bcf5badeca63a9fee6c0466904de0a2f5d27f2cd5428f5",
    name: "@sanchika/patterns",
    sha256: "3b0b6e6e5b42712222bcf5badeca63a9fee6c0466904de0a2f5d27f2cd5428f5",
    tarballUrl: "https://github.com/lamemustafa/sanchika/releases/download/v0.1.0/sanchika-patterns-0.1.0.tgz",
  },
] as const;

const adoptedApps = ["complyeaze", "axal", "pack"] as const;
const cssImportOrder = [
  "@sanchika/tokens/theme.css",
  "@sanchika/primitives/styles.css",
  "@sanchika/patterns/styles.css",
] as const;
const nonGoals = [
  "P3 craft routes and product-pattern composition",
  "public page redesign or customer-copy rewrite",
  "deployment, domains, redirects, indexing, or private-route cleanup",
  "private application or Tools adoption",
  "npm publication or Sanchika source changes",
] as const;

export function defineSanchikaAdoptionManifest(value: unknown): SanchikaAdoptionManifest {
  assertRecord(value, "Sanchika adoption manifest");
  assertExactKeys(value, ["adoptedApps", "cssImportOrder", "nonGoals", "packages", "release", "rollback", "schemaVersion", "smoke"], "Sanchika adoption manifest");
  assert(value.schemaVersion === 1, "Sanchika adoption schemaVersion must be 1");
  validateRelease(value.release);
  validateArtifacts(value.packages, releasePackages, "packages");
  validateApps(value.adoptedApps);
  assertJsonEqual(value.cssImportOrder, cssImportOrder, "cssImportOrder must preserve package order");
  validateSmoke(value.smoke);
  validateRollback(value.rollback);
  assertJsonEqual(value.nonGoals, nonGoals, "nonGoals must preserve the approved P2 boundary");
  return value as unknown as SanchikaAdoptionManifest;
}

function validateRelease(value: unknown) {
  assertRecord(value, "release");
  assertExactKeys(value, ["distribution", "releaseUrl", "sourceCommit", "tag", "version"], "release");
  assert(value.distribution === "github-release-artifacts", "release distribution must use GitHub artifacts");
  assert(value.releaseUrl === "https://github.com/lamemustafa/sanchika/releases/tag/v0.1.1", "release URL must identify v0.1.1");
  assert(value.sourceCommit === "f5f86eae29d573576a40c002da7210d7bc7a4dc4", "release source commit is stale");
  assert(value.tag === "v0.1.1" && value.version === "0.1.1", "release version must be v0.1.1");
}

function validateArtifacts(value: unknown, expected: readonly SanchikaArtifact[], label: string) {
  assert(Array.isArray(value) && value.length === expected.length, `${label} must contain the complete artifact set`);
  value.forEach((artifact, index) => {
    assertRecord(artifact, `${label}[${index}]`);
    assertExactKeys(artifact, ["assetDigest", "name", "sha256", "tarballUrl"], `${label}[${index}]`);
    for (const field of ["assetDigest", "name", "sha256", "tarballUrl"] as const) {
      assert(artifact[field] === expected[index][field], `${label}[${index}].${field} is stale`);
    }
  });
}

function validateApps(value: unknown) {
  assert(Array.isArray(value) && value.length === 3, "adoptedApps must contain all three apps");
  value.forEach((entry, index) => {
    assertRecord(entry, `adoptedApps[${index}]`);
    assertExactKeys(entry, ["id", "surface"], `adoptedApps[${index}]`);
    assert(entry.id === adoptedApps[index], `adoptedApps[${index}] has the wrong app`);
    assertString(entry.surface, `adoptedApps[${index}].surface`);
  });
}

function validateSmoke(value: unknown) {
  assertRecord(value, "smoke");
  assertExactKeys(value, ["definitionExport", "patternExport", "primitiveExport"], "smoke");
  assert(value.definitionExport === "tokenDefinitions", "smoke definition export is stale");
  assert(value.primitiveExport === "primitiveClassName", "smoke primitive export is stale");
  assert(value.patternExport === "patternClassName", "smoke pattern export is stale");
}

function validateRollback(value: unknown) {
  assertRecord(value, "rollback");
  assertExactKeys(value, ["packages", "releaseUrl", "version"], "rollback");
  assert(value.version === "0.1.0", "rollback version must be 0.1.0");
  assert(value.releaseUrl === "https://github.com/lamemustafa/sanchika/releases/tag/v0.1.0", "rollback URL must identify v0.1.0");
  validateArtifacts(value.packages, rollbackPackages, "rollback.packages");
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assertString(value: unknown, label: string): asserts value is string {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assertExactKeys(value: Record<string, unknown>, expected: string[], label: string) {
  assertJsonEqual(Object.keys(value).sort(), [...expected].sort(), `${label} has unsupported fields`);
}

function assertJsonEqual(actual: unknown, expected: unknown, message: string) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export type { SanchikaAdoptedApp, SanchikaAdoptionManifest, SanchikaArtifact };
