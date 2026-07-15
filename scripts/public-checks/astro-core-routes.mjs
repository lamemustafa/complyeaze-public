import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";
import { canonicalUrl } from "../../packages/public-shell/src/metadata.ts";

const manifestPath = "packages/public-content/src/complyeaze.routes.json";
const requiredSourceFiles = [
  "src/customer-route-data.mjs",
  "src/evidence-route-data.mjs",
  "src/migration.css",
  "src/products.css",
  "src/render-evidence.mjs",
  "src/render-migration.mjs",
  "src/styles.css",
  "scripts/visual-check.mjs",
  "packages/public-content/src/schema.ts",
  "packages/public-shell/src/metadata.ts",
  "apps/complyeaze/src/components/PublicEvidencePage.astro",
  "apps/complyeaze/src/components/PublicHomePage.astro",
  "apps/complyeaze/src/components/PublicMigrationLedger.astro",
  "apps/complyeaze/src/components/PublicMigrationPage.astro",
  "apps/complyeaze/src/components/PublicPolicyPage.astro",
  "apps/complyeaze/src/components/PublicProductsPage.astro",
  "apps/complyeaze/src/components/PublicResourcePage.astro",
  "apps/complyeaze/src/layouts/PublicPageLayout.astro",
  "apps/complyeaze/src/pages/[...slug].astro",
  "apps/complyeaze/src/pages/index.astro",
];
const requiredRoutes = [
  "/",
  "/products/",
  "/trust/",
  "/docs/",
  "/migration/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
  "/status/",
  "/changelog/",
  "/release-evidence/",
];

export function assertAstroCoreRouteSources(root) {
  const findings = [];
  const requiredFiles = [manifestPath, ...requiredSourceFiles];
  const missingFiles = requiredFiles.filter((filePath) => !existsSync(path.join(root, filePath)));
  for (const filePath of missingFiles) {
    findings.push(`${filePath}: missing`);
  }
  const manifest = readManifest(root, findings);
  if (manifest) validateManifest(manifest, findings);
  if (missingFiles.length === 0) {
    assertAstroCustomerRouteSources(root, findings);
    assertLegacyCustomerRouteSources(root, findings);
    assertLegacyEvidenceStyles(root, findings);
  }
  if (findings.length > 0) {
    throw new Error(`Astro core-route source findings:\n${findings.join("\n")}`);
  }
}

function assertAstroCustomerRouteSources(root, findings) {
  const visualCheck = readFileSync(path.join(root, "scripts", "visual-check.mjs"), "utf8");
  const homePage = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "components", "PublicHomePage.astro"),
    "utf8",
  );
  const productsPage = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "components", "PublicProductsPage.astro"),
    "utf8",
  );
  const indexPage = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "pages", "index.astro"),
    "utf8",
  );
  const catchAllPage = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "pages", "[...slug].astro"),
    "utf8",
  );
  const layout = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "layouts", "PublicPageLayout.astro"),
    "utf8",
  );

  if (!indexPage.includes("definePublicRouteManifest") || !indexPage.includes("PublicHomePage")) {
    findings.push("apps/complyeaze/src/pages/index.astro: root must render the canonical home route");
  }
  if (/workspace foundation|does not serve customer routes/i.test(indexPage)) {
    findings.push("apps/complyeaze/src/pages/index.astro: obsolete foundation copy remains");
  }
  if (!catchAllPage.includes('route.kind !== "home"')) {
    findings.push("apps/complyeaze/src/pages/[...slug].astro: catch-all must exclude the home route");
  }
  for (const kind of ["resource", "policy", "evidence", "home", "products", "migration"]) {
    const routeBranch = `route.kind === "${kind}"`;
    if (kind !== "home" && !catchAllPage.includes(routeBranch)) {
      findings.push(`apps/complyeaze/src/pages/[...slug].astro: missing explicit ${kind} branch`);
    }
  }
  if (!catchAllPage.includes("assertNever(route)")) {
    findings.push("apps/complyeaze/src/pages/[...slug].astro: route rendering is not exhaustive");
  }
  if (!homePage.includes('class="actions"') || !homePage.includes("route.primaryAction")) {
    findings.push("PublicHomePage.astro: customer actions are missing");
  }
  if (!productsPage.includes('class="product-family"') || !productsPage.includes("<dl>")) {
    findings.push("PublicProductsPage.astro: semantic product comparison is missing");
  }
  if (!productsPage.includes("product.evidence.href") || !productsPage.includes("product.evidence.label")) {
    findings.push("PublicProductsPage.astro: public product evidence links are missing");
  }
  if (!layout.includes('aria-label="Primary navigation"')) {
    findings.push("PublicPageLayout.astro: customer primary navigation is missing");
  }
  if (!/header nav a\s*\{[^}]*min-width:\s*44px/s.test(layout)) {
    findings.push("PublicPageLayout.astro: primary navigation targets need 44px minimum width");
  }
  for (const href of ["/products/", "/about/", "/trust/"]) {
    if (!layout.includes(`href: "${href}"`)) {
      findings.push(`PublicPageLayout.astro: primary navigation is missing ${href}`);
    }
  }
  if (/Public migration preview|href="\/(?:migration|status|docs)\/"/.test(layout)) {
    findings.push("PublicPageLayout.astro: customer shell exposes internal methodology navigation");
  }
  if (!layout.includes("Sanchika — inspect the design evidence.")) {
    findings.push("PublicPageLayout.astro: restrained Sanchika colophon is missing");
  }
  if (layout.includes("Built with Sanchika")) {
    findings.push("PublicPageLayout.astro: colophon claims Sanchika adoption before P2");
  }
  if (visualCheck.includes("astro-complyeaze-foundation")) {
    findings.push("scripts/visual-check.mjs: obsolete ComplyEaze foundation target remains");
  }
  if (
    !visualCheck.includes("const expectedVisualTargetCount = 34") ||
    !visualCheck.includes("visualTargets.length !== expectedVisualTargetCount")
  ) {
    findings.push("scripts/visual-check.mjs: expected 34-page visual inventory is not enforced");
  }
}

