export function renderPolicyPage(page, escapeHtml) {
  return `<section class="policy-strip" aria-label="Policy evidence summary">
    <article>
      <span>Scope</span>
      <strong>Public static repository</strong>
    </article>
    <article>
      <span>Evidence</span>
      <strong>Local docs and rendered checks</strong>
    </article>
    <article>
      <span>Excluded</span>
      <strong>Tenant data and app uptime</strong>
    </article>
  </section>
  <section class="policy-stack" aria-label="${escapeHtml(page.heading)} details">
    ${page.sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`,
      )
      .join("")}
  </section>`;
}
