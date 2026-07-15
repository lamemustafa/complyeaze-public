export function renderEvidencePage(page, escapeHtml) {
  return `${renderSections(page.sections, escapeHtml)}
  <section class="evidence-sources" aria-labelledby="evidence-sources-title">
    <div class="evidence-sources-heading">
      <h2 id="evidence-sources-title">Review the source evidence</h2>
      <p>These public files define the boundary behind this page.</p>
    </div>
    <ul>
      ${page.evidenceLinks
        .map(
          (link) => `<li>
            <a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>
            <p>${escapeHtml(link.description)}</p>
          </li>`,
        )
        .join("")}
    </ul>
  </section>`;
}

function renderSections(sections, escapeHtml) {
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
