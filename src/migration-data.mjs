// Keep the legacy renderer as the rollback baseline during migration, but adapt
// it from the same typed ledger that feeds the Astro preview and public checks.
export { migrationLedger } from "../packages/public-content/src/complyeaze.migration-ledger.ts";
