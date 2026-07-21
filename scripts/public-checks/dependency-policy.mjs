import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { assertWorkspaceDependencySurface } from "./dependency-workspace.mjs";

const dependabotPath = ".github/dependabot.yml";
const policyPath = "docs/DEPENDENCY_POLICY.md";
const contributingPath = "CONTRIBUTING.md";
const securityPath = "SECURITY.md";
const releaseGatesPath = "docs/RELEASE_GATES.md";
const packageJsonPath = "package.json";
const lockfilePath = "pnpm-lock.yaml";
const ciWorkflowPath = ".github/workflows/ci.yml";
const pagesDeployWorkflowPath = ".github/workflows/pages-deploy.yml";
const reviewGateWorkflowPath = ".github/workflows/review-gate.yml";

const requiredDependabotSnippets = [
  "version: 2",
  'package-ecosystem: "npm"',
  'package-ecosystem: "github-actions"',
  'interval: "weekly"',
  'timezone: "Asia/Kolkata"',
  "public-site-npm",
  "public-site-actions",
  "open-pull-requests-limit: 5",
  'reviewers:\n      - "lamemustafa"'
];

const requiredPolicyTerms = [
  "must not auto-merge",
  "GitHub Actions remain pinned to SHAs",
  "full public gate",
  "public-site-build",
  "public-visual-evidence",
  "no runtime `dependencies`",
  "Astro 7.1.1",
  "TypeScript 6.0.3",
  "workspace manifests",
  "ASTRO_TELEMETRY_DISABLED=1",
  "no lifecycle scripts",
  "packageManager",
  "pnpm@10.28.2",
  "Prisma",
  "Redis",
  "BullMQ",
  "portal automation"
];

const requiredPullRequestTerms = [
  "Dependency Updates, If Any",
  "Changelog, release notes, source diff, or advisory evidence reviewed",
  "GitHub Actions remain pinned to reviewed SHAs",
  "No private app, tenant-data, portal automation, document-storage, Prisma"
];

export function assertDependencyPolicy(root) {
  const findings = [];
  const dependabot = readRequiredFile(root, dependabotPath, findings);
  const policy = readRequiredFile(root, policyPath, findings);
  const contributing = readRequiredFile(root, contributingPath, findings);
  const security = readRequiredFile(root, securityPath, findings);
  const releaseGates = readRequiredFile(root, releaseGatesPath, findings);
  const pullRequestTemplate = readRequiredFile(root, ".github/PULL_REQUEST_TEMPLATE.md", findings);
  const packageJsonText = readRequiredFile(root, packageJsonPath, findings);
  const lockfile = readRequiredFile(root, lockfilePath, findings);
  const ciWorkflow = readRequiredFile(root, ciWorkflowPath, findings);
  const pagesDeployWorkflow = readRequiredFile(root, pagesDeployWorkflowPath, findings);
  const reviewGateWorkflow = readRequiredFile(root, reviewGateWorkflowPath, findings);

  for (const snippet of requiredDependabotSnippets) {
    if (!dependabot.includes(snippet)) {
      findings.push(`${dependabotPath}: missing ${snippet}`);
    }
  }
  assertDependabotUpdates(dependabot, findings);

  for (const term of requiredPolicyTerms) {
    if (!policy.includes(term)) {
      findings.push(`${policyPath}: missing ${term}`);
    }
  }

  for (const [filePath, text] of [
    [contributingPath, contributing],
    [securityPath, security],
    [releaseGatesPath, releaseGates]
  ]) {
    if (!text.includes("docs/DEPENDENCY_POLICY.md")) {
      findings.push(`${filePath}: missing dependency policy reference`);
    }
  }

  for (const term of requiredPullRequestTerms) {
    if (!pullRequestTemplate.includes(term)) {
      findings.push(`.github/PULL_REQUEST_TEMPLATE.md: missing ${term}`);
    }
  }

  assertWorkspaceDependencySurface(root, packageJsonText, lockfile, findings);
  assertWorkflowVersionAlignment(packageJsonText, ciWorkflow, pagesDeployWorkflow, findings);
  assertPinnedExternalActions(
    [
      [ciWorkflowPath, ciWorkflow],
      [pagesDeployWorkflowPath, pagesDeployWorkflow],
      [reviewGateWorkflowPath, reviewGateWorkflow]
    ],
    findings
  );

  if (findings.length > 0) {
    throw new Error(`Dependency policy findings:\n${findings.join("\n")}`);
  }
}