function assertLegacyCustomerRouteSources(root, findings) {
  const customerData = readFileSync(path.join(root, "src", "customer-route-data.mjs"), "utf8");
  const siteData = readFileSync(path.join(root, "src", "site-data.mjs"), "utf8");
  const productData = readFileSync(path.join(root, "src", "product-data.mjs"), "utf8");
  const renderer = readFileSync(path.join(root, "src", "render-site.mjs"), "utf8");

  if (!customerData.includes("definePublicRouteManifest")) {
    findings.push("src/customer-route-data.mjs: customer routes must adapt the typed manifest");
  }
  if (!siteData.includes('from "./customer-route-data.mjs"') || siteData.includes("const corePages")) {
    findings.push("src/site-data.mjs: core pages must come from the canonical customer adapter");
  }
  if (/ComplyEaze Public|label: "(?:Migration|Status|Docs)"/.test(siteData)) {
    findings.push("src/site-data.mjs: primary customer shell exposes internal navigation or branding");
  }
  if (!productData.includes('from "./customer-route-data.mjs"')) {
    findings.push("src/product-data.mjs: product data must come from the canonical customer adapter");
  }
  if (/export const products\s*=\s*\[|migrationRoutes|proofLedger/.test(productData)) {
    findings.push("src/product-data.mjs: duplicated customer or migration data remains");
  }
  if (/Public migration inventory|migrationRoutes|proofLedger/.test(renderer)) {
    findings.push("src/render-site.mjs: customer product page exposes internal migration methodology");
  }
  if (!renderer.includes("product.evidence.href") || !renderer.includes("product.evidence.label")) {
    findings.push("src/render-site.mjs: customer product evidence links are not rendered");
  }
  if (
    !renderer.includes('page.type === "customerProducts"') ||
    renderer.includes('page.slug === "products"')
  ) {
    findings.push("src/render-site.mjs: customer products must dispatch by semantic route type");
  }
}

function assertLegacyEvidenceStyles(root, findings) {
  const visualCheck = readFileSync(path.join(root, "scripts", "visual-check.mjs"), "utf8");
  if (!visualCheck.includes('identity: [...document.querySelectorAll("*")].indexOf(element)')) {
    findings.push("scripts/visual-check.mjs: focus traversal needs stable DOM-element identities");
  }
  if (!visualCheck.includes("state.identity === focusState.identity")) {
    findings.push("scripts/visual-check.mjs: focus cycles must not be detected from repeated labels");
  }
  if (visualCheck.includes("state.label === focusState.label")) {
    findings.push("scripts/visual-check.mjs: repeated focus labels must not terminate traversal");
  }
  const styles = readFileSync(path.join(root, "src", "styles.css"), "utf8");
  if (!/\.evidence-sources\s+a\s*\{[^}]*min-height:\s*44px/s.test(styles)) {
    findings.push("src/styles.css: legacy evidence links need a 44px minimum target");
  }
  const productStyles = readFileSync(path.join(root, "src", "products.css"), "utf8");
  if (!/\.product-evidence\s*\{[^}]*min-height:\s*44px/s.test(productStyles)) {
    findings.push("src/products.css: legacy product evidence links need a 44px minimum target");
  }
  const migrationStyles = readFileSync(path.join(root, "src", "migration.css"), "utf8");
  if (!/\.migration-summary\s+li\s*\{[^}]*display:\s*grid/s.test(migrationStyles)) {
    findings.push("src/migration.css: migration steps must style the semantic ordered-list items");
  }
  if (!/\.migration-summary\s*\{[^}]*counter-reset:\s*migration-step/s.test(migrationStyles)) {
    findings.push("src/migration.css: migration sequence needs visible ordered counters");
  }
  if (/\.migration-summary\s+strong\s*\{[^}]*(?:height|width):\s*2\.5rem/s.test(migrationStyles)) {
    findings.push("src/migration.css: migration step labels must not be constrained to marker size");
  }
  if (/\.route-ledger\s+thead\s*\{[^}]*display:\s*none/s.test(migrationStyles)) {
    findings.push("src/migration.css: responsive ledger must preserve table headers for assistive technology");
  }
  const legacyMigrationRenderer = readFileSync(
    path.join(root, "src", "render-migration.mjs"),
    "utf8",
  );
  if (!/class="route-ledger"\s+role="region"\s+tabindex="0"/.test(legacyMigrationRenderer)) {
    findings.push("src/render-migration.mjs: desktop ledger needs a keyboard-focusable scroll region");
  }
  if (
    !legacyMigrationRenderer.includes(
      "Nine-column route ledger; scroll horizontally when displayed as a table.",
    ) ||
    !legacyMigrationRenderer.includes('class="route-ledger-hint"') ||
    !legacyMigrationRenderer.includes("aria-describedby=")
  ) {
    findings.push("src/render-migration.mjs: desktop ledger needs a visible described scroll hint");
  }
  if (
    !legacyMigrationRenderer.includes(
      'aria-label="${escapeHtml(family)} source route cleanup evidence"',
    )
  ) {
    findings.push("src/render-migration.mjs: ledger regions need unique family-scoped names");
  }
  if (!/\.route-ledger\s*\{[^}]*overflow-x:\s*auto/s.test(migrationStyles)) {
    findings.push("src/migration.css: desktop ledger needs contained horizontal scrolling");
  }
  if (!/\.route-ledger\s+table\s*\{[^}]*min-width:\s*90rem/s.test(migrationStyles)) {
    findings.push("src/migration.css: desktop ledger table needs a readable minimum width");
  }
  if (!/\.route-ledger:focus-visible\s*\{[^}]*outline:/s.test(migrationStyles)) {
    findings.push("src/migration.css: keyboard-focused ledger needs a visible outline");
  }
  if (!/\.route-ledger-hint\s*\{[^}]*font-size:/s.test(migrationStyles)) {
    findings.push("src/migration.css: desktop ledger scroll hint needs visible styling");
  }
  if (!/@media[^]*\.route-ledger-hint\s*\{[^}]*display:\s*none/s.test(migrationStyles)) {
    findings.push("src/migration.css: stacked ledger must hide the desktop-only scroll hint");
  }
  if (!/\.migration-ledger\s*>\s*article\s*\{[^}]*min-width:\s*0/s.test(migrationStyles)) {
    findings.push("src/migration.css: migration ledger cards must allow contained table overflow");
  }
  if (!/\.route-ledger\s*\{[^}]*max-width:\s*100%/s.test(migrationStyles)) {
    findings.push("src/migration.css: desktop ledger scroll region must stay within its card");
  }
  if (!/\.route-ledger\s*\{[^}]*min-width:\s*0/s.test(migrationStyles)) {
    findings.push("src/migration.css: desktop ledger scroll region must be shrinkable");
  }
  const astroLedger = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "components", "PublicMigrationLedger.astro"),
    "utf8",
  );
  if (/thead\s*\{[^}]*display:\s*none/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: responsive ledger must preserve table headers");
  }
  if (!/class="route-ledger"\s+role="region"\s+tabindex="0"/.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: desktop ledger needs a keyboard-focusable scroll region");
  }
  if (
    !astroLedger.includes(
      "Nine-column route ledger; scroll horizontally when displayed as a table.",
    ) ||
    !astroLedger.includes('class="route-ledger-hint"') ||
    !astroLedger.includes("aria-describedby=")
  ) {
    findings.push("PublicMigrationLedger.astro: desktop ledger needs a visible described scroll hint");
  }
  if (!astroLedger.includes('aria-label={`${entry.family} source route cleanup evidence`}')) {
    findings.push("PublicMigrationLedger.astro: ledger regions need unique family-scoped names");
  }
  if (!/\.route-ledger\s*\{[^}]*overflow-x:\s*auto/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: desktop ledger needs contained horizontal scrolling");
  }
  if (!/table\s*\{[^}]*min-width:\s*90rem/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: desktop ledger table needs a readable minimum width");
  }
  if (!/\.route-ledger:focus-visible\s*\{[^}]*outline:/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: keyboard-focused ledger needs a visible outline");
  }
  if (!/\.route-ledger-hint\s*\{[^}]*font-size:/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: desktop ledger scroll hint needs visible styling");
  }
  if (!/@media[^]*\.route-ledger-hint\s*\{[^}]*display:\s*none/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: stacked ledger must hide the desktop-only scroll hint");
  }
  if (!/\.migration-ledger\s*>\s*article\s*\{[^}]*min-width:\s*0/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: migration ledger cards must allow contained table overflow");
  }
  if (!/\.route-ledger\s*\{[^}]*max-width:\s*100%/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: desktop ledger scroll region must stay within its card");
  }
  if (!/\.route-ledger\s*\{[^}]*min-width:\s*0/s.test(astroLedger)) {
    findings.push("PublicMigrationLedger.astro: desktop ledger scroll region must be shrinkable");
  }
  const astroMigrationPage = readFileSync(
    path.join(root, "apps", "complyeaze", "src", "components", "PublicMigrationPage.astro"),
    "utf8",
  );
  if (!/\.migration-steps\s*\{[^}]*counter-reset:\s*migration-step/s.test(astroMigrationPage)) {
    findings.push("PublicMigrationPage.astro: migration sequence needs visible ordered counters");
  }
}

