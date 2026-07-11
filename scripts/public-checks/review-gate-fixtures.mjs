import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

export function assertReviewGateFixtures(root) {
  for (const script of [
    "test-review-gate-fixtures.mjs",
    "test-review-gate-sync-fixtures.mjs",
  ]) {
    execFileSync(process.execPath, [path.join(root, "scripts", script)], {
      encoding: "utf8",
      stdio: "inherit",
    });
  }
}

export function assertReviewGateFixturePolicy(root) {
  const releaseText = readFileSync(path.join(root, "docs/RELEASE_GATES.md"), "utf8");
  const reviewText = readFileSync(path.join(root, "docs/REVIEW_RECTIFY.md"), "utf8");
  const workflow = readFileSync(path.join(root, ".github/workflows/review-gate.yml"), "utf8");
  const requiredTerms = [
    "scripts/test-review-gate-fixtures.mjs",
    "unresolved threads",
    "current-head requested changes",
    "missing strict current-head reviews",
    "Fork review/comment events",
    "one daily interval",
    "serialized per pull request",
  ];
  const findings = [];
  const policyText = `${releaseText}\n${reviewText}`.replace(/\s+/g, " ");
  for (const term of requiredTerms) {
    if (!policyText.includes(term)) {
      findings.push(`missing review-gate fixture policy term: ${term}`);
    }
  }

  findings.push(...reviewGateWorkflowFindings(workflow));
  assertReviewGatePolicyFixtures(workflow);

  if (findings.length > 0) {
    throw new Error(`Review-gate fixture policy findings:\n${findings.join("\n")}`);
  }
}

function reviewGateWorkflowFindings(workflow) {
  const activeWorkflow = stripYamlComments(workflow);
  const onBlock = extractBlock(activeWorkflow, (line) => line === "on:");
  const planJob = namedJob(activeWorkflow, "plan-review-gate");
  const syncJob = namedJob(activeWorkflow, "review-gate");
  const findings = [];

  for (const [eventName, expectedActions] of Object.entries({
    pull_request_target: ["opened", "reopened", "synchronize", "ready_for_review", "edited"],
    pull_request_review: ["submitted", "edited", "dismissed"],
    pull_request_review_comment: ["created", "edited", "deleted"],
  })) {
    const eventBlock = extractBlock(onBlock, (line) => line.trim() === `${eventName}:`);
    const actualActions = eventTypes(eventBlock);
    if (!sameValues(actualActions, expectedActions)) {
      findings.push(
        `review-gate workflow ${eventName} actions must be ${expectedActions.join(", ")}`,
      );
    }
  }

  const scheduleBlock = extractBlock(onBlock, (line) => line.trim() === "schedule:");
  const crons = Array.from(
    scheduleBlock.matchAll(/^\s*-\s+cron:\s*(.+?)\s*$/gm),
    (match) => unquote(match[1]),
  );
  if (crons.length !== 1 || crons[0] !== "23 4 * * *") {
    findings.push("review-gate workflow must use one daily reconciliation cron");
  }

  if (!planJob || !syncJob) {
    findings.push("review-gate workflow must keep one plan job and one shared sync job");
    return findings;
  }

  assertMapping(
    planJob,
    "permissions:",
    { contents: "read", "pull-requests": "read" },
    "review-gate plan permissions",
    findings,
  );
  assertMapping(
    syncJob,
    "permissions:",
    { contents: "read", "pull-requests": "read", statuses: "write" },
    "review-gate sync permissions",
    findings,
  );
  if ([...activeWorkflow.matchAll(/^\s*permissions:/gm)].length !== 2) {
    findings.push("review-gate workflow must define permissions only on its two jobs");
  }

  for (const line of [
    "pull_requests: ${{ steps.targets.outputs.pull_requests }}",
    "needs: plan-review-gate",
    "if: ${{ needs.plan-review-gate.outputs.pull_requests != '[]' }}",
    "pr: ${{ fromJSON(needs.plan-review-gate.outputs.pull_requests) }}",
  ]) {
    if (!hasActiveLine(activeWorkflow, line)) {
      findings.push(`review-gate matrix plan missing ${line}`);
    }
  }

  assertMapping(
    syncJob,
    "concurrency:",
    {
      group: "review-gate-${{ github.workflow }}-${{ matrix.pr }}",
      "cancel-in-progress": "true",
    },
    "review-gate per-PR concurrency",
    findings,
  );

  const planStep = namedStep(planJob, "Plan reconciliation targets");
  const planCommands = shellRunLines(planStep);
  for (const command of [
    'if [ "${EVENT_NAME}" = "schedule" ]; then',
    'pull_requests="$(node scripts/sync-review-gate-status.mjs --repo "${GITHUB_REPOSITORY}" --list-open)"',
    'elif [ "${EVENT_NAME}" = "pull_request_target" ] || [ "${HEAD_REPOSITORY}" = "${GITHUB_REPOSITORY}" ]; then',
    'pull_requests="[${PR_NUMBER}]"',
    'pull_requests="[]"',
    'echo "pull_requests=${pull_requests}" >> "${GITHUB_OUTPUT}"',
  ]) {
    if (!planCommands.includes(command)) {
      findings.push(`review-gate plan step missing ${command}`);
    }
  }

  const syncStep = namedStep(syncJob, "Sync review gate status");
  const syncCommands = shellRunLines(syncStep);
  for (const command of [
    '--pr "${PR_NUMBER}"',
    '--wait-head-review-ms 0',
    'if [ "${EVENT_NAME}" = "schedule" ]; then',
    "args+=(--repair --skip-pending-status)",
    'node scripts/sync-review-gate-status.mjs "${args[@]}"',
  ]) {
    if (!syncCommands.includes(command)) {
      findings.push(`review-gate sync step missing ${command}`);
    }
  }
  if (syncCommands.some((command) => command.includes("--all-open"))) {
    findings.push("review-gate sync step must not bypass per-PR serialized repair");
  }

  const checkoutSteps = activeWorkflow
    .split(/\n(?=      - name: )/)
    .filter((step) => /^\s*uses:\s+actions\/checkout@/m.test(step));
  if (checkoutSteps.length !== 2) {
    findings.push("review-gate workflow must use two trusted checkout steps");
  } else {
    for (const checkoutStep of checkoutSteps) {
      const withInputs = directMapping(
        extractBlock(checkoutStep, (line) => line.trim() === "with:"),
      );
      for (const [key, expected] of Object.entries({
        repository: "${{ github.repository }}",
        ref: "${{ github.event.repository.default_branch }}",
        "persist-credentials": "false",
      })) {
        const values = withInputs.get(key) ?? [];
        if (values.length !== 1 || unquote(values[0]) !== expected) {
          findings.push(
            `review-gate trusted checkout input ${key} must occur once as ${expected}`,
          );
        }
      }
    }
  }

  const dailyCheckout = namedStep(
    planJob,
    "Checkout trusted default branch for daily enumeration",
  );
  if (!hasActiveLine(dailyCheckout, "if: ${{ github.event_name == 'schedule' }}")) {
    findings.push("review-gate enumeration checkout must remain schedule-only");
  }

  for (const fragment of [
    "secrets.",
    "github.event.review.body",
    "github.event.comment.body",
    "github.event.pull_request.body",
  ]) {
    if (activeWorkflow.includes(fragment)) {
      findings.push(`review-gate workflow must not interpolate ${fragment}`);
    }
  }

  return findings;
}