function assertDependabotUpdates(dependabot, findings) {
  const npmBlock = dependabotUpdateBlock(dependabot, "npm");
  const actionsBlock = dependabotUpdateBlock(dependabot, "github-actions");

  assertDependabotBlock("npm", npmBlock, [
    'directory: "/"',
    'interval: "weekly"',
    'timezone: "Asia/Kolkata"',
    "open-pull-requests-limit: 5",
    'reviewers:\n      - "lamemustafa"',
    'labels:\n      - "dependencies"\n      - "public-safety"',
    "public-site-npm",
    'patterns:\n          - "*"'
  ], findings);

  assertDependabotBlock("github-actions", actionsBlock, [
    'directory: "/"',
    'interval: "weekly"',
    'timezone: "Asia/Kolkata"',
    "open-pull-requests-limit: 5",
    'reviewers:\n      - "lamemustafa"',
    'labels:\n      - "dependencies"\n      - "ci"',
    "public-site-actions",
    'patterns:\n          - "*"'
  ], findings);
}

function dependabotUpdateBlock(dependabot, ecosystem) {
  const pattern = new RegExp(
    `  - package-ecosystem: "${escapeRegex(ecosystem)}"\\n(?<block>[\\s\\S]*?)(?=\\n  - package-ecosystem:|\\n?$)`
  );
  const match = dependabot.match(pattern);
  return match ? `  - package-ecosystem: "${ecosystem}"\n${match.groups.block}` : "";
}

function assertDependabotBlock(ecosystem, block, terms, findings) {
  if (!block) {
    findings.push(`${dependabotPath}: missing ${ecosystem} update block`);
    return;
  }
  for (const term of terms) {
    if (!block.includes(term)) {
      findings.push(`${dependabotPath}: ${ecosystem} update block missing ${term}`);
    }
  }
}

function assertWorkflowVersionAlignment(packageJsonText, ciWorkflow, pagesDeployWorkflow, findings) {
  if (!packageJsonText.includes('"packageManager": "pnpm@10.28.2"')) {
    return;
  }
  for (const [filePath, workflow] of [
    [ciWorkflowPath, ciWorkflow],
    [pagesDeployWorkflowPath, pagesDeployWorkflow]
  ]) {
    if (!workflow.includes("version: 10.28.2")) {
      findings.push(`${filePath}: pnpm action version must match packageManager pnpm@10.28.2`);
    }
    if (!workflow.includes("node-version: 24")) {
      findings.push(`${filePath}: Node setup must stay aligned with package engines >=24`);
    }
  }
}

function assertPinnedExternalActions(workflows, findings) {
  const pinnedActionPattern = /^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/;
  for (const [filePath, workflow] of workflows) {
    const usesValues = [...workflow.matchAll(/^\s*uses:\s*([^\s#]+)/gm)].map((match) => match[1]);
    for (const usesValue of usesValues) {
      if (usesValue.startsWith("./")) continue;
      if (!pinnedActionPattern.test(usesValue)) {
        findings.push(`${filePath}: action ${usesValue} must be pinned to a 40-character SHA`);
      }
    }
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readRequiredFile(root, filePath, findings) {
  const absolutePath = path.join(root, filePath);
  if (!existsSync(absolutePath)) {
    findings.push(`${filePath}: missing`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}
