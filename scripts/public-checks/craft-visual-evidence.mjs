import { gzipSync } from "node:zlib";
import AxeBuilder from "@axe-core/playwright";

const craftAssetResourceTypes = new Set(["script", "stylesheet", "font"]);

export function isCraftAssetResource(craftReview, resourceType) {
  return craftReview && craftAssetResourceTypes.has(resourceType);
}

export function craftAssetResponseIssue({ craftReview, ok, resourceType, status, url }) {
  if (!isCraftAssetResource(craftReview, resourceType) || ok) return null;
  return `${resourceType} request returned ${status}: ${url}`;
}

export function craftAssetRequestFailureIssue({
  craftReview,
  errorText,
  resourceType,
  url,
}) {
  if (!isCraftAssetResource(craftReview, resourceType)) return null;
  return `${resourceType} request failed (${errorText || "unknown network error"}): ${url}`;
}

export function calculateCraftCssGzipBytes(transferredAssets, inlineStyleTexts) {
  const transferredBytes = transferredAssets
    .filter(({ type }) => type === "stylesheet")
    .reduce((total, asset) => total + gzipSync(asset.body).byteLength, 0);
  const inlineBytes = inlineStyleTexts.length > 0
    ? gzipSync(Buffer.from(inlineStyleTexts.join("\n"))).byteLength
    : 0;
  return transferredBytes + inlineBytes;
}

export function calculateAuthoredJavaScriptBytes(
  transferredAssets,
  inlineScriptTexts,
  inlineEventHandlerTexts,
) {
  const transferredBytes = transferredAssets
    .filter(({ type }) => type === "script")
    .reduce((total, asset) => total + asset.body.byteLength, 0);
  const inlineBytes = [...inlineScriptTexts, ...inlineEventHandlerTexts]
    .reduce((total, source) => total + Buffer.byteLength(source), 0);
  return transferredBytes + inlineBytes;
}

export async function collectCraftVisualEvidence(page, transferredAssets) {
  const issues = [];
  const axeResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const blockingAxe = axeResults.violations.filter(
    ({ impact }) => impact === "critical" || impact === "serious",
  );
  if (blockingAxe.length > 0) {
    const evidence = blockingAxe.map(({ id, nodes }) =>
      `${id}(${nodes.map((node) => node.target.join(" ")).join(";")})`,
    );
    issues.push(`axe critical/serious: ${evidence.join(", ")}`);
  }

  const inlineScriptTexts = await page.locator("script:not([src])").allTextContents();
  const inlineEventHandlerTexts = await page.evaluate(() =>
    [...document.querySelectorAll("*")].flatMap((element) =>
      [...element.attributes]
        .filter((attribute) => attribute.name.toLowerCase().startsWith("on"))
        .map((attribute) => attribute.value),
    ),
  );
  const authoredJavaScriptBytes = calculateAuthoredJavaScriptBytes(
    transferredAssets,
    inlineScriptTexts,
    inlineEventHandlerTexts,
  );
  const inlineStyleTexts = await page.locator("style").allTextContents();
  const cssGzipBytes = calculateCraftCssGzipBytes(transferredAssets, inlineStyleTexts);
  const criticalFonts = new Set(
    transferredAssets.filter(({ type }) => type === "font").map(({ url }) => url),
  ).size;
  const remoteFonts = transferredAssets.filter(
    ({ type, url }) => type === "font" && new URL(url).hostname !== "127.0.0.1",
  );
  const cls = await page.evaluate(() =>
    (window.__craftLayoutShifts ?? []).reduce((total, value) => total + value, 0),
  );
  if (authoredJavaScriptBytes !== 0) issues.push(`authored JavaScript is ${authoredJavaScriptBytes} bytes`);
  if (cssGzipBytes > 61440) issues.push(`CSS is ${cssGzipBytes} gzip bytes, above 61440`);
  if (criticalFonts > 2) issues.push(`${criticalFonts} critical fonts, above 2`);
  if (remoteFonts.length > 0) issues.push(`${remoteFonts.length} remote font requests`);
  if (cls > 0.05) issues.push(`CLS ${cls.toFixed(4)} exceeds 0.05`);

  const readability = await page.evaluate(() => {
    const collapsedText = [...document.querySelectorAll("main h1, main h2, main h3, main p, main strong")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return (element.textContent?.trim().length ?? 0) > 0 && (rect.width < 1 || rect.height < 1);
      })
      .map((element) => element.textContent?.trim().slice(0, 48));
    const crampedParagraphs = [...document.querySelectorAll("main p")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const fontSize = Number.parseFloat(window.getComputedStyle(element).fontSize);
        return (element.textContent?.trim().length ?? 0) >= 60 && rect.width < fontSize * 8;
      })
      .map((element) => element.textContent?.trim().slice(0, 48));
    const joinedLabels = [...document.querySelectorAll("main span")]
      .filter((label) => {
        const value = label.nextElementSibling;
        if (!value) return false;
        const labelRect = label.getBoundingClientRect();
        const valueRect = value.getBoundingClientRect();
        return Math.abs(labelRect.top - valueRect.top) < 2 && valueRect.left - labelRect.right < 4;
      })
      .map((element) => element.textContent?.trim().slice(0, 48));
    return { collapsedText, crampedParagraphs, joinedLabels };
  });
  if (readability.collapsedText.length > 0) {
    issues.push(`collapsed visible text: ${readability.collapsedText.join(", ")}`);
  }
  if (readability.crampedParagraphs.length > 0) {
    issues.push(`cramped long-form text: ${readability.crampedParagraphs.join(", ")}`);
  }
  if (readability.joinedLabels.length > 0) {
    issues.push(`labels visually join adjacent values: ${readability.joinedLabels.join(", ")}`);
  }

  const disclosure = page.locator("details").first();
  let nativeDisclosure = "not-applicable";
  let nativeDisclosureRestored = "not-applicable";
  if (await disclosure.count()) {
    const initiallyOpen = await disclosure.evaluate((element) => element.open);
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Enter");
    const toggledOpen = await disclosure.evaluate((element) => element.open);
    nativeDisclosure = toggledOpen !== initiallyOpen ? "pass" : "fail";
    if (nativeDisclosure === "fail") issues.push("native disclosure did not toggle from the keyboard");
    await page.keyboard.press("Enter");
    const restoredOpen = await disclosure.evaluate((element) => element.open);
    nativeDisclosureRestored = restoredOpen === initiallyOpen ? "pass" : "fail";
    if (nativeDisclosureRestored === "fail") {
      issues.push("native disclosure did not return to its initial state");
    }
  }

  await page.emulateMedia({ forcedColors: "active" });
  await page.locator("main a").first().focus();
  const forcedColors = await page.evaluate(() => ({
    active: window.matchMedia("(forced-colors: active)").matches,
    focusable: document.querySelectorAll("a, summary, button").length,
    visibleFocus: (() => {
      const style = window.getComputedStyle(document.activeElement);
      return style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 2;
    })(),
  }));
  if (!forcedColors.active || forcedColors.focusable === 0 || !forcedColors.visibleFocus) {
    issues.push("forced-colors focus evidence is incomplete");
  }
  await page.emulateMedia({ forcedColors: "none" });

  return {
    authoredJavaScriptBytes,
    axeBlockingViolations: blockingAxe.length,
    axeViolations: axeResults.violations.length,
    cls: Number(cls.toFixed(4)),
    criticalFonts,
    cssGzipBytes,
    forcedColors: forcedColors.active,
    nativeDisclosure,
    nativeDisclosureRestored,
    readability,
    issues,
  };
}
