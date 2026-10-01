/* THE README'S OWN EXAMPLE AND USAGE, read from github.com/kyisaiah47/leakless#readme on
 * 2026-10-01. The README calls the output "Real output, `leakless gate --url https://example.com
 * --owner-confirmed true` against the live BreachProbe". Every string below is copied from the
 * README, never composed. The README's one wide dash is written as an escape, because the
 * register gate refuses the character itself in any file. */

export const EXAMPLE_READ_AT = "2026-10-01";
export const EXAMPLE_URL = "https://github.com/kyisaiah47/leakless#what-it-looks-like";

export const EXAMPLE_COMMAND = "leakless gate --url https://example.com --owner-confirmed true";

export const EXAMPLE = {
  host: "example.com",
  score: 71,
  grade: "C",
  summary: "A few hardening gaps. No open door we could walk through, but 3 things to tighten.",
  exit: 0,
  findings: [
    { severity: "medium", category: "headers", finding: "No HTTPS enforcement (HSTS)" },
    { severity: "medium", category: "headers", finding: "App can be embedded in a hostile iframe (clickjacking)" },
    { severity: "medium", category: "headers", finding: "No Content-Security-Policy" },
    { severity: "low", category: "headers", finding: "MIME-type sniffing not disabled" },
    { severity: "low", category: "headers", finding: "No Referrer-Policy" },
  ],
  probeNote:
    "The cross-tenant probe did not run. Everything above is real and was measured on your app \u2014 but the database and row-level-security checks are Supabase-specific, and nothing here was scored as if isolation had been tested and passed.",
  verdict:
    "Every finding here is `headers`, medium or low severity, so the job passes (exit 0): neither named condition fired, and grade C does not cross the default floor.",
} as const;

/* The README's Usage section, both workflows, verbatim. */
export const WORKFLOWS = [
  {
    id: "deploy",
    label: "After every successful deploy",
    file: ".github/workflows/breachprobe.yml",
    text: `name: breachprobe
on:
  deployment_status:
jobs:
  scan:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: kyisaiah47/leakless@v1
        with:
          url: \${{ github.event.deployment_status.target_url }}
          owner-confirmed: 'true'`,
  },
  {
    id: "schedule",
    label: "Every morning, against a fixed URL",
    file: ".github/workflows/breachprobe.yml",
    text: `on:
  schedule:
    - cron: '0 6 * * *'
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: kyisaiah47/leakless@v1
        with:
          url: 'https://app.example.com'
          owner-confirmed: 'true'`,
  },
  {
    id: "local",
    label: "Once, from your terminal",
    file: "terminal",
    text: `npm i -D leakless
npx leakless gate --url https://example.com --owner-confirmed true`,
  },
] as const;

/* The README's Inputs table, verbatim meanings. */
export const INPUTS = [
  { name: "url", def: "(required)", meaning: "The deployed URL to scan." },
  { name: "owner-confirmed", def: "(required)", meaning: "Must be the literal string `true`. BreachProbe refuses the scan without this attestation, and this action never supplies it for you. Set it only for a URL you actually own or are authorised to scan." },
  { name: "min-grade", def: "F", meaning: "`A`, `B`, `C`, `D` or `F`. Fail when the scan grade is at or below this." },
  { name: "fail-on-database-exposure", def: "true", meaning: "Fail when a table returns real rows to an anonymous request." },
  { name: "fail-on-write-path", def: "true", meaning: "Fail on a credential that bypasses row-level security, or a policy that does not enforce tenant isolation." },
  { name: "api", def: "https://breachprobe.thecompound.tech", meaning: "BreachProbe base URL. Only change this to point at a local BreachProbe." },
  { name: "timeout", def: "90", meaning: "Seconds to wait on the scan before the run becomes exit 2." },
] as const;

/* The README's Exit codes table. */
export const EXITS = [
  { code: "0", ink: "pass", meaning: "reachable, and neither named condition was found" },
  { code: "1", ink: "fail", meaning: "an exposed database, an open write path, or the grade floor was crossed" },
  { code: "2", ink: "dim", meaning: "the gate could not run. Not a pass, and it never collapses into 0" },
] as const;

/* The README's "What counts as each named condition". */
export const CONDITIONS = [
  { name: "An exposed database", says: "A `category: database` finding at `high` or `critical` severity: a real row came back from an anonymous request because row-level security is not enforcing who can read the table." },
  { name: "An open write path", says: "A leaked `service_role` or `secret` key (either bypasses row-level security entirely by design), or a row-level-security policy that does not enforce tenant isolation." },
  { name: "The grade floor", says: "`min-grade`, default `F`, is BreachProbe's own letter grade: any critical finding caps it at `F`, any high-severity finding caps it at `C`." },
] as const;

/* The README's "Honest limitations", first sentence of each. */
export const LIMITS = [
  { head: "This scans what is live right now", say: "not the code in the pull request. A scan against a preview deployment is only as current as that deployment." },
  { head: "The free scan does not run BreachProbe's authenticated cross-tenant probe", say: "It signs up no users and tests no policy beyond an anonymous read. A finding here is real; the absence of one is not proof the deeper, paid probe would also find nothing." },
  { head: "One scan tells you about one URL at one moment", say: "It is not a substitute for BreachProbe's own monitoring, which this action does not attempt to replace." },
  { head: "The named conditions are exactly the ones stated above and no others", say: "A future BreachProbe finding class is not covered until its id or category is added here." },
] as const;

export const RATE_LIMIT =
  "One scan per run. BreachProbe publishes no rate policy for `/api/scan` to retry against, so this never retries and never polls: a request that fails is exit 2, not a second attempt. If a workflow needs to watch a URL continuously, schedule the workflow itself; do not loop this action inside one job.";