function assertReviewGatePolicyFixtures(workflow) {
  const trustedRef = "${{ github.event.repository.default_branch }}";
  const forkCondition =
    'elif [ "${EVENT_NAME}" = "pull_request_target" ] || [ "${HEAD_REPOSITORY}" = "${GITHUB_REPOSITORY}" ]; then';
  const cases = [
    {
      name: "quoted trusted checkout formatting",
      workflow: replaceActiveLine(
        workflow,
        "persist-credentials: false",
        "          persist-credentials: 'false'",
      ),
      finding: null,
    },
    {
      name: "commented review event",
      workflow: replaceActiveLine(workflow, "pull_request_review:", "  # pull_request_review:"),
      finding: "pull_request_review actions",
    },
    {
      name: "fork guard bypass",
      workflow: replaceActiveLine(
        workflow,
        forkCondition,
        `          elif true; then\n            # ${forkCondition}`,
      ),
      finding: "plan step missing",
    },
    {
      name: "trusted ref decoy under env",
      workflow: replaceActiveLine(
        replaceActiveLine(
          workflow,
          `ref: ${trustedRef}`,
          "          ref: ${{ github.event.review.commit_id }}",
        ),
        "with:",
        `        env:\n          ref: ${trustedRef}\n        with:`,
      ),
      finding: "trusted checkout input ref",
    },
    {
      name: "duplicate checkout ref",
      workflow: replaceActiveLine(
        workflow,
        `ref: ${trustedRef}`,
        `          ref: ${trustedRef}\n          ref: ${trustedRef}`,
      ),
      finding: "trusted checkout input ref",
    },
    {
      name: "missing open-PR enumeration",
      workflow: replaceActiveLine(
        workflow,
        'pull_requests="$(node scripts/sync-review-gate-status.mjs --repo "${GITHUB_REPOSITORY}" --list-open)"',
        '              # pull_requests="$(node scripts/sync-review-gate-status.mjs --repo "${GITHUB_REPOSITORY}" --list-open)"',
      ),
      finding: "plan step missing",
    },
    {
      name: "echoed repair decoy",
      workflow: replaceActiveLine(
        workflow,
        "args+=(--repair --skip-pending-status)",
        "            echo 'args+=(--repair --skip-pending-status)'",
      ),
      finding: "sync step missing",
    },
    {
      name: "divergent scheduled concurrency",
      workflow: replaceActiveLine(
        workflow,
        "group: review-gate-${{ github.workflow }}-${{ matrix.pr }}",
        "      group: review-gate-${{ github.workflow }}-${{ github.ref }}",
      ),
      finding: "per-PR concurrency",
    },
  ];

  for (const testCase of cases) {
    const findings = reviewGateWorkflowFindings(testCase.workflow);
    const passed = testCase.finding
      ? findings.some((finding) => finding.includes(testCase.finding))
      : findings.length === 0;
    if (!passed) {
      throw new Error(`Review-gate workflow policy fixture failed: ${testCase.name}`);
    }
  }
}

