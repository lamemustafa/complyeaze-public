#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import process from "node:process";

const repository = process.argv[2] ?? "lamemustafa/complyeaze-public";
const expectedTopics = ["complyeaze", "public-site", "compliance", "open-source", "trust"];
const expectedRequiredChecks = ["Public site gates", "Review gate"];
const expectedRuleTypes = ["deletion", "non_fast_forward", "pull_request", "required_status_checks"];
const reviewGateIntegrationId = 15368;

function run() {
  const findings = [];
  const repo = ghJson([
    "repo",
    "view",
    repository,
    "--json",
    [
      "nameWithOwner",
      "visibility",
      "defaultBranchRef",
      "homepageUrl",
      "hasIssuesEnabled",
      "hasProjectsEnabled",
      "hasWikiEnabled",
      "repositoryTopics",
      "squashMergeAllowed"
    ].join(",")
  ]);

  assertEqual("repository", repo.nameWithOwner, repository, findings);
  assertEqual("visibility", repo.visibility, "PUBLIC", findings);
  assertEqual("default branch", repo.defaultBranchRef?.name, "main", findings);
  assertEqual("homepage", repo.homepageUrl, "https://complyeaze.com", findings);
  assertEqual("issues", repo.hasIssuesEnabled, true, findings);
  assertEqual("projects", repo.hasProjectsEnabled, false, findings);
  assertEqual("wiki", repo.hasWikiEnabled, false, findings);
  assertEqual("squash merge support", repo.squashMergeAllowed, true, findings);

  const topics = new Set((repo.repositoryTopics ?? []).map((topic) => topic.name));
  for (const topic of expectedTopics) {
    if (!topics.has(topic)) findings.push(`repository topic missing: ${topic}`);
  }

  const rulesets = ghJson(["api", `repos/${repository}/rulesets`]);
  const protectMain = rulesets.find((ruleset) => ruleset.name === "Protect main" && ruleset.target === "branch");
  if (!protectMain) {
    findings.push("ruleset missing: Protect main branch ruleset");
  } else {
    const ruleset = ghJson(["api", `repos/${repository}/rulesets/${protectMain.id}`]);
    assertEqual("Protect main enforcement", ruleset.enforcement, "active", findings);
    assertArrayEqual("Protect main included refs", ruleset.conditions?.ref_name?.include, ["refs/heads/main"], findings);
    assertArrayEqual("Protect main excluded refs", ruleset.conditions?.ref_name?.exclude, [], findings);
    assertPullRequestOnlyBypass(ruleset.bypass_actors ?? [], findings);

    const rulesByType = new Map((ruleset.rules ?? []).map((rule) => [rule.type, rule]));
    for (const ruleType of expectedRuleTypes) {
      if (!rulesByType.has(ruleType)) findings.push(`Protect main ruleset missing rule: ${ruleType}`);
    }

    const pullRequestRule = rulesByType.get("pull_request");
    const pullRequestParameters = pullRequestRule?.parameters ?? {};
    assertEqual("approving review count", pullRequestParameters.required_approving_review_count, 1, findings);
    assertEqual("code-owner review", pullRequestParameters.require_code_owner_review, true, findings);
    assertEqual("stale reviews dismissed on push", pullRequestParameters.dismiss_stale_reviews_on_push, true, findings);
    assertEqual("review thread resolution", pullRequestParameters.required_review_thread_resolution, true, findings);
    assertArrayEqual("allowed merge methods", pullRequestParameters.allowed_merge_methods, ["squash"], findings);

    const checksRule = rulesByType.get("required_status_checks");
    const checksParameters = checksRule?.parameters ?? {};
    assertEqual("strict required status checks", checksParameters.strict_required_status_checks_policy, true, findings);
    assertRequiredChecks(checksParameters.required_status_checks ?? [], findings);
  }

  if (findings.length > 0) {
    throw new Error(`GitHub repository settings findings for ${repository}:\n${findings.join("\n")}`);
  }

  console.log(`GitHub repository settings check passed for ${repository}`);
}

function ghJson(args) {
  const output = execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return JSON.parse(output);
}

function assertEqual(label, actual, expected, findings) {
  if (actual !== expected) {
    findings.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertArrayEqual(label, actual, expected, findings) {
  const actualJson = JSON.stringify(actual ?? []);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    findings.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function assertPullRequestOnlyBypass(bypassActors, findings) {
  for (const actor of bypassActors) {
    if (actor.bypass_mode !== "pull_request") {
      findings.push(`Protect main bypass actor ${actor.actor_id} must be pull_request-only`);
    }
  }
}

function assertRequiredChecks(requiredChecks, findings) {
  const contexts = requiredChecks.map((check) => check.context).sort();
  assertArrayEqual("required status check contexts", contexts, [...expectedRequiredChecks].sort(), findings);

  const reviewGate = requiredChecks.find((check) => check.context === "Review gate");
  assertEqual("Review gate integration", reviewGate?.integration_id, reviewGateIntegrationId, findings);
}

run();