export function assertAstroCoreRouteFixtures() {
  if (canonicalUrl("https://complyeaze.com", "/") !== "https://complyeaze.com/") {
    throw new Error("public canonical helper did not preserve the root route");
  }
  const nestedManifest = {
    app: "complyeaze",
    origin: "https://complyeaze.com",
    routes: [
      {
        description: "Nested route fixture",
        eyebrow: "Nested fixture",
        heading: "Nested route",
        kind: "resource",
        primaryAction: { href: "/", label: "Home" },
        proof: ["Nested routes remain representable."],
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        secondaryAction: { href: "https://example.com/evidence", label: "Evidence" },
        signalTerms: ["nested"],
        slug: "products/pack",
        summary: "Nested public route fixture",
        title: "Nested route fixture",
        urlPath: "/products/pack/",
      },
    ],
    schemaVersion: 1,
  };
  definePublicRouteManifest(nestedManifest);
  assertRejectedManifest(
    {
      ...nestedManifest,
      routes: [{ ...nestedManifest.routes[0], slug: "index", urlPath: "/" }],
    },
    "non-home route accepted the root path",
  );

  const homeManifest = {
    ...nestedManifest,
    routes: [
      {
        description: "Customer home fixture",
        eyebrow: "ComplyEaze product family",
        heading: "Choose the right compliance surface",
        kind: "home",
        primaryAction: { href: "/products/", label: "Explore products" },
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        secondaryAction: { href: "/trust/", label: "Review trust evidence" },
        signalTerms: ["ComplyEaze", "products"],
        slug: "index",
        summary: "Customer home fixture",
        title: "ComplyEaze",
        urlPath: "/",
      },
    ],
  };
  definePublicRouteManifest(homeManifest);
  assertRejectedManifest(
    { ...homeManifest, routes: [{ ...homeManifest.routes[0], slug: "home" }] },
    "home route accepted a non-index root slug",
  );
  assertRejectedManifest(
    { ...homeManifest, routes: [{ ...homeManifest.routes[0], urlPath: "/index/" }] },
    "home route accepted a non-root path",
  );

  const productsManifest = {
    ...nestedManifest,
    routes: [
      {
        description: "Product family fixture",
        eyebrow: "Product family",
        heading: "Choose by job and boundary",
        kind: "products",
        products: [
          {
            boundary: "Workspace-scoped operational context.",
            evidence: {
              href: "https://example.com/axal-evidence",
              label: "Review Axal evidence",
            },
            href: "https://axal.example.com/",
            job: "Coordinate compliance review work.",
            name: "Axal",
            proof: "Source-led review posture.",
            role: "Compliance review workspace",
            status: "Limited public preview",
          },
        ],
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        signalTerms: ["products", "boundary"],
        slug: "products",
        summary: "Product family fixture",
        title: "Products | ComplyEaze",
        urlPath: "/products/",
      },
    ],
  };
  definePublicRouteManifest(productsManifest);
  assertRejectedManifest(
    { ...productsManifest, routes: [{ ...productsManifest.routes[0], products: [] }] },
    "products route accepted an empty product list",
  );
  assertRejectedManifest(
    {
      ...productsManifest,
      routes: [
        {
          ...productsManifest.routes[0],
          products: [
            productsManifest.routes[0].products[0],
            {
              ...productsManifest.routes[0].products[0],
              href: "https://second.example.com/",
            },
          ],
        },
      ],
    },
    "products route accepted duplicate product names",
  );
  assertRejectedManifest(
    {
      ...productsManifest,
      routes: [
        {
          ...productsManifest.routes[0],
          products: [
            productsManifest.routes[0].products[0],
            {
              ...productsManifest.routes[0].products[0],
              name: "Pack",
            },
          ],
        },
      ],
    },
    "products route accepted duplicate product destinations",
  );
  const unsafeProductManifest = structuredClone(productsManifest);
  unsafeProductManifest.routes[0].products[0].href = "javascript:alert(1)";
  assertRejectedManifest(unsafeProductManifest, "products route accepted an unsafe destination");
  const missingEvidenceManifest = structuredClone(productsManifest);
  delete missingEvidenceManifest.routes[0].products[0].evidence;
  assertRejectedManifest(missingEvidenceManifest, "products route accepted missing evidence");
  const unsafeProductEvidenceManifest = structuredClone(productsManifest);
  unsafeProductEvidenceManifest.routes[0].products[0].evidence.href = "javascript:alert(1)";
  assertRejectedManifest(
    unsafeProductEvidenceManifest,
    "products route accepted an unsafe evidence URL",
  );
  assertRejectedManifest(
    {
      ...homeManifest,
      routes: [{ ...homeManifest.routes[0], products: productsManifest.routes[0].products }],
    },
    "home route accepted products-only fields",
  );
  assertRejectedManifest(
    {
      ...productsManifest,
      routes: [
        {
          ...productsManifest.routes[0],
          primaryAction: homeManifest.routes[0].primaryAction,
          secondaryAction: homeManifest.routes[0].secondaryAction,
        },
      ],
    },
    "products route accepted home-only fields",
  );

  const policyManifest = {
    ...nestedManifest,
    routes: [
      {
        description: "Policy route fixture",
        eyebrow: "Policy fixture",
        heading: "Policy route",
        kind: "policy",
        policySummary: {
          evidence: "Rendered checks",
          excluded: "Private app uptime",
          scope: "Public static repository",
        },
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        signalTerms: ["policy"],
        slug: "privacy",
        summary: "Policy route fixture",
        title: "Policy route fixture",
        urlPath: "/privacy/",
      },
    ],
  };
  definePublicRouteManifest(policyManifest);

  const evidenceManifest = {
    ...nestedManifest,
    routes: [
      {
        description: "Evidence route fixture",
        evidenceLinks: [
          {
            description: "Review the evidence source.",
            href: "https://example.com/evidence",
            label: "Evidence source",
          },
        ],
        eyebrow: "Evidence fixture",
        heading: "Evidence route",
        kind: "evidence",
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        signalTerms: ["evidence"],
        slug: "trust",
        summary: "Evidence route fixture",
        title: "Evidence route fixture",
        urlPath: "/trust/",
      },
    ],
  };
  definePublicRouteManifest(evidenceManifest);

  const unsafeEvidenceManifest = structuredClone(evidenceManifest);
  unsafeEvidenceManifest.routes[0].evidenceLinks[0].href = "javascript:alert(1)";
  assertRejectedManifest(
    unsafeEvidenceManifest,
    "evidence route accepted an unsafe evidence URL",
  );
  assertRejectedManifest(
    { ...evidenceManifest, routes: [{ ...evidenceManifest.routes[0], evidenceLinks: [] }] },
    "evidence route accepted an empty evidence-link list",
  );
  assertRejectedManifest(
    {
      ...evidenceManifest,
      routes: [
        {
          ...evidenceManifest.routes[0],
          evidenceLinks: [
            evidenceManifest.routes[0].evidenceLinks[0],
            {
              ...evidenceManifest.routes[0].evidenceLinks[0],
              label: "Duplicate evidence source",
            },
          ],
        },
      ],
    },
    "evidence route accepted duplicate evidence URLs",
  );
  assertRejectedManifest(
    {
      ...evidenceManifest,
      routes: [
        {
          ...evidenceManifest.routes[0],
          policySummary: policyManifest.routes[0].policySummary,
          primaryAction: { href: "/", label: "Home" },
          proof: ["Wrong-kind proof"],
          secondaryAction: { href: "/terms/", label: "Terms" },
        },
      ],
    },
    "evidence route accepted fields from other route kinds",
  );

  const migrationManifest = {
    ...nestedManifest,
    routes: [
      {
        description: "Migration route fixture",
        eyebrow: "Migration fixture",
        heading: "Migration route",
        kind: "migration",
        robots: "noindex, nofollow",
        sections: [{ body: "Fixture body", title: "Fixture" }],
        signalTerms: ["migration"],
        slug: "migration",
        steps: [
          { body: "Inventory the source and destination.", label: "Inventory" },
          { body: "Record evidence before cleanup.", label: "Evidence" },
        ],
        summary: "Migration route fixture",
        title: "Migration route fixture",
        urlPath: "/migration/",
      },
    ],
  };
  definePublicRouteManifest(migrationManifest);
  assertRejectedManifest(
    { ...migrationManifest, routes: [{ ...migrationManifest.routes[0], steps: [] }] },
    "migration route accepted an empty step list",
  );
  assertRejectedManifest(
    {
      ...migrationManifest,
      routes: [
        {
          ...migrationManifest.routes[0],
          steps: [
            migrationManifest.routes[0].steps[0],
            {
              body: "A duplicate label must not create an ambiguous ordered step.",
              label: migrationManifest.routes[0].steps[0].label,
            },
          ],
        },
      ],
    },
    "migration route accepted duplicate step labels",
  );
  assertRejectedManifest(
    {
      ...migrationManifest,
      routes: [
        {
          ...migrationManifest.routes[0],
          evidenceLinks: evidenceManifest.routes[0].evidenceLinks,
          policySummary: policyManifest.routes[0].policySummary,
          primaryAction: { href: "/", label: "Home" },
          proof: ["Wrong-kind proof"],
          secondaryAction: { href: "/terms/", label: "Terms" },
        },
      ],
    },
    "migration route accepted fields from other route kinds",
  );
  assertRejectedManifest(
    {
      ...evidenceManifest,
      routes: [{ ...evidenceManifest.routes[0], steps: migrationManifest.routes[0].steps }],
    },
    "evidence route accepted migration steps",
  );
  assertRejectedManifest(
    {
      ...nestedManifest,
      routes: [
        {
          ...nestedManifest.routes[0],
          evidenceLinks: evidenceManifest.routes[0].evidenceLinks,
          steps: migrationManifest.routes[0].steps,
        },
      ],
    },
    "resource route accepted evidence or migration fields",
  );
  assertRejectedManifest(
    {
      ...policyManifest,
      routes: [
        {
          ...policyManifest.routes[0],
          evidenceLinks: evidenceManifest.routes[0].evidenceLinks,
          steps: migrationManifest.routes[0].steps,
        },
      ],
    },
    "policy route accepted evidence or migration fields",
  );
  assertRejectedManifest(
    {
      ...nestedManifest,
      routes: [{ ...nestedManifest.routes[0], kind: "unknown" }],
    },
    "route manifest accepted an unknown route kind",
  );

  assertRejectedManifest(
    {
      ...policyManifest,
      routes: [
        {
          ...policyManifest.routes[0],
          primaryAction: { href: "/", label: "Home" },
          proof: ["Wrong-kind proof"],
          secondaryAction: { href: "/terms/", label: "Terms" },
        },
      ],
    },
    "policy route accepted resource-only fields",
  );
  assertRejectedManifest(
    {
      ...nestedManifest,
      routes: [
        {
          ...nestedManifest.routes[0],
          policySummary: policyManifest.routes[0].policySummary,
        },
      ],
    },
    "resource route accepted a policy summary",
  );

  const unsafeManifest = structuredClone(nestedManifest);
  unsafeManifest.routes[0].primaryAction.href = "javascript:alert(1)";
  let rejectedUnsafeHref = false;
  try {
    definePublicRouteManifest(unsafeManifest);
  } catch (error) {
    rejectedUnsafeHref = String(error.message).includes("internal trailing-slash path or HTTPS URL");
  }
  if (!rejectedUnsafeHref) throw new Error("Astro route fixture accepted an unsafe action URL");

  const malformedFindings = [];
  validateManifest({ ...nestedManifest, routes: [null] }, malformedFindings);
  if (!malformedFindings.some((finding) => finding.includes("routes[0] must be an object"))) {
    throw new Error("Astro route fixture did not report a malformed route entry");
  }
}

