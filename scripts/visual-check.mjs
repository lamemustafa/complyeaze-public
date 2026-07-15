#!/usr/bin/env node
import { createServer } from "node:http";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { pages } from "../src/site-data.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");
const astroApps = [
  {
    slug: "astro-complyeaze-foundation",
    serverKey: "complyeaze",
    urlPath: "/",
    publicPath: "https://complyeaze.com/",
    heading: "ComplyEaze Astro workspace foundation",
    profile: "foundation",
    signalTerms: ["ComplyEaze"],
  },
  {
    slug: "astro-axal-foundation",
    serverKey: "axal",
    urlPath: "/",
    publicPath: "https://axal.complyeaze.com/",
    heading: "Axal Astro workspace foundation",
    profile: "foundation",
    signalTerms: ["Axal"],
  },
  {
    slug: "astro-pack-foundation",
    serverKey: "pack",
    urlPath: "/",
    publicPath: "https://pack.complyeaze.com/",
    heading: "Pack Astro workspace foundation",
    profile: "foundation",
    signalTerms: ["Pack"],
  },
];
const visualTargets = [
  ...pages.map((page) => ({
    ...page,
    serverKey: "legacy",
    publicPath: page.urlPath,
    profile: "legacy",
    signalTerms: ["ComplyEaze", "public", "trust", "surface"],
  })),
  ...astroApps,
];
const visualRoots = new Map([
  ["legacy", dist],
  ["complyeaze", path.join(root, "apps", "complyeaze", "dist")],
  ["axal", path.join(root, "apps", "axal", "dist")],
  ["pack", path.join(root, "apps", "pack", "dist")],
]);
const artifactDir = path.join(root, "test-results", "public-visual");
rmSync(artifactDir, { recursive: true, force: true });
mkdirSync(artifactDir, { recursive: true });
writeIncompleteSummary();

const servers = new Map();
const baseUrls = new Map();
for (const [key, distRoot] of visualRoots) {
  const server = createStaticServer(distRoot);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  servers.set(key, server);
  baseUrls.set(key, `http://127.0.0.1:${server.address().port}`);
}
const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 }
];
const findings = [];
const summary = [];
let browser;

try {
  browser = await chromium.launch(browserLaunchOptions());
  for (const pageDef of visualTargets) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ reducedMotion: "reduce", viewport });
      const page = await context.newPage();
      await page.goto(`${baseUrls.get(pageDef.serverKey)}${pageDef.urlPath}`, { waitUntil: "networkidle" });
      const metrics = await collectMetrics(
        page,
        pageDef.heading,
        pageDef.profile,
        pageDef.signalTerms,
      );
      const screenshot = `${pageDef.slug}-${viewport.name}.png`;
      await page.evaluate(() => document.activeElement?.blur());
      await page.screenshot({
        path: path.join(artifactDir, screenshot),
        fullPage: true
      });
      summary.push({ page: pageDef.publicPath, slug: pageDef.slug, viewport: viewport.name, screenshot, ...metrics });
      for (const issue of metrics.issues) {
        findings.push(`${pageDef.urlPath} ${viewport.name}: ${issue}`);
      }
      await context.close();
    }
  }
} finally {
  await browser?.close();
  await Promise.all(
    [...servers.values()].map(
      (server) => new Promise((resolve) => server.close(resolve)),
    ),
  );
}

writeSummary(summary);
assertVisualArtifacts(summary);

if (findings.length > 0) {
  throw new Error(`Visual findings:\n${findings.join("\n")}`);
}

console.log(`Visual check passed for ${visualTargets.length} pages across ${viewports.length} viewports`);

function createStaticServer(distRoot) {
  return createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const filePath = resolveDistPath(distRoot, url.pathname);
    try {
      const body = readFileSync(filePath);
      response.writeHead(200, { "content-type": contentType(filePath) });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Not found");
    }
  });
}

function resolveDistPath(distRoot, urlPath) {
  const safePath = urlPath.replace(/^\/+/, "");
  const candidate = resolveWithin(distRoot, safePath);
  if (urlPath === "/" || statIsDirectory(candidate)) {
    return path.join(candidate, "index.html");
  }
  return candidate;
}

