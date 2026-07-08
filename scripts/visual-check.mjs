#!/usr/bin/env node
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { pages } from "../src/site-data.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");
const artifactDir = path.join(root, "test-results", "public-visual");
mkdirSync(artifactDir, { recursive: true });

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const filePath = resolveDistPath(url.pathname);
  try {
    const body = readFileSync(filePath);
    response.writeHead(200, { "content-type": contentType(filePath) });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch(browserLaunchOptions());
const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 }
];
const findings = [];
const summary = [];

try {
  for (const pageDef of pages) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      await page.goto(`${baseUrl}${pageDef.urlPath}`, { waitUntil: "networkidle" });
      const metrics = await collectMetrics(page, pageDef.heading);
      await page.screenshot({
        path: path.join(artifactDir, `${pageDef.slug}-${viewport.name}.png`),
        fullPage: true
      });
      summary.push({ page: pageDef.urlPath, viewport: viewport.name, ...metrics });
      for (const issue of metrics.issues) {
        findings.push(`${pageDef.urlPath} ${viewport.name}: ${issue}`);
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

writeSummary(summary);

if (findings.length > 0) {
  throw new Error(`Visual findings:\n${findings.join("\n")}`);
}

console.log(`Visual check passed for ${pages.length} pages across ${viewports.length} viewports`);

function resolveDistPath(urlPath) {
  const safePath = urlPath.replace(/^\/+/, "");
  const candidate = path.join(dist, safePath);
  if (urlPath === "/" || statIsDirectory(candidate)) {
    return path.join(candidate, "index.html");
  }
  return candidate;
}

function statIsDirectory(filePath) {
  try {
    return statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function contentType(filePath) {
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".xml")) return "application/xml; charset=utf-8";
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "text/html; charset=utf-8";
}

function browserLaunchOptions() {
  const executablePath = [
    process.env.PUBLIC_CHROMIUM_EXECUTABLE,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Users/tapishkhandelwal/Library/Caches/ms-playwright/chromium_headless_shell-1193/chrome-mac/headless_shell"
  ].find((candidate) => candidate && existsSync(candidate));

  return executablePath ? { executablePath } : {};
}

async function collectMetrics(page, expectedHeading) {
  return page.evaluate((heading) => {
    const issues = [];
    const main = document.querySelector("main");
    if (!main) issues.push("missing main landmark");
    const h1 = document.querySelector("h1");
    if (!h1 || !h1.textContent?.includes(heading)) issues.push("missing expected h1");
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push(`horizontal overflow ${document.documentElement.scrollWidth}px > ${window.innerWidth}px`);
    }
    const firstViewportText = document.body.innerText.slice(0, 900);
    if (!/ComplyEaze|public|trust|surface/i.test(firstViewportText)) {
      issues.push("first viewport lacks public ComplyEaze signal");
    }
    const unnamedLinks = [...document.querySelectorAll("a")].filter(
      (link) => !(link.textContent ?? "").trim() && !link.getAttribute("aria-label"),
    );
    if (unnamedLinks.length > 0) issues.push(`${unnamedLinks.length} unnamed links`);
    const smallTargets = [...document.querySelectorAll("a, button")].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 36 || rect.height < 36);
    });
    if (smallTargets.length > 0) issues.push(`${smallTargets.length} small interactive targets`);
    const hero = document.querySelector(".hero");
    const heroRect = hero?.getBoundingClientRect();
    if (!heroRect || heroRect.height < 360) issues.push("hero area is too shallow for visual review");

    return {
      title: document.title,
      bodyTextLength: document.body.innerText.length,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      issues
    };
  }, expectedHeading);
}

function writeSummary(summary) {
  const jsonPath = path.join(artifactDir, "summary.json");
  const markdownPath = path.join(artifactDir, "summary.md");
  const rows = summary
    .map(
      (item) =>
        `| ${item.page} | ${item.viewport} | ${item.scrollWidth}/${item.viewportWidth} | ${item.issues.length} |`,
    )
    .join("\n");
  mkdirSync(path.dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  writeFileSync(
    markdownPath,
    `# Public Visual Check\n\n| Page | Viewport | Scroll/Viewport | Issues |\n| --- | --- | --- | --- |\n${rows}\n`,
    "utf8",
  );
}