function assertRejectedManifest(manifest, message) {
  let rejected = false;
  try {
    definePublicRouteManifest(manifest);
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error(message);
}

export function assertLegacyCoreRouteBuild(root) {
  const findings = [];
  const manifest = readManifest(root, findings);
  if (!manifest) return fail(findings);
  validateManifest(manifest, findings);
  const legacyManifestPath = path.join(root, "dist", "route-manifest.json");
  if (!existsSync(legacyManifestPath)) {
    findings.push("dist/route-manifest.json: missing legacy route manifest");
  } else {
    const legacyManifest = JSON.parse(readFileSync(legacyManifestPath, "utf8"));
    if (legacyManifest.pageCount !== 20 || legacyManifest.routes?.length !== 20) {
      findings.push("dist/route-manifest.json: expected exactly 20 legacy routes");
    }
  }
  if (findings.length > 0) return fail(findings);

  for (const route of manifest.routes ?? []) {
    const legacyOutputPath = path.join(
      root,
      "dist",
      route.urlPath.replace(/^\/+|\/+$/g, ""),
      "index.html",
    );
    if (!existsSync(legacyOutputPath)) {
      findings.push(`${route.urlPath}: missing legacy build output for parity check`);
      continue;
    }
    const legacyHtml = readFileSync(legacyOutputPath, "utf8");
    for (const [label, value] of expectedRouteValues(route)) {
      if (!legacyHtml.includes(value)) {
        findings.push(`${route.urlPath}: legacy build diverges on ${label}`);
      }
    }
    if (route.kind === "migration" && !legacyHtml.includes("<caption")) {
      findings.push(`${route.urlPath}: legacy migration tables need captions`);
    }
  }
  if (findings.length > 0) fail(findings);
}

export function assertAstroCoreRouteBuild(root) {
  const findings = [];
  const manifest = readManifest(root, findings);
  if (!manifest) return fail(findings);
  validateManifest(manifest, findings);
  if (findings.length > 0) return fail(findings);

  const appDist = path.join(root, "apps", manifest.app, "dist");
  for (const route of manifest.routes ?? []) {
    const legacyOutputPath = path.join(
      root,
      "dist",
      route.urlPath.replace(/^\/+|\/+$/g, ""),
      "index.html",
    );
    const outputPath = path.join(
      root,
      "apps",
      manifest.app,
      "dist",
      route.urlPath.replace(/^\/+|\/+$/g, ""),
      "index.html",
    );
    if (!existsSync(legacyOutputPath)) {
      findings.push(`${route.urlPath}: missing legacy build output for parity check`);
      continue;
    }
    if (!existsSync(outputPath)) {
      findings.push(`${route.urlPath}: missing Astro build output`);
      continue;
    }
    const legacyHtml = readFileSync(legacyOutputPath, "utf8");
    const html = readFileSync(outputPath, "utf8");
    for (const [label, snippet] of [
      ["title", `<title>${route.title}</title>`],
      ["description", `name="description" content="${route.description}"`],
      ["canonical", `rel="canonical" href="${manifest.origin}${route.urlPath}"`],
      ["robots", 'name="robots" content="noindex, nofollow"'],
      ["main landmark", "<main"],
      ["skip link", 'href="#main-content"'],
    ]) {
      if (!html.includes(snippet)) findings.push(`${route.urlPath}: missing ${label}`);
    }
    const headingPattern = new RegExp(
      `<h1\\b[^>]*\\bid="page-title"[^>]*>${escapeRegExp(route.heading)}</h1>`,
    );
    if (!headingPattern.test(html)) findings.push(`${route.urlPath}: missing heading`);
    if (!html.includes(`class="brand" href="${manifest.origin}/"`)) {
      findings.push(`${route.urlPath}: preview brand must link to the production public home`);
    }
    if (route.kind === "evidence" && !html.includes('class="evidence-sources"')) {
      findings.push(`${route.urlPath}: Astro evidence sources missing`);
    }
    if (route.kind === "migration") {
      if (!html.includes('<ol class="migration-steps"')) {
        findings.push(`${route.urlPath}: Astro ordered migration steps missing`);
      }
      if (!html.includes('class="route-ledger"')) {
        findings.push(`${route.urlPath}: Astro route-level migration ledger missing`);
      }
      if (!html.includes("<table")) {
        findings.push(`${route.urlPath}: Astro semantic migration table missing`);
      }
      if (!html.includes("<caption")) {
        findings.push(`${route.urlPath}: Astro migration tables need captions`);
      }
    }
    if (route.kind === "home" && !html.includes('class="actions"')) {
      findings.push(`${route.urlPath}: Astro customer actions missing`);
    }
    if (route.kind === "products") {
      if (!html.includes('class="product-family"') || !html.includes("<dl")) {
        findings.push(`${route.urlPath}: Astro semantic product comparison missing`);
      }
      if (!html.includes('class="product-evidence"')) {
        findings.push(`${route.urlPath}: Astro product evidence links missing`);
      }
    }
    for (const [label, value] of expectedRouteValues(route)) {
      if (!legacyHtml.includes(value)) {
        findings.push(`${route.urlPath}: legacy build diverges on ${label}`);
      }
      if (!html.includes(value)) {
        findings.push(`${route.urlPath}: Astro build diverges on ${label}`);
      }
    }
    if (route.kind === "policy" && (!html.includes('href="/privacy/"') || !html.includes('href="/terms/"'))) {
      findings.push(`${route.urlPath}: Astro footer policy links missing`);
    }
    for (const href of [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1])) {
      if (!href.startsWith("/")) continue;
      if (href.startsWith("/_astro/")) {
        if (!existsSync(path.join(appDist, href.slice(1)))) {
          findings.push(`${route.urlPath}: unresolved preview asset ${href}`);
        }
        continue;
      }
      const targetPath = path.join(
        appDist,
        href.replace(/^\/+|\/+$/g, ""),
        "index.html",
      );
      if (!existsSync(targetPath)) findings.push(`${route.urlPath}: unresolved preview link ${href}`);
    }
  }
  if (existsSync(path.join(appDist, "index", "index.html"))) {
    findings.push("/: Astro build emitted an unintended /index/ route");
  }
  const previewSitemapPath = path.join(appDist, "sitemap.xml");
  if (existsSync(previewSitemapPath)) {
    const previewSitemap = readFileSync(previewSitemapPath, "utf8");
    for (const route of manifest.routes ?? []) {
      if (previewSitemap.includes(`${manifest.origin}${route.urlPath}`)) {
        findings.push(`${route.urlPath}: preview route leaked into the Astro sitemap`);
      }
    }
  }
  if (findings.length > 0) fail(findings);
}

