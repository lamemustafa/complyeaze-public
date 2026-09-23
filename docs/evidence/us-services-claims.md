# US services claim sources

Verified: 2026-09-23

This matrix records every factual claim printed on `/services/`,
`/services/accounting-integrations/` and `/services/trust-reconciliation/`,
and the primary source it was checked against. It supports the page wording
only; it is not evidence of client work, outcomes, affiliation with any
platform, or legal advice.

Re-verify every row before these routes leave noindex, and whenever Intuit,
Xero or California change the underlying pages.

## Accounting-integration work

| Printed claim | Source | Source wording checked |
| --- | --- | --- |
| Builder tier: 500,000 CorePlus calls a calendar month, then blocked; Silver US$300 for 1 million; Gold US$1,700 for 10 million; Platinum US$4,500 for 75 million | [Intuit App Partner Program Guide, v1.2_03.2026](https://static.developer.intuit.com/resources/Intuit_App_Partner_Program_Guide.pdf) | "Any CorePlus API calls made above the included monthly Credit will be blocked"; tier table of monthly fees and included credits |
| CorePlus calls are most data-out operations; most writes are Core calls, which are not charged; paid tiers pay per 1,000 calls above what is included | Same guide | "Core API calls cover most data-in operations"; "Core API calls are unmetered and uncharged"; "CorePlus API calls cover most data-out operations" |
| Usage fees have applied since 1 November 2025 for US partners (metering began 28 July 2025) | [Intuit Developer, Introducing the Intuit App Partner Program, 15 May 2025](https://blogs.intuit.com/2025/05/15/introducing-the-intuit-app-partner-program/) (now served from Intuit Developer's Medium publication) | Usage from 28 July to 31 October 2025 discounted at 100%; variable fees apply from 1 November 2025 |
| Xero paid tiers since 2 March 2026: Core A$35, Plus A$245, Advanced A$1,445 a month, tax exclusive, capped at 50, 1,000 and 10,000 connections, with 10, 50 and 250 GB of data a month included | [Xero Developer pricing](https://developer.xero.com/pricing) | Effective 2 March 2026; "Pricing is tax exclusive"; tier table. Starter (free, 5 connections) and Enterprise (on application) are not printed |
| Journals endpoint only from the Advanced tier up, after a security assessment and use-case approval; "A$1,200 a month more" is printed as the difference between Advanced and Plus | [Xero pricing and policy FAQ](https://developer.xero.com/faq/pricing-and-policy-updates), [Xero Developer pricing](https://developer.xero.com/pricing) | "only available starting at the Advanced tier"; manual journals "will continue to be available to apps in all tiers" |
| Existing Xero apps must move to granular scopes by 13 September 2027 | [Xero Developer changelog, broad scopes deprecation, 6 August 2026](https://developer.xero.com/changelog) | "Existing apps have until 13 September 2027 to migrate." The FAQ says "September 2027" |
| Existing tokens are not upgraded; each customer has to authorise the app again | [Xero granular scopes FAQ](https://developer.xero.com/faq/granular-scopes) | "the customer reauthorises your app"; "the user must provide explicit consent for the granular scopes" |
| 518,400 calls a month | Arithmetic on invented inputs (180 companies, 15-minute polling, 30 days), labelled on the page | Not a client figure |

Dates deliberately not used: 30 April 2027 and 5 November 2026. Neither is a
granular-scopes deadline.

## Trust-account reconciliation

| Printed claim | Source | Source wording checked |
| --- | --- | --- |
| Beneficiary records reconciled with the record of all trust funds received and disbursed at least once a month, except months with no account activity; the record shows the broker's liability to each beneficiary | [10 CCR 2831.2, Cornell LII](https://www.law.cornell.edu/regulations/california/10-CCR-2831.2) | Operative sentence and the list of required reconciliation contents |
| Only positive beneficiary balances count toward what the broker owes; negative balances do not offset | [California DRE, Trust Funds guide (RE 13)](https://dre.ca.gov/files/pdf/re13.pdf) | "beneficiary accounts with negative balances are not deducted from other accounts when calculating the aggregate trust fund liability" |
| Written consent of every owner of the funds before a disbursement that takes the account below the aggregate liability | [10 CCR 2832.1, Cornell LII](https://www.law.cornell.edu/regulations/california/10-CCR-2832.1) | Regulation text |
| Month-end table ($99,000 / $101,000 / -$2,000) | Invented figures, labelled on the page | Not a client figure |

California rules are presented as the example; the page states that other
states set their own trust-account rules.

Words never printed on the trust route: audit, certify or certified, attest,
compliant, CPA-reviewed, guarantee. `forbiddenTerms` in the route manifest is
enforced twice: against every manifest field in `definePublicRouteManifest`,
and against the tag-stripped built page (layout, footer and component text
included) in `pnpm public:check`. Both match after Unicode normalisation with
invisible characters removed. The sample PDF is not machine-scanned; it was
checked by hand with `pdftotext` and carries none of the terms.

## Owner statements

| Printed claim | Source |
| --- | --- |
| "Four years as a senior engineer at G2, where I built and maintained QuickBooks, Xero and NetSuite integrations." | Owner-supplied credential, printed verbatim and not extended |
| One person, Tapish Khandelwal, based in India; a paid service separate from the ComplyEaze software products | Owner-approved wording, 2026-09-23 |
| Prices, payment terms (fixed price, half up front) and upkeep terms | Owner's service offers, 2026-09-23 |
| No client references yet | Owner's service plan; there are no clients, testimonials or case studies |

## Sample downloads

Both PDFs were re-rendered from the owner's synthetic sample sources, with
these edits only:

- `sample-connector-health-audit.pdf`: "Prepared by" filled with the owner's
  name; the Journals line corrected to "only from the Advanced tier up, after
  a security assessment"; the granular-scopes row corrected (older apps can
  request granular scopes from April 2026, and the only scope split printed is
  the FAQ's own example, `accounting.transactions` to `accounting.invoices`);
  "sync-failure monitoring" narrowed to "sync failures"; the engagement
  paragraph aligned to the page terms (the source said "paid after delivery",
  which contradicted "half up front"); em dashes removed.
- `sample-trust-review-2026-08.pdf`: the invented firm renamed to "Example
  Property Management", because the source name resembled real California
  property-management firms; "Prepared by" filled with the owner's name; the
  2832.1 finding corrected to "every owner of the funds in the account"; the
  scope line changed to "It is a review the broker signs, not legal advice"
  (the source used two banned words in negation); dashes removed; the footer
  now says a real review ships a workbook that is not included with the
  sample.

The connector sample's fix column says QuickBooks webhooks use the CloudEvents
format: [Intuit Developer, Upcoming change to webhooks payload structure,
12 Nov 2025](https://blogs.intuit.com/2025/11/12/upcoming-change-to-webhooks-payload-structure/).

Both files are pinned by SHA-256 in `scripts/public-checks/sensitive-content.mjs`;
a replacement needs a fresh review and a new hash.

Every firm, account, person, amount and log line in both files is invented.
The trust sample cites 10 CCR 2831, 2831.1, 2831.2, 2832, 2832.1 and 2835,
B&P 10145, Civil Code 1950.5 and DRE RE 13 inside its findings. Of these,
10 CCR 2831.2, 2832.1 and 2835 (the US$200 limit on broker funds) and RE 13
were checked against their text on 2026-09-23; the rest are labelled
references inside a fictional sample.
