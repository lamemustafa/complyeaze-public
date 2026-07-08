import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ciWorkflowPath = ".github/workflows/ci.yml";
const pullRequestTemplatePath = ".github/PULL_REQUEST_TEMPLATE.md";
const releaseGatesPath = "docs/RELEASE_GATES.md";
const visualTestingPath = "docs/VISUAL_TESTING.md";
const reviewRectifyPath = "docs/REVIEW_RECTIFY.md";
const policyDataPath = "src/policy-data.mjs";

const requiredArtifactSnippets = [
  "if: ${{ always() }}",
  "name: public-site-build",
  "path: |",
  "dist",
  "if-no-files-found: error",
  "retention-days: 14",
  "name: public-visual-evidence",
  "test-results/public-visual",
  "retention-days: 30"
];

const requiredPinnedActions = ["actions/upload-artifact"];

const forbiddenArtifactSnippets = [
  "node_modules",
  ".git",
  ".env",
  "secrets.",
  "DATABASE_URL",
  "COOKIE",
  "TOKEN"
];

export function assertCiArtifacts(root) {
  const ciPath = path.join(root, ciWorkflowPath);
  if (!existsSync(ciPath)) {
    throw new Error(`Missing ${ciWorkflowPath}`);
  }

  const ciWorkflow = readFileSync(ciPath, "utf8");
  const releaseGates = readFileSync(path.join(root, releaseGatesPath), "utf8");
  const visualTesting = readFileSync(path.join(root, visualTestingPath), "utf8");
  const reviewRectify = readFileSync(path.join(root, reviewRectifyPath), "utf8");
  const pullRequestTemplate = readFileSync(path.join(root, pullRequestTemplatePath), "utf8");
  const policyData = readFileSync(path.join(root, policyDataPath), "utf8");
  const findings = [];

  for (const snippet of requiredArtifactSnippets) {
    if (!ciWorkflow.includes(snippet)) {
      findings.push(`${ciWorkflowPath}: missing artifact control ${snippet}`);
    }
  }
  for (const actionName of requiredPinnedActions) {
    const pattern = new RegExp(`uses: ${escapeRegex(actionName)}@[a-f0-9]{40}`, "g");
    if (![...ciWorkflow.matchAll(pattern)].length) {
      findings.push(`${ciWorkflowPath}: ${actionName} must be pinned to a 40-character SHA`);
    }
  }
  const alwaysUploadCount = [...ciWorkflow.matchAll(/if: \$\{\{ always\(\) \}\}/g)].length;
  if (alwaysUploadCount < 2) {
    findings.push(`${ciWorkflowPath}: both artifact uploads must run with always()`);
  }

  for (const snippet of forbiddenArtifactSnippets) {
    if (ciWorkflow.includes(snippet)) {
      findings.push(`${ciWorkflowPath}: forbidden artifact content ${snippet}`);
    }
  }

  for (const [filePath, text] of [
    [pullRequestTemplatePath, pullRequestTemplate],
    [releaseGatesPath, releaseGates],
    [visualTestingPath, visualTesting],
    [reviewRectifyPath, reviewRectify],
    [policyDataPath, policyData]
  ]) {
    if (!text.includes("public-visual-evidence")) {
      findings.push(`${filePath}: missing public-visual-evidence artifact reference`);
    }
    if (!text.includes("public-site-build")) {
      findings.push(`${filePath}: missing public-site-build artifact reference`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`CI artifact findings:\n${findings.join("\n")}`);
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
