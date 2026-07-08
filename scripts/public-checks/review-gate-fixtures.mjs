import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

export function assertReviewGateFixtures(root) {
  execFileSync(
    process.execPath,
    [path.join(root, "scripts", "test-review-gate-fixtures.mjs")],
    {
      encoding: "utf8",
      stdio: "inherit"
    },
  );
}

export function assertReviewGateFixturePolicy(root) {
  const releaseText = readFileSync(path.join(root, "docs/RELEASE_GATES.md"), "utf8");
  const reviewText = readFileSync(path.join(root, "docs/REVIEW_RECTIFY.md"), "utf8");
  const requiredTerms = [
    "scripts/test-review-gate-fixtures.mjs",
    "unresolved threads",
    "current-head requested changes",
    "missing strict current-head reviews"
  ];
  const findings = [];
  for (const term of requiredTerms) {
    if (!releaseText.includes(term) && !reviewText.includes(term)) {
      findings.push(`missing review-gate fixture policy term: ${term}`);
    }
  }
  if (findings.length > 0) {
    throw new Error(`Review-gate fixture policy findings:\n${findings.join("\n")}`);
  }
}
