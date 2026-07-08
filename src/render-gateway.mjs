export function renderGatewayPage(page, escapeHtml) {
  return `<section class="gateway-actions" aria-label="${escapeHtml(page.product)} destination">
    <a class="button-primary" href="${escapeHtml(page.externalHref)}">${escapeHtml(page.externalLabel)}</a>
    <a class="button-secondary" href="${escapeHtml(page.secondaryCta.href)}">${escapeHtml(page.secondaryCta.label)}</a>
  </section>
  <section class="gateway-grid" aria-label="${escapeHtml(page.product)} boundary notes">
    ${page.sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`,
      )
      .join("")}
  </section>
  <section class="gateway-evidence" aria-label="${escapeHtml(page.product)} evidence rules">
    <h2>Evidence before route cleanup</h2>
    <ol>
      ${page.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
  </section>`;
}