function assertMapping(text, header, expected, label, findings) {
  const values = directMapping(extractBlock(text, (line) => line.trim() === header));
  if (values.size !== Object.keys(expected).length) {
    findings.push(`${label} must contain only the required keys`);
    return;
  }
  for (const [key, expectedValue] of Object.entries(expected)) {
    const actual = values.get(key) ?? [];
    if (actual.length !== 1 || unquote(actual[0]) !== expectedValue) {
      findings.push(`${label} must set ${key} to ${expectedValue}`);
    }
  }
}

function shellRunLines(step) {
  return extractBlock(step, (line) => /^\s+run:\s*[|>]\s*$/.test(line))
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean);
}

function directMapping(block) {
  if (!block) return new Map();
  const lines = block.split("\n");
  const valueIndent = indentation(lines[0]) + 2;
  const values = new Map();
  for (const line of lines.slice(1)) {
    if (indentation(line) !== valueIndent) continue;
    const match = line.match(/^\s*([a-zA-Z0-9-]+):\s*(.*?)\s*$/);
    if (!match) continue;
    const entries = values.get(match[1]) ?? [];
    entries.push(match[2]);
    values.set(match[1], entries);
  }
  return values;
}

function eventTypes(eventBlock) {
  const lines = eventBlock.split("\n");
  const typesIndex = lines.findIndex((line) => /^\s+types:\s*/.test(line));
  if (typesIndex < 0) return [];

  const inline = lines[typesIndex].match(/^\s+types:\s*\[([^\]]*)\]\s*$/);
  if (inline) return inline[1].split(",").map((value) => value.trim()).filter(Boolean);

  if (!/^\s+types:\s*$/.test(lines[typesIndex])) return [];
  const typesIndent = indentation(lines[typesIndex]);
  const actions = [];
  for (const line of lines.slice(typesIndex + 1)) {
    if (line.trim() && indentation(line) <= typesIndent) break;
    const match = line.match(/^\s*-\s+([a-zA-Z_]+)\s*$/);
    if (match) actions.push(match[1]);
  }
  return actions;
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

function namedJob(workflow, id) {
  return extractBlock(workflow, (line) => line === `  ${id}:`);
}

function namedStep(workflow, name) {
  return extractBlock(workflow, (line) => line.trim() === `- name: ${name}`);
}

function hasActiveLine(text, expected) {
  return text.split("\n").some((line) => line.trim() === expected);
}

function stripYamlComments(text) {
  return text
    .split("\n")
    .map((line) => stripYamlComment(line))
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

function replaceActiveLine(workflow, activeText, replacement) {
  const lines = workflow.split("\n");
  const index = lines.findIndex(
    (line) => stripYamlComment(line).trim() === activeText,
  );
  if (index < 0) {
    throw new Error(`Review-gate fixture source missing ${activeText}`);
  }
  lines[index] = replacement;
  return lines.join("\n");
}

function sameValues(actual, expected) {
  return (
    actual.length === expected.length &&
    [...actual].sort().every((value, index) => value === [...expected].sort()[index])
  );
}

function unquote(value) {
  const match = value.match(/^(?:"([^"]*)"|'([^']*)'|([^"'].*))$/);
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
}

function indentation(line) {
  return line.match(/^\s*/)[0].length;
}
