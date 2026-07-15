export function canonicalUrl(origin: string, urlPath: string): string {
  const base = new URL(origin);
  if (base.protocol !== "https:" || base.origin !== origin) {
    throw new Error("Public canonical origin must be an HTTPS origin");
  }
  if (!/^\/[a-z0-9/-]*\/$/.test(urlPath)) {
    throw new Error("Public canonical path must be a clean trailing-slash path");
  }
  return new URL(urlPath, `${origin}/`).href;
}
