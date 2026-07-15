import { axalPages } from "./axal-data.mjs";
import { customerRoutePages } from "./customer-route-data.mjs";
import { evidenceRoutePages } from "./evidence-route-data.mjs";
import { gatewayPages } from "./gateway-data.mjs";
import { policyPages } from "./policy-data.mjs";
import { rootResourcePages } from "./root-resource-data.mjs";

export const site = {
  origin: "https://complyeaze.com",
  title: "ComplyEaze",
  description:
    "Public product, trust, and source evidence for the ComplyEaze product family.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products/" },
    { label: "About", href: "/about/" },
    { label: "Trust", href: "/trust/" }
  ],
  migrationLedgerPath: "/migration/"
};

export const pages = [
  ...customerRoutePages,
  ...evidenceRoutePages,
  ...rootResourcePages,
  ...policyPages,
  ...gatewayPages,
  ...axalPages
];