function resolveWithin(rootPath, relativePath) {
  const resolvedRoot = path.resolve(rootPath);
  const candidate = path.resolve(resolvedRoot, relativePath);
  if (candidate !== resolvedRoot && !candidate.startsWith(`${resolvedRoot}${path.sep}`)) {
    return path.join(resolvedRoot, "__not-found__");
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
  const homeChromiumShell = path.join(
    os.homedir(),
    "Library",
    "Caches",
    "ms-playwright",
    "chromium_headless_shell-1193",
    "chrome-mac",
    "headless_shell"
  );
  const executablePath = [
    process.env.PUBLIC_CHROMIUM_EXECUTABLE,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    homeChromiumShell
  ].find((candidate) => candidate && existsSync(candidate));

  return executablePath ? { executablePath } : {};
}

async function collectMetrics(page, expectedHeading, profile, signalTerms) {
  const metrics = await page.evaluate(({ heading, profile, signalTerms }) => {
    function hasReducedMotionRule() {
      for (const sheet of document.styleSheets) {
        if (hasReducedMotionRuleInList(sheet.cssRules)) return true;
      }
      return false;
    }

    function hasReducedMotionRuleInList(rules) {
      for (const rule of rules ?? []) {
        if (rule.conditionText?.includes("prefers-reduced-motion")) return true;
        if (hasReducedMotionRuleInList(rule.cssRules)) return true;
      }
      return false;
    }

    function controlLabel(element) {
      return [element.tagName.toLowerCase(), element.getAttribute("href") ?? element.getAttribute("aria-label") ?? element.textContent?.trim()]
        .filter(Boolean)
        .join(" ")
        .slice(0, 80);
    }

    function visibleInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
    }

    function clippedByOverflowAncestor(element) {
      const rect = element.getBoundingClientRect();
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        const clipsOverflow = /(hidden|clip|auto|scroll)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`);
        if (clipsOverflow) {
          const parentRect = parent.getBoundingClientRect();
          if (parentRect.width > 0 && parentRect.height > 0 && (rect.left < parentRect.left - 1 || rect.right > parentRect.right + 1 || rect.top < parentRect.top - 1 || rect.bottom > parentRect.bottom + 1)) {
            return true;
          }
        }
        parent = parent.parentElement;
      }
      return false;
    }

    function hitTestPasses(element) {
      const points = [...element.getClientRects()].flatMap((lineRect) => {
        if (lineRect.width === 0 || lineRect.height === 0 || lineRect.bottom < 0 || lineRect.top > window.innerHeight) {
          return [];
        }
        const insetX = Math.min(8, lineRect.width / 4);
        const insetY = Math.min(8, lineRect.height / 4);
        const xs = [lineRect.left + insetX, lineRect.left + lineRect.width / 2, lineRect.right - insetX];
        const ys = [lineRect.top + insetY, lineRect.top + lineRect.height / 2, lineRect.bottom - insetY];
        return xs.flatMap((x) => ys.map((y) => [x, y]));
      });
      return points.some(([x, y]) => {
        const target = document.elementFromPoint(x, y);
        return target && (target === element || element.contains(target) || target.contains(element));
      });
    }

    function durationSeconds(value) {
      return value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => (part.endsWith("ms") ? Number.parseFloat(part) / 1000 : Number.parseFloat(part)))
        .filter((duration) => Number.isFinite(duration));
    }

    const issues = [];
    const mainLandmarks = [...document.querySelectorAll("main")];
    if (mainLandmarks.length !== 1) issues.push(`expected one main landmark, found ${mainLandmarks.length}`);
    const h1 = document.querySelector("h1");
    if (!h1 || !h1.textContent?.includes(heading)) issues.push("missing expected h1");
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push(`horizontal overflow ${document.documentElement.scrollWidth}px > ${window.innerWidth}px`);
    }
    const firstViewportText = document.body.innerText.slice(0, 900);
    const lowerViewportText = firstViewportText.toLowerCase();
    if (!signalTerms.some((term) => lowerViewportText.includes(term.toLowerCase()))) {
      issues.push("first viewport lacks expected product signal");
    }
    const unnamedLinks = [...document.querySelectorAll("a")].filter(
      (link) => !(link.textContent ?? "").trim() && !link.getAttribute("aria-label"),
    );
    if (unnamedLinks.length > 0) issues.push(`${unnamedLinks.length} unnamed links`);
    const unnamedButtons = [...document.querySelectorAll("button")].filter(
      (button) => !(button.textContent ?? "").trim() && !button.getAttribute("aria-label"),
    );
    if (unnamedButtons.length > 0) issues.push(`${unnamedButtons.length} unnamed buttons`);
    const brokenImages = [...document.querySelectorAll("img")].filter((image) => {
      if (!image.complete) return image.loading !== "lazy";
      return image.naturalWidth === 0;
    });
    if (brokenImages.length > 0) issues.push(`${brokenImages.length} broken images`);
    const blankBlocks = [...document.querySelectorAll("main section, main article")].filter((element) => {
      const rect = element.getBoundingClientRect();
      const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
      return rect.width > 0 && rect.height > 0 && text.length < 8 && element.querySelectorAll("img, svg").length === 0;
    });
    if (blankBlocks.length > 0) issues.push(`${blankBlocks.length} blank content blocks`);
    const smallTargets = [...document.querySelectorAll("a, button")].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 36 || rect.height < 36);
    });
    if (smallTargets.length > 0) issues.push(`${smallTargets.length} small interactive targets`);
    const clippedControls = [...document.querySelectorAll("a, button")].filter((element) => {
      const rect = element.getBoundingClientRect();
      return visibleInViewport(element) && (rect.left < -1 || rect.right > window.innerWidth + 1 || rect.top < -1 || clippedByOverflowAncestor(element));
    });
    if (clippedControls.length > 0) issues.push(`${clippedControls.length} clipped controls`);
    const overlappedControls = [...document.querySelectorAll("a, button")].filter((element) => {
      return visibleInViewport(element) && !hitTestPasses(element);
    });
    if (overlappedControls.length > 0) {
      const labels = overlappedControls.map((element) => controlLabel(element)).join(", ");
      issues.push(`${overlappedControls.length} overlapped first-viewport controls: ${labels}`);
    }
    const overlappedContent = [...document.querySelectorAll("main h1, main h2, main h3, main article")].filter((element) => {
      return visibleInViewport(element) && !hitTestPasses(element);
    });
    if (overlappedContent.length > 0) {
      const labels = overlappedContent.map((element) => controlLabel(element)).join(", ");
      issues.push(`${overlappedContent.length} overlapped first-viewport content blocks: ${labels}`);
    }
    const hero = document.querySelector(".hero");
    const heroRect = hero?.getBoundingClientRect();
    if (profile === "legacy" && (!heroRect || heroRect.height < 360)) {
      issues.push("hero area is too shallow for visual review");
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      issues.push("reduced-motion media emulation is not active");
    }
    if (profile === "legacy" && !hasReducedMotionRule()) {
      issues.push("missing prefers-reduced-motion stylesheet rule");
    }
    const activeMotionElements = [...document.querySelectorAll("body *")].filter((element) => {
      const style = window.getComputedStyle(element);
      const animationDurations = durationSeconds(style.animationDuration);
      const transitionDurations = durationSeconds(style.transitionDuration);
      return [...animationDurations, ...transitionDurations].some((duration) => duration > 0);
    });
    if (activeMotionElements.length > 0) {
      issues.push(`${activeMotionElements.length} active motion styles under reduced-motion`);
    }

    return {
      title: document.title,
      bodyTextLength: document.body.innerText.length,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      mainLandmarkCount: mainLandmarks.length,
      namedLinks: document.querySelectorAll("a").length - unnamedLinks.length,
      namedButtons: document.querySelectorAll("button").length - unnamedButtons.length,
      unnamedLinks: unnamedLinks.length,
      unnamedButtons: unnamedButtons.length,
      smallTargets: smallTargets.length,
      brokenImages: brokenImages.length,
      blankBlocks: blankBlocks.length,
      clippedControls: clippedControls.length,
      overlappedControls: overlappedControls.length,
      overlappedContent: overlappedContent.length,
      activeMotionElements: activeMotionElements.length,
      issues
    };
  }, { heading: expectedHeading, profile, signalTerms });
  const focusStates = [];
  if (profile === "legacy") {
    for (let index = 0; index < 16; index += 1) {
      await page.keyboard.press("Tab");
      const focusState = await page.evaluate(() => {
      function focusLabel(element) {
        return [element.tagName.toLowerCase(), element.getAttribute("href") ?? element.getAttribute("aria-label") ?? element.textContent?.trim()]
          .filter(Boolean)
          .join(" ")
          .slice(0, 80);
      }

      function isVisibleFocus(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
        const hasOutline = style.outlineStyle !== "none" && outlineWidth >= 2;
        const hasShadow = style.boxShadow !== "none";
        return rect.width > 0 && rect.height > 0 && (hasOutline || hasShadow);
      }

      const element = document.activeElement;
      if (!element || element === document.body) {
        return { label: "body", visible: false };
      }
      return {
        label: focusLabel(element),
        visible: isVisibleFocus(element)
      };
      });
      if (focusStates.some((state) => state.label === focusState.label)) {
        break;
      }
      focusStates.push(focusState);
    }
    const invisibleFocusStates = focusStates.filter((state) => !state.visible);
    if (invisibleFocusStates.length > 0) {
      metrics.issues.push(`focused controls lack visible focus indicators: ${invisibleFocusStates.map((state) => state.label).join(", ")}`);
    }
    if (focusStates.length < 2) {
      metrics.issues.push("keyboard focus check did not reach controls beyond the skip link");
    }
  }
  return { ...metrics, focusTargets: focusStates.map((state) => state.label), focusTarget: focusStates[0]?.label ?? "none" };
}

function writeSummary(summary) {
  const jsonPath = path.join(artifactDir, "summary.json");
  const markdownPath = path.join(artifactDir, "summary.md");
  const rows = summary
    .map(
      (item) =>
        `| ${[
          item.page,
          item.viewport,
          item.screenshot,
          `${item.scrollWidth}/${item.viewportWidth}`,
          item.reducedMotion ? "yes" : "no",
          item.mainLandmarkCount,
          `${item.namedLinks}/${item.unnamedLinks}`,
          `${item.namedButtons}/${item.unnamedButtons}`,
          item.smallTargets,
          item.brokenImages,
          item.blankBlocks,
          item.clippedControls,
          item.overlappedControls + item.overlappedContent,
          item.focusTargets.join("; "),
          item.issues.length === 0 ? "pass" : "fix required",
          item.issues.join("; ") || "none"
        ].map(markdownCell).join(" | ")} |`,
    )
    .join("\n");
  mkdirSync(path.dirname(jsonPath), { recursive: true });
  const markdown = `# Public Visual Check\n\n| Page | Viewport | Screenshot | Scroll/Viewport | Reduced Motion | Main Landmarks | Named/Unnamed Links | Named/Unnamed Buttons | Small Targets | Broken Images | Blank Blocks | Clipped Controls | Overlap Findings | Focus Targets | Disposition | Failures |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${rows}\n`;
  assertVisualSummarySchema(summary, markdown);
  writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  writeFileSync(markdownPath, markdown, "utf8");
}

function writeIncompleteSummary() {
  writeFileSync(path.join(artifactDir, "summary.json"), "[]\n", "utf8");
  writeFileSync(
    path.join(artifactDir, "summary.md"),
    "# Public Visual Check\n\nDisposition: incomplete. The visual run did not finish generating screenshots and metrics.\n",
    "utf8",
  );
}

function markdownCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function assertVisualArtifacts(summary) {
  const expectedScreenshots = visualTargets.flatMap((pageDef) => viewports.map((viewport) => `${pageDef.slug}-${viewport.name}.png`)).sort();
  const actualScreenshots = readdirSync(artifactDir).filter((file) => file.endsWith(".png")).sort();
  assertArrayEqual("visual screenshots", actualScreenshots, expectedScreenshots);

  const expectedEntries = visualTargets.length * viewports.length;
  if (summary.length !== expectedEntries) {
    throw new Error(`Visual summary entry count mismatch: expected ${expectedEntries}, got ${summary.length}`);
  }
  for (const fileName of ["summary.json", "summary.md"]) {
    if (!existsSync(path.join(artifactDir, fileName))) {
      throw new Error(`Missing visual evidence file: ${fileName}`);
    }
  }
}

function assertVisualSummarySchema(summary, markdown) {
  const requiredFields = [
    "page",
    "viewport",
    "screenshot",
    "scrollWidth",
    "viewportWidth",
    "reducedMotion",
    "mainLandmarkCount",
    "namedLinks",
    "unnamedLinks",
    "namedButtons",
    "unnamedButtons",
    "smallTargets",
    "brokenImages",
    "blankBlocks",
    "clippedControls",
    "overlappedControls",
    "overlappedContent",
    "focusTargets",
    "issues"
  ];
  const missing = [];
  for (const [index, item] of summary.entries()) {
    for (const field of requiredFields) {
      if (!(field in item)) missing.push(`summary[${index}].${field}`);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Visual summary schema findings:\n${missing.join("\n")}`);
  }
  for (const heading of ["Disposition", "Failures", "Named/Unnamed Links", "Named/Unnamed Buttons"]) {
    if (!markdown.includes(heading)) {
      throw new Error(`Visual summary markdown missing column: ${heading}`);
    }
  }
}

function assertArrayEqual(label, actual, expected) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${label} mismatch:\nexpected ${expectedJson}\nactual   ${actualJson}`);
  }
}
