import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { publicRouteRegistry } from "../public-route-registry.mjs";

const requiredFiles = [
  "packages/public-content/src/sanchika-adoption-schema.ts",
  "packages/public-content/src/sanchika-adoption-types.ts",
  "packages/public-content/src/sanchika.adoption.json",
  "apps/complyeaze/scripts/sanchika-package-smoke.mjs",
];

const packageUrls = new Map([
  ["@sanchika/tokens", "https://github.com/lamemustafa/sanchika/releases/download/v0.1.0/sanchika-tokens-0.1.0.tgz"],
  ["@sanchika/primitives", "https://github.com/lamemustafa/sanchika/releases/download/v0.1.0/sanchika-primitives-0.1.0.tgz"],
  ["@sanchika/patterns", "https://github.com/lamemustafa/sanchika/releases/download/v0.1.0/sanchika-patterns-0.1.0.tgz"],
]);

export async function assertSanchikaAdoptionSources(root) {
  const findings = requiredFiles
    .filter((filePath) => !existsSync(path.join(root, filePath)))
    .map((filePath) => `${filePath}: missing`);

  for (const app of ["complyeaze", "axal", "pack"]) {
    const manifestPath = `apps/${app}/package.json`;
    const manifest = JSON.parse(readFileSync(path.join(root, manifestPath), "utf8"));
    for (const [packageName, expectedUrl] of packageUrls) {
      if (manifest.devDependencies?.[packageName] !== expectedUrl) {
        findings.push(`${manifestPath}: ${packageName} must use the reviewed v0.1.0 tarball`);
      }
    }
  }

  const workspace = readFileSync(path.join(root, "pnpm-workspace.yaml"), "utf8");
  for (const selector of ["@sanchika/tokens@0.1.0", "@sanchika/primitives@0.1.0"]) {
    if (!workspace.includes(selector)) findings.push(`pnpm-workspace.yaml: missing override ${selector}`);
  }

  const lockfile = readFileSync(path.join(root, "pnpm-lock.yaml"), "utf8");
  for (const expectedUrl of packageUrls.values()) {
    if (!lockfile.includes(`tarball: ${expectedUrl}`)) {
      findings.push(`pnpm-lock.yaml: missing reviewed tarball resolution ${expectedUrl}`);
    }
  }
  if (/['"]?@sanchika\/(?:tokens|primitives|patterns)@0\.1\.0['"]?:\s*\n\s+resolution: \{integrity:/m.test(lockfile)) {
    findings.push("pnpm-lock.yaml: Sanchika package resolved from npm instead of GitHub artifacts");
  }

  if (findings.length > 0) {
    throw new Error(`Sanchika adoption findings:\n${findings.join("\n")}`);
  }

  const rawManifest = JSON.parse(
    readFileSync(path.join(root, "packages/public-content/src/sanchika.adoption.json"), "utf8"),
  );
  const { defineSanchikaAdoptionManifest } = await import(
    "../../packages/public-content/src/sanchika-adoption-schema.ts"
  );
  defineSanchikaAdoptionManifest(rawManifest);

  for (const mutate of [
    (fixture) => { fixture.release.version = "0.1.1"; },
    (fixture) => { fixture.packages[0].sha256 = "0".repeat(64); },
    (fixture) => { fixture.packages[1].assetDigest = `sha256:${"1".repeat(64)}`; },
    (fixture) => { fixture.adoptedApps.pop(); },
    (fixture) => { fixture.rollback.packages.pop(); },
    (fixture) => { fixture.nonGoals.push("P3 craft routes"); },
  ]) {
    const fixture = structuredClone(rawManifest);
    mutate(fixture);
    assertRejected(defineSanchikaAdoptionManifest, fixture);
  }


  execFileSync(process.execPath, [path.join(root, "apps/complyeaze/scripts/sanchika-package-smoke.mjs")], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const complyeazeFiles = [
    "apps/complyeaze/src/styles/sanchika.css",
    "apps/complyeaze/src/components/PublicSanchikaAdoptionPage.astro",
  ];
  const missingComplyeazeFiles = complyeazeFiles.filter((filePath) => !existsSync(path.join(root, filePath)));
  if (missingComplyeazeFiles.length > 0) {
    throw new Error(`Sanchika ComplyEaze adoption findings:\n${missingComplyeazeFiles.map((filePath) => `${filePath}: missing`).join("\n")}`);
  }
  const css = readFileSync(path.join(root, complyeazeFiles[0]), "utf8");
  assertCssImportOrder(css, complyeazeFiles[0]);
  const layout = readFileSync(path.join(root, "apps/complyeaze/src/layouts/PublicPageLayout.astro"), "utf8");
  if (!layout.includes('../styles/sanchika.css') || !layout.includes("sk-badge")) {
    throw new Error("ComplyEaze public shell is missing its Sanchika stylesheet or primitive adoption");
  }
  const component = readFileSync(path.join(root, complyeazeFiles[1]), "utf8");
  if (!component.includes("defineSanchikaAdoptionManifest") || !component.includes("sk-card")) {
    throw new Error("ComplyEaze Sanchika evidence page must render manifest-backed primitive evidence");
  }
  const complyeazeRoutes = publicRouteRegistry.filter((route) => route.app === "complyeaze");
  if (publicRouteRegistry.length !== 25 || complyeazeRoutes.length !== 16) {
    throw new Error(`Sanchika adoption requires 25 public routes with 16 owned by ComplyEaze`);
  }
  if (!complyeazeRoutes.some((route) => route.urlPath === "/sanchika/")) {
    throw new Error("ComplyEaze manifest is missing the noindex /sanchika/ evidence route");
  }
  const appSource = [
    layout,
    component,
    readFileSync(path.join(root, "apps/complyeaze/src/pages/[...slug].astro"), "utf8"),
  ].join("\n");
  if (/class=["'{][^\n>]*sk-pattern-/i.test(appSource)) {
    throw new Error("P2 must not compose Sanchika product patterns before P3");
  }

  const remainingApps = [
    {
      app: "axal",
      entry: "apps/axal/src/layouts/AxalPageLayout.astro",
      primitiveSource: "apps/axal/src/components/SyntheticWorkbench.astro",
    },
    {
      app: "pack",
      entry: "apps/pack/src/pages/index.astro",
      primitiveSource: "apps/pack/src/pages/index.astro",
    },
  ];
  const remainingFindings = [];
  for (const consumer of remainingApps) {
    const cssPath = `apps/${consumer.app}/src/styles/sanchika.css`;
    if (!existsSync(path.join(root, cssPath))) {
      remainingFindings.push(`${cssPath}: missing`);
      continue;
    }
    assertCssImportOrder(readFileSync(path.join(root, cssPath), "utf8"), cssPath);
    const entry = readFileSync(path.join(root, consumer.entry), "utf8");
    if (!entry.includes('../styles/sanchika.css')) {
      remainingFindings.push(`${consumer.entry}: missing Sanchika stylesheet import`);
    }
    const primitiveSource = readFileSync(path.join(root, consumer.primitiveSource), "utf8");
    if (!/sk-(?:card|badge)\b/.test(primitiveSource)) {
      remainingFindings.push(`${consumer.primitiveSource}: missing approved primitive adoption`);
    }
    if (/class=["'{][^\n>]*sk-pattern-/i.test(`${entry}\n${primitiveSource}`)) {
      remainingFindings.push(`${consumer.app}: product-pattern composition is reserved for P3`);
    }
  }
  if (remainingFindings.length > 0) {
    throw new Error(`Sanchika Axal/Pack adoption findings:\n${remainingFindings.join("\n")}`);
  }

  const sourceFiles = walkFiles(path.join(root, "apps"))
    .filter((filePath) => [".astro", ".css", ".js", ".mjs", ".ts", ".tsx"].includes(path.extname(filePath)));
  for (const filePath of sourceFiles) {
    const source = readFileSync(filePath, "utf8");
    const relativePath = path.relative(root, filePath);
    if (/class=["'{][^\n>]*sk-pattern-/i.test(source)) {
      throw new Error(`${relativePath}: product-pattern composition is reserved for P3`);
    }
    if (/(?:workspace:|file:|@sanchika\/(?:tokens|primitives|patterns)\/src|(?:^|["'])\.\.\/.*sanchika\/)/i.test(source)) {
      throw new Error(`${relativePath}: active Sanchika consumption must use reviewed release artifacts`);
    }
  }
}

export function assertSanchikaAdoptionBuild(root) {
  const findings = [];
  for (const app of ["complyeaze", "axal", "pack"]) {
    const assetRoot = path.join(root, "apps", app, "dist", "_astro");
    const cssFiles = existsSync(assetRoot)
      ? walkFiles(assetRoot).filter((filePath) => filePath.endsWith(".css"))
      : [];
    const css = cssFiles.map((filePath) => readFileSync(filePath, "utf8")).join("\n");
    for (const marker of ["--sk-color-canvas", ".sk-card", ".sk-pattern-"]) {
      if (!css.includes(marker)) findings.push(`apps/${app}/dist: missing built Sanchika marker ${marker}`);
    }
  }
  if (findings.length > 0) {
    throw new Error(`Sanchika build findings:\n${findings.join("\n")}`);
  }
}

function assertCssImportOrder(css, filePath) {
  const imports = [
    '@import "@sanchika/tokens/theme.css";',
    '@import "@sanchika/primitives/styles.css";',
    '@import "@sanchika/patterns/styles.css";',
  ];
  const indexes = imports.map((statement) => css.indexOf(statement));
  if (indexes.some((index) => index < 0) || indexes.some((index, position) => position > 0 && index <= indexes[position - 1])) {
    throw new Error(`${filePath}: Sanchika CSS imports are missing or out of order`);
  }
}

function assertRejected(validator, value) {
  try {
    validator(value);
  } catch {
    return;
  }
  throw new Error("Sanchika adoption schema accepted an invalid fixture");
}

function walkFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    if ([".astro", "dist", "node_modules"].includes(name)) return [];
    const filePath = path.join(directory, name);
    return statSync(filePath).isDirectory() ? walkFiles(filePath) : [filePath];
  });
}
