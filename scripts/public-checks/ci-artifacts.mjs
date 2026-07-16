import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ciWorkflowPath = ".github/workflows/ci.yml";
const pullRequestTemplatePath = ".github/PULL_REQUEST_TEMPLATE.md";
const releaseGatesPath = "docs/RELEASE_GATES.md";
const visualTestingPath = "docs/VISUAL_TESTING.md";
const reviewRectifyPath = "docs/REVIEW_RECTIFY.md";
const routeManifestPath = "packages/public-content/src/complyeaze.routes.json";

const requiredArtifacts = [
  {
    name: "public-site-build",
    paths: [
      "apps/complyeaze/dist",
      "apps/axal/dist",
      "apps/pack/dist",
      "test-results/public-build",
    ],
    retentionDays: 7,
  },
  {
    name: "public-visual-evidence",
    paths: ["test-results/public-visual"],
    retentionDays: 7,
  },
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
  const routeManifest = readFileSync(path.join(root, routeManifestPath), "utf8");
  const findings = [];

  findings.push(...artifactWorkflowFindings(ciWorkflow));

  for (const actionName of requiredPinnedActions) {
    const pattern = new RegExp(`uses: ${escapeRegex(actionName)}@[a-f0-9]{40}`, "g");
    if (![...stripYamlComments(ciWorkflow).matchAll(pattern)].length) {
      findings.push(`${ciWorkflowPath}: ${actionName} must be pinned to a 40-character SHA`);
    }
  }

  for (const snippet of forbiddenArtifactSnippets) {
    if (stripYamlComments(ciWorkflow).includes(snippet)) {
      findings.push(`${ciWorkflowPath}: forbidden artifact content ${snippet}`);
    }
  }

  for (const [filePath, text] of [
    [pullRequestTemplatePath, pullRequestTemplate],
    [releaseGatesPath, releaseGates],
    [visualTestingPath, visualTesting],
    [reviewRectifyPath, reviewRectify],
    [routeManifestPath, routeManifest]
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

export function assertCiArtifactPolicyFixtures() {
  assertCanonicalArtifactReferenceFixture();
  assertArtifactFixture("literal retention", artifactFixtureWorkflow(), false);
  assertArtifactFixture(
    "quoted retention",
    artifactFixtureWorkflow({ retentionLines: ['          retention-days: "7"'] }),
    false,
  );

  const invalidFixtures = [
    [
      "commented retention decoy",
      artifactFixtureWorkflow({
        retentionLines: ["          # retention-days: 7", "          retention-days: 30"],
      }),
    ],
    ["expression retention", artifactFixtureWorkflow({ retentionLines: ["          retention-days: ${{ inputs.days }}"] })],
    ["malformed retention", artifactFixtureWorkflow({ retentionLines: ["          retention-days: seven"] })],
    ["empty retention", artifactFixtureWorkflow({ retentionLines: ["          retention-days:"] })],
    ["zero retention", artifactFixtureWorkflow({ retentionLines: ["          retention-days: 0"] })],
    ["negative retention", artifactFixtureWorkflow({ retentionLines: ["          retention-days: -1"] })],
    ["excess retention", artifactFixtureWorkflow({ retentionLines: ["          retention-days: 8"] })],
    [
      "duplicate retention",
      artifactFixtureWorkflow({
        retentionLines: ["          retention-days: 7", "          retention-days: 30"],
      }),
    ],
    ["wrong artifact path", artifactFixtureWorkflow({ pathLines: ["          path: wrong"] })],
    [
      "missing Astro app outputs",
      artifactFixtureWorkflow({ pathLines: ["          path: |", "            dist"] }),
    ],
    ["empty artifact path", artifactFixtureWorkflow({ pathLines: ["          path:"] })],
    ["expression artifact path", artifactFixtureWorkflow({ pathLines: ["          path: ${{ github.workspace }}"] })],
    [
      "extra artifact path",
      artifactFixtureWorkflow({
        pathLines: ["          path: |", "            dist", "            other"],
      }),
    ],
    [
      "commented artifact path decoy",
      artifactFixtureWorkflow({
        pathLines: ["          # path: dist", "          path: wrong"],
      }),
    ],
    [
      "literal hash in block path",
      artifactFixtureWorkflow({
        pathLines: ["          path: |", "            dist # wrong"],
      }),
    ],
    [
      "duplicate artifact path",
      artifactFixtureWorkflow({
        pathLines: [
          "          path: |",
          "            dist",
          "          path: wrong",
        ],
      }),
    ],
  ];
  for (const [name, workflow] of invalidFixtures) {
    assertArtifactFixture(name, workflow, true);
  }
}

function assertCanonicalArtifactReferenceFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "public-ci-artifacts-"));
  const referencedArtifacts = "public-site-build public-visual-evidence";
  try {
    writeFixture(root, ciWorkflowPath, artifactFixtureWorkflow());
    for (const filePath of [
      pullRequestTemplatePath,
      releaseGatesPath,
      visualTestingPath,
      reviewRectifyPath,
    ]) {
      writeFixture(root, filePath, referencedArtifacts);
    }
    writeFixture(
      root,
      "packages/public-content/src/complyeaze.routes.json",
      JSON.stringify({ evidence: referencedArtifacts }),
    );
    assertCiArtifacts(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function writeFixture(root, filePath, contents) {
  const absolutePath = path.join(root, filePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, "utf8");
}

function artifactWorkflowFindings(workflow) {
  const activeWorkflow = stripYamlComments(workflow);
  const uploadSteps = activeWorkflow
    .split(/\n(?=      - name: )/)
    .filter((step) => /^\s*uses:\s+actions\/upload-artifact@/m.test(step));
  const findings = [];

  for (const artifact of requiredArtifacts) {
    const matches = uploadSteps.filter(
      (step) => scalarInput(parseStepInputs(step), "name") === artifact.name,
    );
    if (matches.length !== 1) {
      findings.push(
        `${ciWorkflowPath}: expected one upload for ${artifact.name}, found ${matches.length}`,
      );
      continue;
    }

    const step = matches[0];
    const inputs = parseStepInputs(step);
    const paths = literalPathList(inputs, "path");
    if (paths.join("\n") !== artifact.paths.join("\n")) {
      findings.push(`${ciWorkflowPath}: ${artifact.name} must upload only ${artifact.paths.join(", ")}`);
    }
    if (scalarInput(inputs, "if-no-files-found") !== "error") {
      findings.push(`${ciWorkflowPath}: ${artifact.name} must fail when evidence is missing`);
    }
    if (!/^\s*if:\s*\$\{\{\s*always\(\)\s*\}\}\s*$/m.test(step)) {
      findings.push(`${ciWorkflowPath}: ${artifact.name} must run with always()`);
    }

    const retention = inputs.get("retention-days") ?? [];
    const retentionDays = retention.length === 1 ? literalInteger(retention[0].value) : null;
    if (retentionDays !== artifact.retentionDays) {
      findings.push(
        `${ciWorkflowPath}: ${artifact.name} retention must be one literal ${artifact.retentionDays}-day value`,
      );
    }
  }
  return findings;
}

function parseStepInputs(step) {
  const withBlock = extractBlock(step, (line) => line.trim() === "with:");
  if (!withBlock) return new Map();
  const lines = withBlock.split("\n");
  const inputIndent = indentation(lines[0]) + 2;
  const inputs = new Map();

  for (let index = 1; index < lines.length; index += 1) {
    if (indentation(lines[index]) !== inputIndent) continue;
    const match = lines[index].match(/^\s*([a-zA-Z0-9-]+):\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, value] = match;
    const blockLines = [];
    for (const child of lines.slice(index + 1)) {
      if (child.trim() && indentation(child) <= inputIndent) break;
      if (child.trim()) blockLines.push(child.trim());
    }
    const values = inputs.get(key) ?? [];
    values.push({ value, blockLines });
    inputs.set(key, values);
  }
  return inputs;
}

function scalarInput(inputs, key) {
  const values = inputs.get(key) ?? [];
  if (values.length !== 1 || values[0].blockLines.length > 0) return null;
  return unquote(values[0].value);
}

function literalPathList(inputs, key) {
  const values = inputs.get(key) ?? [];
  if (values.length !== 1) return [];
  if (values[0].value.startsWith("|") || values[0].value.startsWith(">")) {
    return values[0].blockLines;
  }
  const scalar = unquote(values[0].value)?.trim();
  if (!scalar || scalar.includes("${{")) return [];
  return [scalar];
}

function literalInteger(value) {
  const match = value.match(/^(?:(["'])(-?\d+)\1|(-?\d+))$/);
  return match ? Number(match[2] ?? match[3]) : null;
}

function extractBlock(text, predicate) {
  const lines = text.split("\n");
  const start = lines.findIndex(predicate);
  if (start < 0) return "";
  const baseIndent = indentation(lines[start]);
  let end = start + 1;
  while (end < lines.length) {
    if (lines[end].trim() && indentation(lines[end]) <= baseIndent) break;
    end += 1;
  }
  return lines.slice(start, end).join("\n");
}

function stripYamlComments(text) {
  let blockScalarIndent = null;
  return text
    .split("\n")
    .map((line) => {
      if (
        blockScalarIndent !== null &&
        (!line.trim() || indentation(line) > blockScalarIndent)
      ) {
        return line;
      }
      blockScalarIndent = null;
      const activeLine = stripYamlComment(line);
      if (/:[ \t]*[|>][+-]?[0-9]*[ \t]*$/.test(activeLine)) {
        blockScalarIndent = indentation(activeLine);
      }
      return activeLine;
    })
    .join("\n");
}

function stripYamlComment(line) {
  let quote = null;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if ((character === '"' || character === "'") && line[index - 1] !== "\\") {
      quote = quote === character ? null : quote ?? character;
    } else if (character === "#" && quote === null) {
      return line.slice(0, index).trimEnd();
    }
  }
  return line;
}

function unquote(value) {
  const match = value.match(/^(?:"([^"]*)"|'([^']*)'|([^"'].*))$/);
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
}

function indentation(line) {
  return line.match(/^\s*/)[0].length;
}

function assertArtifactFixture(name, workflow, shouldFail) {
  if ((artifactWorkflowFindings(workflow).length > 0) !== shouldFail) {
    throw new Error(`CI artifact policy fixture failed: ${name}`);
  }
}

function artifactFixtureWorkflow({
  retentionLines = ["          retention-days: 7"],
  pathLines = [
    "          path: |",
    "            apps/complyeaze/dist",
    "            apps/axal/dist",
    "            apps/pack/dist",
    "            test-results/public-build",
  ],
} = {}) {
  return [
    artifactFixtureStep("public-site-build", pathLines, retentionLines),
    artifactFixtureStep(
      "public-visual-evidence",
      ["          path: |", "            test-results/public-visual"],
      ["          retention-days: 7"],
    ),
  ].join("\n");
}

function artifactFixtureStep(name, pathLines, retentionLines) {
  return [
    "      - name: Upload fixture",
    "        if: ${{ always() }}",
    "        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a",
    "        with:",
    `          name: ${name}`,
    ...pathLines,
    "          if-no-files-found: error",
    ...retentionLines,
  ].join("\n");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
