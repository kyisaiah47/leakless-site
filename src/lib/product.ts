export const PRODUCT = {
  name: "leakless",
  slug: "leakless",
  host: "leakless.thecompound.tech",
  repo: "https://github.com/kyisaiah47/leakless",
  version: "0.1.0",
  headline: "A GitHub Action that scans a deployed URL with BreachProbe and fails the build on an exposed database or an open write path.",
  blurb: "A GitHub Action that scans a deployed URL with BreachProbe and fails the build on an exposed database or an open write path.",
  accent: "#C8B14F",
  readAt: "2026-09-25",
} as const;

export type GateMode = "default" | "grade" | "reachability";

export const SOURCES = [
  { id: "purpose", cite: "README / purpose", quote: "A GitHub Action that scans a deployed URL with BreachProbe and fails the build on an exposed database or an open write path.", url: "https://github.com/kyisaiah47/leakless#readme", read_at: "2026-09-25" },
  { id: "green-suite", cite: "README / why", quote: "A green test suite proves the code you wrote compiles and does what its own tests expect.", url: "https://github.com/kyisaiah47/leakless#readme", read_at: "2026-09-25" },
  { id: "live-system", cite: "README / why", quote: "That is a property of the running system, not of the source, and nothing else in CI checks it.", url: "https://github.com/kyisaiah47/leakless#readme", read_at: "2026-09-25" },
  { id: "one-scan", cite: "README / rate limits", quote: "One scan per run.", url: "https://github.com/kyisaiah47/leakless#rate-limits", read_at: "2026-09-25" },
  { id: "no-retry", cite: "README / rate limits", quote: "this never retries and never polls: a request that fails is exit 2, not a second attempt.", url: "https://github.com/kyisaiah47/leakless#rate-limits", read_at: "2026-09-25" },
  { id: "owner", cite: "action.yml / owner", quote: "Must be the literal string \"true\".", url: "https://github.com/kyisaiah47/leakless/blob/main/action.yml", read_at: "2026-09-25" },
  { id: "grade", cite: "README / inputs", quote: "Fail when the scan grade is at or below this.", url: "https://github.com/kyisaiah47/leakless#inputs", read_at: "2026-09-25" },
  { id: "timeout", cite: "README / inputs", quote: "Seconds to wait on the scan before the run becomes exit 2.", url: "https://github.com/kyisaiah47/leakless#inputs", read_at: "2026-09-25" },
  { id: "exit-2", cite: "README / exit codes", quote: "2 covers an unreachable target as much as a BreachProbe outage.", url: "https://github.com/kyisaiah47/leakless#exit-codes", read_at: "2026-09-25" },
  { id: "database", cite: "README / named condition", quote: "An exposed database is a category: database finding at high or critical severity.", url: "https://github.com/kyisaiah47/leakless#what-counts-as-each-named-condition", read_at: "2026-09-25" },
  { id: "write-path", cite: "README / named condition", quote: "An open write path is a leaked service_role or secret key, or a row-level-security policy that does not enforce tenant isolation.", url: "https://github.com/kyisaiah47/leakless#what-counts-as-each-named-condition", read_at: "2026-09-25" },
  { id: "limitation", cite: "README / limitation", quote: "This scans what is live right now, not the code in the pull request.", url: "https://github.com/kyisaiah47/leakless#honest-limitations", read_at: "2026-09-25" },
  { id: "cross-tenant", cite: "README / limitation", quote: "The free scan does not run BreachProbe's authenticated cross-tenant probe.", url: "https://github.com/kyisaiah47/leakless#honest-limitations", read_at: "2026-09-25" },
  { id: "runtime", cite: "package.json / engines", quote: "node: >=18", url: "https://github.com/kyisaiah47/leakless/blob/main/package.json", read_at: "2026-09-25" },
  { id: "dependencies", cite: "package.json / dependencies", quote: "dependencies: {}", url: "https://github.com/kyisaiah47/leakless/blob/main/package.json", read_at: "2026-09-25" },
  { id: "license-file", cite: "package.json / license", quote: "license: MIT", url: "https://github.com/kyisaiah47/leakless/blob/main/package.json", read_at: "2026-09-25" },
  { id: "license", cite: "README / licence", quote: "MIT. Built and used in production by Compound Labs.", url: "https://github.com/kyisaiah47/leakless#licence", read_at: "2026-09-25" },
  { id: "output", cite: "README / outputs", quote: "The scan score, 0 to 100, empty when unreachable.", url: "https://github.com/kyisaiah47/leakless#outputs", read_at: "2026-09-25" },
  { id: "exit-zero", cite: "README / exit codes", quote: "0 reachable, and neither named condition was found", url: "https://github.com/kyisaiah47/leakless#exit-codes", read_at: "2026-09-25" },
  { id: "exit-one", cite: "README / exit codes", quote: "1 an exposed database, an open write path, or the grade floor was crossed", url: "https://github.com/kyisaiah47/leakless#exit-codes", read_at: "2026-09-25" },
  { id: "exit-two", cite: "README / exit codes", quote: "2 the gate could not run. Not a pass, and it never collapses into 0", url: "https://github.com/kyisaiah47/leakless#exit-codes", read_at: "2026-09-25" },
  { id: "no-dependencies", cite: "README / local use", quote: "No build step, no bundler, zero runtime dependencies.", url: "https://github.com/kyisaiah47/leakless#local-use", read_at: "2026-09-25" },
] as const;

export const ROUTES = ["/"] as const;
