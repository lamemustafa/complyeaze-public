import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const workflowPath = ".github/workflows/pages-deploy.yml";
const releaseGatesPath = "docs/RELEASE_GATES.md";
const repositorySettingsPath = "docs/REPOSITORY_SETTINGS.md";

const requiredWorkflowSnippets = [
  "name: Pages deploy",
  "workflow_dispatch:",
  "push:",
  "- main",
  "contents: read",
  "pages: write",
  "id-token: write"
];

const requiredJobSnippets = [
  "if: ${{ github.ref == 'refs/heads/main' && vars.ENABLE_GITHUB_PAGES_DEPLOY == 'true' }}",
  "name: github-pages",
  "pnpm verify",
  "path: apps/complyeaze/dist",
];

const requiredPinnedActions = [
  "actions/configure-pages",
  "actions/upload-pages-artifact",
  "actions/deploy-pages"
];

const forbiddenSnippets = [
  "secrets.",
  "CNAME",
  "custom_domain",
  "Prisma",
  "Redis",
  "BullMQ",
  "DATABASE_URL",
  "COOKIE",
  "TOKEN"
];

function uncommented(text) {
  return text
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("#"))
    .join("\n");
}

function jobBlock(workflow, jobName) {
  const marker = `  ${jobName}:`;
  const start = workflow.indexOf(marker);
  if (start === -1) return "";
  const nextJob = workflow.slice(start + marker.length).search(/\n  [a-zA-Z0-9_-]+:\n/);
  return nextJob === -1 ? workflow.slice(start) : workflow.slice(start, start + marker.length + nextJob);
}

export function assertDeployWorkflow(root) {
  const absolutePath = path.join(root, workflowPath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing ${workflowPath}`);
  }

  const workflow = uncommented(readFileSync(absolutePath, "utf8"));
  const deployJob = jobBlock(workflow, "build-and-deploy");
  const releaseGates = readFileSync(path.join(root, releaseGatesPath), "utf8");
  const repositorySettings = readFileSync(path.join(root, repositorySettingsPath), "utf8");
  const findings = [];

  for (const snippet of requiredWorkflowSnippets) {
    if (!workflow.includes(snippet)) {
      findings.push(`${workflowPath}: missing ${snippet}`);
    }
  }
  if (!deployJob) {
    findings.push(`${workflowPath}: missing build-and-deploy job`);
  }
  for (const snippet of requiredJobSnippets) {
    if (!deployJob.includes(snippet)) {
      findings.push(`${workflowPath}: build-and-deploy job missing ${snippet}`);
    }
  }
  for (const actionName of requiredPinnedActions) {
    const pattern = new RegExp(`uses: ${escapeRegex(actionName)}@[a-f0-9]{40}`);
    if (!pattern.test(deployJob)) {
      findings.push(`${workflowPath}: ${actionName} must be pinned to a 40-character SHA`);
    }
  }

  for (const snippet of forbiddenSnippets) {
    if (workflow.includes(snippet)) {
      findings.push(`${workflowPath}: forbidden deployment content ${snippet}`);
    }
  }

  for (const [filePath, text] of [
    [releaseGatesPath, releaseGates],
    [repositorySettingsPath, repositorySettings]
  ]) {
    if (!text.includes("ENABLE_GITHUB_PAGES_DEPLOY")) {
      findings.push(`${filePath}: missing Pages deploy guard variable`);
    }
    if (!text.includes("hosted route")) {
      findings.push(`${filePath}: missing hosted-route cleanup caveat`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Deploy workflow findings:\n${findings.join("\n")}`);
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
