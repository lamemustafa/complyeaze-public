import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_ORIGIN ?? "https://axal.complyeaze.com";

export default defineConfig({
  site,
  output: "static",
});
