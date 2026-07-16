import type {
  PublicAction,
  PublicEvidenceLink,
  PublicRouteBase,
} from "./schema.ts";

export interface PublicGatewayRoute extends PublicRouteBase {
  evidenceLinks: PublicEvidenceLink[];
  kind: "gateway";
  primaryAction: PublicAction;
  product: string;
  secondaryAction: PublicAction;
}
