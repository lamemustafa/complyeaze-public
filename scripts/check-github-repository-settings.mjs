#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import process from "node:process";

const repository = process.argv[2] ?? "lamemustafa/complyeaze-public";
const expectedTopics = ["complyeaze", "public-site", "compliance", "open-source", "trust"];
const expectedRequiredChecks = ["Public site gates", "Review gate"];
const expectedRuleTypes = ["deletion", "non_fast_forward", "pull_request", "required_status_checks"];

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
  assertEqual("default branch", repo.defaultBranchRef?.name, "master", findings);
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
  const protectMaster = rulesets.find((ruleset) => ruleset.name === "Protect master" && ruleset.target === "branch");
  if (!protectMaster) {
    findings.push("ruleset missing: Protect master branch ruleset");
  } else {
    const ruleset = ghJson(["api", `repos/${repository}/rulesets/${protectMaster.id}`]);
    assertEqual("Protect master enforcement", ruleset.enforcement, "active", findings);
    const include = ruleset.conditions?.ref_name?.include ?? [];
    if (!include.includes("refs/heads/master")) {
      findings.push("Protect master ruleset must include refs/heads/master");
    }
    const rulesByType = new Map((ruleset.rules ?? []).map((rule) => [rule.type, rule]));
    for (const ruleType of expectedRuleTypes) {
      if (!rulesByType.has(ruleType)) findings.push(`Protect master ruleset missing rule: ${ruleType}`);
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
    const checks = new Set((checksParameters.required_status_checks ?? []).map((check) => check.context));
    for (const check of expectedRequiredChecks) {
      if (!checks.has(check)) findings.push(`Protect master required check missing: ${check}`);
    }
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

run();
