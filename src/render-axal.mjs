import { axalDetails } from "./axal-data.mjs";

export function renderAxalPage(page, escapeHtml) {
  if (page.type === "axalIndex") return renderAxalIndex(escapeHtml);
  return renderAxalDetail(page, escapeHtml);
}

function renderAxalIndex(escapeHtml) {
  return `<section class="axal-directory" aria-label="Axal public page directory">
    <article class="axal-boundary">
      <h2>Public story, not private workspace</h2>
      <p>These pages migrate public-safe Axal positioning only. Login, signup, workspace routes, client data, documents, credentials, portal operations, and private app infrastructure stay outside this repository.</p>
    </article>
    <div class="axal-page-grid">
      ${axalDetails
        .map(
          (page) => `<article>
            <p>${escapeHtml(page.navLabel)}</p>
            <h2><a href="/products/axal/${escapeHtml(page.slug)}/">${escapeHtml(page.h1)}</a></h2>
            <span>${escapeHtml(page.carefulBoundary)}</span>
          </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderAxalDetail(page, escapeHtml) {
  return `<section class="axal-detail" aria-label="${escapeHtml(page.navLabel)} details">
    <aside class="axal-boundary">
      <h2>Professional-review boundary</h2>
      <p>${escapeHtml(page.carefulBoundary)}</p>
    </aside>
    <section class="axal-audience" aria-label="Audience and action">
      <p>${escapeHtml(page.audience)}</p>
      <a href="/products/axal/">${escapeHtml(page.primaryAction)}</a>
    </section>
    <section class="axal-section-grid" aria-label="Axal workflow sections">
      ${page.sections
        .map(
          (section) => `<article>
            <h2>${escapeHtml(section.heading)}</h2>
            <p>${escapeHtml(section.body)}</p>
            <ul>
              ${section.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
          </article>`,
        )
        .join("")}
    </section>
    <section class="axal-faqs" aria-label="Axal questions">
      <h2>Questions teams ask</h2>
      <div>
        ${page.faqs
          .map(
            (faq) => `<article>
              <h3>${escapeHtml(faq.question)}</h3>
              <p>${escapeHtml(faq.answer)}</p>
            </article>`,
          )
          .join("")}
      </div>
    </section>
  </section>`;
}
