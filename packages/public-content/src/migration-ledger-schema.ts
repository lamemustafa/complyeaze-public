export interface MigrationRouteEntry {
  cleanupStatus: string;
  destinationHost: string;
  destinationRoute: string;
  evidenceStatus: string;
  hostedEvidenceUrl: string;
  parentCleanupPr: string;
  redirectPlan: string;
  redirectStatus: string;
  rollback: string;
  rollbackCommandOrOwner: string;
  sourceHost: string;
  sourceRoute: string;
}

export interface MigrationLedgerEntry {
  cleanup: string;
  destination: string;
  evidence: string;
  family: string;
  parentCleanup: string;
  rollback: string;
  routes: MigrationRouteEntry[];
  source: string;
  status: string;
}

export type MigrationLedger = MigrationLedgerEntry[];

const familyStringFields = [
  "cleanup",
  "destination",
  "evidence",
  "family",
  "parentCleanup",
  "rollback",
  "source",
  "status",
] as const;

const routeStringFields = [
  "cleanupStatus",
  "destinationHost",
  "destinationRoute",
  "evidenceStatus",
  "hostedEvidenceUrl",
  "parentCleanupPr",
  "redirectPlan",
  "redirectStatus",
  "rollback",
  "rollbackCommandOrOwner",
  "sourceHost",
  "sourceRoute",
] as const;

export function defineMigrationLedger(value: unknown): MigrationLedger {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("migration ledger must not be empty");
  }
  const families = new Set<string>();
  const sourceRouteIdentities = new Set<string>();
  value.forEach((entry, entryIndex) => {
    const entryLabel = `migrationLedger[${entryIndex}]`;
    assertRecord(entry, entryLabel);
    familyStringFields.forEach((field) => assertString(entry[field], `${entryLabel}.${field}`));
    const validatedEntry = entry as unknown as MigrationLedgerEntry;
    if (families.has(validatedEntry.family)) {
      throw new Error(`migration ledger family names must be unique: ${validatedEntry.family}`);
    }
    families.add(validatedEntry.family);
    if (!validatedEntry.parentCleanup.toLowerCase().includes("separate private-app cleanup pr")) {
      throw new Error(
        `${entryLabel}.parentCleanup must require a separate private-app cleanup PR`,
      );
    }
    if (!Array.isArray(entry.routes) || entry.routes.length === 0) {
      throw new Error(`${entryLabel}.routes must not be empty`);
    }
    entry.routes.forEach((route, routeIndex) => {
      const label = `migrationLedger[${entryIndex}].routes[${routeIndex}]`;
      assertRecord(route, label);
      routeStringFields.forEach((field) => assertString(route[field], `${label}.${field}`));
      const validatedRoute = route as unknown as MigrationRouteEntry;
      assertHostname(validatedRoute.sourceHost, `${label}.sourceHost`);
      assertHostname(validatedRoute.destinationHost, `${label}.destinationHost`);
      assertRootRelativeRoute(validatedRoute.sourceRoute, `${label}.sourceRoute`);
      assertRootRelativeRoute(validatedRoute.destinationRoute, `${label}.destinationRoute`);
      if (!validatedRoute.evidenceStatus.toLowerCase().includes("pending")) {
        throw new Error(`${label}.evidenceStatus must keep pending evidence explicit`);
      }
      if (!validatedRoute.cleanupStatus.toLowerCase().includes("blocked")) {
        throw new Error(`${label}.cleanupStatus must keep cleanup explicitly blocked`);
      }
      const sourceIdentity = `${validatedRoute.sourceHost}${validatedRoute.sourceRoute}`;
      if (sourceRouteIdentities.has(sourceIdentity)) {
        throw new Error(`migration ledger source routes must be unique: ${sourceIdentity}`);
      }
      sourceRouteIdentities.add(sourceIdentity);
    });
  });
  return value as MigrationLedger;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertHostname(value: unknown, label: string): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(value)
  ) {
    throw new Error(`${label} must be a lowercase hostname without a protocol or path`);
  }
}

function assertRootRelativeRoute(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !/^\/(?!\/)[^\s?#]*$/.test(value)) {
    throw new Error(`${label} must be a root-relative route without a query or fragment`);
  }
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}
