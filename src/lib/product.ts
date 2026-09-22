export const PRODUCT = {
  name: "leakless",
  slug: "leakless",
  host: "leakless.thecompound.tech",
  repo: "https://github.com/kyisaiah47/leakless",
  version: "0.1.0",
  accent: "#C8B14F",
  readAt: "2026-09-22",
} as const;

export type GateMode = "default" | "grade" | "reachability";

export const SOURCES = [
  { id: "purpose", cite: "README / purpose", quote: "A GitHub Action that scans a deployed URL with BreachProbe and fails the build on an exposed database or an open write path.", url: "https://github.com/kyisaiah47/leakless#readme", read_at: "2026-09-22" },
  { id: "green-suite", cite: "README / why", quote: "A green test suite proves the code you wrote compiles and does what its own tests expect.", url: "https://github.com/kyisaiah47/leakless#readme", read_at: "2026-09-22" },
  { id: "live-system", cite: "README / why", quote: "That is a property of the running system, not of the source, and nothing else in CI checks it.", url: "https://github.com/kyisaiah47/leakless#readme", read_at: "2026-09-22" },
  { id: "one-scan", cite: "README / rate limits", quote: "One scan per run.", url: "https://github.com/kyisaiah47/leakless#rate-limits", read_at: "2026-09-22" },
  { id: "no-retry", cite: "README / rate limits", quote: "this never retries and never polls: a request that fails is exit 2, not a second attempt.", url: "https://github.com/kyisaiah47/leakless#rate-limits", read_at: "2026-09-22" },
  { id: "owner", cite: "action.yml / owner", quote: "Must be the literal string \"true\".", url: "https://github.com/kyisaiah47/leakless/blob/main/action.yml", read_at: "2026-09-22" },
  { id: "grade", cite: "README / inputs", quote: "Fail when the scan grade is at or below this.", url: "https://github.com/kyisaiah47/leakless#inputs", read_at: "2026-09-22" },
  { id: "exit-2", cite: "README / exit codes", quote: "2 covers an unreachable target as much as a BreachProbe outage.", url: "https://github.com/kyisaiah47/leakless#exit-codes", read_at: "2026-09-22" },
  { id: "database", cite: "README / named condition", quote: "An exposed database is a category: database finding at high or critical severity.", url: "https://github.com/kyisaiah47/leakless#what-counts-as-each-named-condition", read_at: "2026-09-22" },
  { id: "write-path", cite: "README / named condition", quote: "An open write path is a leaked service_role or secret key, or a row-level-security policy that does not enforce tenant isolation.", url: "https://github.com/kyisaiah47/leakless#what-counts-as-each-named-condition", read_at: "2026-09-22" },
  { id: "limitation", cite: "README / limitation", quote: "This scans what is live right now, not the code in the pull request.", url: "https://github.com/kyisaiah47/leakless#honest-limitations", read_at: "2026-09-22" },
  { id: "license", cite: "README / licence", quote: "MIT. Built and used in production by Compound Labs.", url: "https://github.com/kyisaiah47/leakless#licence", read_at: "2026-09-22" },
] as const;

export const ROUTES = ["/"] as const;
