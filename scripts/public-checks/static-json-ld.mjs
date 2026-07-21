export function hasAuthoredClientScript(html) {
  for (const match of html.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script>/gi)) {
    const attributes = match[1];
    const typeAttributeCount = (attributes.match(/\btype\s*=/gi) ?? []).length;
    const isStaticJsonLd = typeAttributeCount === 1
      && /\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)
      && !/\bsrc\s*=/i.test(attributes);
    if (!isStaticJsonLd) return true;
  }
  return false;
}