function expectedRouteValues(route) {
  const values = [
    ["title", route.title],
    ["description", route.description],
    ["eyebrow", route.eyebrow],
    ["heading", route.heading],
    ["summary", route.summary],
    ...route.sections.flatMap((section) => [
      ["section title", section.title],
      ["section body", section.body],
      ...(section.meta ? [["section meta", section.meta]] : []),
    ]),
  ];
  if (route.kind === "resource") {
    return [
      ...values,
      ["primary action label", route.primaryAction.label],
      ["primary action href", route.primaryAction.href],
      ["secondary action label", route.secondaryAction.label],
      ["secondary action href", route.secondaryAction.href],
      ...route.proof.map((item) => ["proof item", item]),
    ];
  }
  if (route.kind === "home") {
    return [
      ...values,
      ["primary action label", route.primaryAction.label],
      ["primary action href", route.primaryAction.href],
      ["secondary action label", route.secondaryAction.label],
      ["secondary action href", route.secondaryAction.href],
    ];
  }
  if (route.kind === "products") {
    return [
      ...values,
      ...route.products.flatMap((product) => [
        ["product name", product.name],
        ["product role", product.role],
        ["product job", product.job],
        ["product proof", product.proof],
        ["product boundary", product.boundary],
        ["product status", product.status],
        ["product href", product.href],
        ["product evidence label", product.evidence.label],
        ["product evidence href", product.evidence.href],
      ]),
    ];
  }
  if (route.kind === "policy") {
    return [
      ...values,
      ...Object.entries(route.policySummary).map(([label, value]) => [
        `policy summary ${label}`,
        value,
      ]),
    ];
  }
  if (route.kind === "evidence") {
    return [
      ...values,
      ...route.evidenceLinks.flatMap((link) => [
        ["evidence link label", link.label],
        ["evidence link description", link.description],
        ["evidence link href", link.href],
      ]),
    ];
  }
  return [
    ...values,
    ...route.steps.flatMap((step) => [
      ["migration step label", step.label],
      ["migration step body", step.body],
    ]),
  ];
}

