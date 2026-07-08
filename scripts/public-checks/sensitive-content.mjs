import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([".git", "node_modules", "dist", "out", ".next", "test-results"]);
const allowedFixtureFiles = new Set(["scripts/public-checks/sensitive-content.mjs"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml"
]);
const checkedArtifactExtensions = new Set([".gif", ".har", ".jpeg", ".jpg", ".pdf", ".png", ".webp", ".zip"]);
const allowedArtifactFiles = new Set([]);
const jwtPrefix = ["e", "y", "J"].join("");
const privateKeyLabel = ["PRIVATE", " KEY"].join("");
const privateKeyHeaderPattern = ["-{5}BEGIN (?:RSA |EC |OPENSSH |DSA |)?", privateKeyLabel, "-{5}"].join("");

const sensitivePatterns = [
  {
    label: "secret-like env assignment",
    pattern: /\b[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PRIVATE_KEY|COOKIE|API_KEY|ACCESS_KEY|SESSION)[A-Z0-9_]*\s*=\s*["']?[^"'\s]+/i
  },
  {
    label: "Indian PAN-like identifier",
    pattern: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g
  },
  {
    label: "Indian GSTIN-like identifier",
    pattern: /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b/g
  },
  {
    label: "Aadhaar-like identifier",
    pattern: /\b(?:\d[ -]?){12}\b/g
  },
  {
    label: "Indian phone-like number",
    pattern: /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g
  },
  {
    label: "JWT-like token",
    pattern: new RegExp(`\\b${jwtPrefix}[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}\\b`, "g")
  },
  {
    label: "private key block",
    pattern: new RegExp(privateKeyHeaderPattern, "g")
  },
  {
    label: "cookie header",
    pattern: /\b(?:set-cookie|cookie):\s*[^;\n]+=/gi
  },
  {
    label: "local filesystem path",
    pattern: /(?:\/Users\/[A-Za-z0-9._-]+\/[^\s"')`]+|\/home\/[A-Za-z0-9._-]+\/[^\s"')`]+|[A-Za-z]:\\Users\\[^\s"')`]+)/g
  },
  {
    label: "browser profile path",
    pattern: /\b(?:Default|Profile \d+|User Data|Local State|Cookies)\b.*\b(?:Chrome|Chromium|Brave|Edge)\b/gi
  },
  {
    label: "portal HTML artifact",
    pattern: /<(?:html|form|input|script)[^>]+(?:gst|gstn|captcha|login|portal)[^>]*>/gi
  },
  {
    label: "sensitive artifact filename",
    pattern: /\b(?:notice|order|reply|portal|captcha|otp|credential|cookie|token|return|gst)[-_][A-Za-z0-9._-]+\.(?:pdf|png|jpe?g|html|json|txt|har|zip)\b/gi
  }
];

const policyOnlyTerms = [
  "Aadhaar",
  "phone numbers",
  "taxpayer names",
  "portal HTML",
  "notices",
  "credentials",
  "OTP",
  "CAPTCHA",
  "cookies",
  "tokens",
  "local paths",
  "production screenshots"
];

export function assertSensitiveContent(root, options = {}) {
  const files = options.files ?? walkTextFiles(root);
  const findings = [];

  for (const filePath of files) {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
    if (!existsSync(absolutePath)) continue;
    const relativePath = path.relative(root, absolutePath);
    if (allowedFixtureFiles.has(relativePath)) continue;
    const text = readFileSync(absolutePath, "utf8");
    for (const { label, pattern } of sensitivePatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        findings.push(`${relativePath}: ${label}`);
      }
    }
  }

  if (findings.length > 0) {
    throw new Error(`Sensitive public-content findings:\n${findings.join("\n")}`);
  }

  assertNoUncheckedArtifacts(root);
}

export function assertSensitiveContentFixturePolicy() {
  const safePolicyText = policyOnlyTerms.join("; ");
  assertNoFixtureFindings("safe policy terms", safePolicyText);

  const failingFixtures = [
    ["PAN", fixture("ABCDE", "1234", "F")],
    ["GSTIN", fixture("27", "ABCDE", "1234", "F", "1Z5")],
    ["Aadhaar", fixture("1234 ", "5678 ", "9012")],
    ["phone", fixture("+91 ", "98765", "43210")],
    ["JWT", fixture(jwtPrefix, "hbGci", "OiJIUzI1NiJ9.", jwtPrefix, "zdWIi", "OiJkZW1vIn0.", "signature123")],
    ["private key", fixture("-----BEGIN ", privateKeyLabel, "-----")],
    ["cookie header", fixture("cookie: session_", "id=abc123")],
    ["local path", fixture("/Us", "ers/example/Desktop/notice.pdf")],
    ["browser profile", "User Data Default Chrome"],
    ["portal HTML", fixture("<form action=\"/gst-login\">", "<input name=\"captcha\">", "</form>")],
    ["artifact filename", fixture("notice-", "real-taxpayer.pdf")]
  ];

  const missed = failingFixtures.filter(([, text]) => fixtureFindings(text).length === 0);
  if (missed.length > 0) {
    throw new Error(`Sensitive-content fixtures did not fail: ${missed.map(([label]) => label).join(", ")}`);
  }
}

function fixture(...parts) {
  return parts.join("");
}

function assertNoFixtureFindings(label, text) {
  const findings = fixtureFindings(text);
  if (findings.length > 0) {
    throw new Error(`${label} fixture unexpectedly failed:\n${findings.join("\n")}`);
  }
}

function fixtureFindings(text) {
  const findings = [];
  for (const { label, pattern } of sensitivePatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) findings.push(label);
  }
  return findings;
}

function walkTextFiles(root) {
  const files = [];
  for (const name of readdirSync(root)) {
    if (ignoredDirectories.has(name)) continue;
    const filePath = path.join(root, name);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      files.push(...walkTextFiles(filePath));
    } else if (textExtensions.has(path.extname(name))) {
      files.push(filePath);
    }
  }
  return files;
}

function assertNoUncheckedArtifacts(root) {
  const findings = [];
  for (const filePath of walkFiles(root)) {
    const relativePath = path.relative(root, filePath);
    if (allowedArtifactFiles.has(relativePath)) continue;
    if (checkedArtifactExtensions.has(path.extname(filePath).toLowerCase())) {
      findings.push(relativePath);
    }
  }

  if (findings.length > 0) {
    throw new Error(
      `Unchecked public artifact files found. Add only reviewed synthetic assets through an explicit allowlist:\n${findings.join("\n")}`
    );
  }
}

function walkFiles(root) {
  const files = [];
  for (const name of readdirSync(root)) {
    if (ignoredDirectories.has(name)) continue;
    const filePath = path.join(root, name);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      files.push(...walkFiles(filePath));
    } else {
      files.push(filePath);
    }
  }
  return files;
}
