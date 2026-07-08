import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const dependabotPath = ".github/dependabot.yml";
const policyPath = "docs/DEPENDENCY_POLICY.md";
const contributingPath = "CONTRIBUTING.md";
const securityPath = "SECURITY.md";
const releaseGatesPath = "docs/RELEASE_GATES.md";

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

  for (const snippet of requiredDependabotSnippets) {
    if (!dependabot.includes(snippet)) {
      findings.push(`${dependabotPath}: missing ${snippet}`);
    }
  }

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

  if (findings.length > 0) {
    throw new Error(`Dependency policy findings:\n${findings.join("\n")}`);
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