function validateManifest(manifest, findings) {
  try {
    definePublicRouteManifest(manifest);
  } catch (error) {
    findings.push(`${manifestPath}: ${error.message}`);
  }
  if (manifest.schemaVersion !== 1) findings.push(`${manifestPath}: schemaVersion must be 1`);
  if (manifest.app !== "complyeaze") findings.push(`${manifestPath}: app must be complyeaze`);
  if (manifest.origin !== "https://complyeaze.com") {
    findings.push(`${manifestPath}: production origin must be https://complyeaze.com`);
  }
  const routes = Array.isArray(manifest.routes) ? manifest.routes : [];
  const routeObjects = routes.filter((route, index) => {
    const isObject = typeof route === "object" && route !== null && !Array.isArray(route);
    if (!isObject) findings.push(`${manifestPath}: routes[${index}] must be an object`);
    return isObject;
  });
  const paths = routeObjects.map((route) => route.urlPath);
  for (const requiredRoute of requiredRoutes) {
    if (!paths.includes(requiredRoute)) findings.push(`${manifestPath}: missing ${requiredRoute}`);
  }
  if (new Set(paths).size !== paths.length) findings.push(`${manifestPath}: duplicate route paths`);
  if (paths.length !== 12) findings.push(`${manifestPath}: expected exactly 12 routes`);

  for (const route of routeObjects) {
    for (const field of ["slug", "urlPath", "title", "description", "heading", "summary"]) {
      if (typeof route[field] !== "string" || !route[field].trim()) {
        findings.push(`${manifestPath}: ${route.urlPath ?? "unknown"} missing ${field}`);
      }
    }
    if (route.robots !== "noindex, nofollow") {
      findings.push(`${manifestPath}: ${route.urlPath} must stay noindex before cutover`);
    }
    if (!Array.isArray(route.sections) || route.sections.length === 0) {
      findings.push(`${manifestPath}: ${route.urlPath} needs sections`);
    }
    if (route.kind === "resource" && (!Array.isArray(route.proof) || route.proof.length === 0)) {
      findings.push(`${manifestPath}: ${route.urlPath} resource route needs proof`);
    }
    if (route.kind === "policy" && !route.policySummary) {
      findings.push(`${manifestPath}: ${route.urlPath} policy route needs a policy summary`);
    }
    if (JSON.stringify(route).includes("ComplyEaze Public")) {
      findings.push(`${manifestPath}: ${route.urlPath} exposes repository-boundary branding`);
    }
    if (
      ["home", "products"].includes(route.kind) &&
      /migration ledger|review gate|cleanup pr|public boundary repository/i.test(
        JSON.stringify(route),
      )
    ) {
      findings.push(`${manifestPath}: ${route.urlPath} exposes internal methodology`);
    }
  }

  const statusRoute = routeObjects.find((route) => route.urlPath === "/status/");
  if (!statusRoute || !JSON.stringify(statusRoute).includes("customer-core")) {
    findings.push(`${manifestPath}: /status/ must report the customer-core route port`);
  }
  const changelogRoute = routeObjects.find((route) => route.urlPath === "/changelog/");
  if (!changelogRoute || !JSON.stringify(changelogRoute).includes("Customer-core route port")) {
    findings.push(`${manifestPath}: /changelog/ must record the customer-core route port`);
  }
}

function readManifest(root, findings) {
  const absolutePath = path.join(root, manifestPath);
  if (!existsSync(absolutePath)) return null;
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (error) {
    findings.push(`${manifestPath}: invalid JSON ${error.message}`);
    return null;
  }
}

function fail(findings) {
  throw new Error(`Astro core-route build findings:\n${findings.join("\n")}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
