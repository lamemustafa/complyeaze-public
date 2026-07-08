import { site } from "./site-data.mjs";

export function renderPage(page) {
  const canonical = new URL(page.urlPath, site.origin).href;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="ComplyEaze Public home">
        <span class="brand-mark" aria-hidden="true">CE</span>
        <span>ComplyEaze Public</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${site.nav
          .map(
            (item) =>
              `<a href="${item.href}"${item.href === page.urlPath ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`,
          )
          .join("")}
      </nav>
    </header>
    <main id="main" class="page-shell">
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1 id="page-title">${escapeHtml(page.heading)}</h1>
        <p class="hero-summary">${escapeHtml(page.summary)}</p>
        ${renderCtas(page)}
      </section>
      ${page.slug === "products" ? renderProducts() : renderSections(page.sections)}
    </main>
    <footer class="site-footer">
      <p>Open-source public surfaces. Private app data stays outside this repository.</p>
      <a href="/trust/">Trust policy</a>
    </footer>
  </body>
</html>`;
}

function renderCtas(page) {
  if (!page.primaryCta) return "";
  return `<div class="hero-actions">
    <a class="button-primary" href="${page.primaryCta.href}">${escapeHtml(page.primaryCta.label)}</a>
    <a class="button-secondary" href="${page.secondaryCta.href}">${escapeHtml(page.secondaryCta.label)}</a>
  </div>`;
}

function renderSections(sections) {
  return `<section class="evidence-grid" aria-label="Public boundary evidence">
    ${sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`,
      )
      .join("")}
  </section>`;
}

function renderProducts() {
  return `<section class="product-table-section" aria-label="ComplyEaze product-family map">
    <table>
      <thead>
        <tr>
          <th scope="col">Surface</th>
          <th scope="col">Public role</th>
          <th scope="col">Boundary</th>
        </tr>
      </thead>
      <tbody>
        ${site.products
          .map(
            (product) => `<tr>
              <th scope="row" data-label="Surface"><a href="${product.href}">${escapeHtml(product.name)}</a></th>
              <td data-label="Public role">${escapeHtml(product.role)}</td>
              <td data-label="Boundary">${escapeHtml(product.status)}</td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </section>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
