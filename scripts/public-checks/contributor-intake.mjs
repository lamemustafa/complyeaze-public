import { readFileSync } from "node:fs";
import path from "node:path";

const codeownersPath = ".github/CODEOWNERS";
const issueConfigPath = ".github/ISSUE_TEMPLATE/config.yml";
const supportPath = "SUPPORT.md";
const securityPath = "SECURITY.md";
const conductPath = "CODE_OF_CONDUCT.md";

const requiredCodeownersTerms = [
  "Single-maintainer bootstrap owner",
  "placeholder teams or users that cannot approve",
  "* @lamemustafa",
  "/.github/ @lamemustafa",
  "/AGENTS.md @lamemustafa",
  "/README.md @lamemustafa",
  "/CONTRIBUTING.md @lamemustafa",
  "/CODE_OF_CONDUCT.md @lamemustafa",
  "/SECURITY.md @lamemustafa",
  "/SUPPORT.md @lamemustafa",
  "/LICENSE @lamemustafa",
  "/LICENSE.brand.md @lamemustafa",
  "/TRADEMARKS.md @lamemustafa",
  "/docs/ @lamemustafa",
  "/scripts/ @lamemustafa",
  "/package.json @lamemustafa",
  "/pnpm-lock.yaml @lamemustafa",
  "/apps/ @lamemustafa",
  "/packages/ @lamemustafa"
];

const requiredIssueConfigTerms = [
  "blank_issues_enabled: false",
  "Security or sensitive-data report",
  "security/advisories/new",
  "PAN",
  "GSTIN",
  "Aadhaar",
  "credentials",
  "cookies",
  "OTPs",
  "local file paths",
  "Sensitive conduct report",
  "CODE_OF_CONDUCT.md#enforcement",
  "private messages",
  "taxpayer data",
  "Support boundaries",
  "SUPPORT.md",
  "private product",
  "deployment",
  "security",
  "taxpayer-data"
];

const requiredSupportTerms = [
  "Use public issues for public-site bugs",
  "Do not post",
  "Private deployment",
  "SECURITY.md"
];

const requiredSecurityTerms = [
  "Do not open a public issue",
  "GitHub private vulnerability reporting",
  "synthetic data",
  "Redacted screenshots or logs only"
];

const requiredConductTerms = [
  "Use synthetic data in examples",
  "Redact taxpayer identifiers",
  "Maintainers may edit, hide, or remove content",
  "sensitive data"
];

export function assertContributorIntake(root) {
  const findings = [];

  assertTerms(codeownersPath, readFile(root, codeownersPath), requiredCodeownersTerms, findings);
  assertTerms(issueConfigPath, readFile(root, issueConfigPath), requiredIssueConfigTerms, findings);
  assertTerms(supportPath, readFile(root, supportPath), requiredSupportTerms, findings);
  assertTerms(securityPath, readFile(root, securityPath), requiredSecurityTerms, findings);
  assertTerms(conductPath, readFile(root, conductPath), requiredConductTerms, findings);

  if (findings.length > 0) {
    throw new Error(`Contributor intake findings:\n${findings.join("\n")}`);
  }
}

function assertTerms(filePath, text, terms, findings) {
  const normalized = normalize(text);
  for (const term of terms) {
    if (!normalized.includes(normalize(term))) {
      findings.push(`${filePath}: missing ${term}`);
    }
  }
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
