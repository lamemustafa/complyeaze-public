export interface SanchikaArtifact {
  assetDigest: `sha256:${string}`;
  name: "@sanchika/tokens" | "@sanchika/primitives" | "@sanchika/patterns";
  sha256: string;
  tarballUrl: string;
}

export interface SanchikaAdoptedApp {
  id: "complyeaze" | "axal" | "pack";
  surface: string;
}

export interface SanchikaAdoptionManifest {
  adoptedApps: [SanchikaAdoptedApp, SanchikaAdoptedApp, SanchikaAdoptedApp];
  cssImportOrder: [
    "@sanchika/tokens/theme.css",
    "@sanchika/primitives/styles.css",
    "@sanchika/patterns/styles.css",
  ];
  nonGoals: string[];
  packages: [SanchikaArtifact, SanchikaArtifact, SanchikaArtifact];
  release: {
    distribution: "github-release-artifacts";
    releaseUrl: "https://github.com/lamemustafa/sanchika/releases/tag/v0.1.1";
    sourceCommit: "f5f86eae29d573576a40c002da7210d7bc7a4dc4";
    tag: "v0.1.1";
    version: "0.1.1";
  };
  rollback: {
    packages: [SanchikaArtifact, SanchikaArtifact, SanchikaArtifact];
    releaseUrl: "https://github.com/lamemustafa/sanchika/releases/tag/v0.1.0";
    version: "0.1.0";
  };
  schemaVersion: 1;
  smoke: {
    definitionExport: "tokenDefinitions";
    patternExport: "patternClassName";
    primitiveExport: "primitiveClassName";
  };
}
