# leakless-site: Simple view review

Built on `main` on 2026-10-01 from `5f341dd`. Blueprint: `compound-ops/standards/SIMPLE-VIEW-BLUEPRINT.md`.
Not deployed by this change. The 00:30 sweep deploys `main`.

## Truth map (blueprint 2.A)

Sources read: `src/app/page.tsx`, `src/lib/product.ts`, `src/app/layout.tsx`, `src/app/globals.css`,
and the package README at github.com/kyisaiah47/leakless, read on 2026-10-01 into `src/lib/example.ts`.

| Field | Value | Source |
| --- | --- | --- |
| Primary user | Someone who deploys an app from a GitHub repo and wants CI to catch a leaking live app | README, opening paragraphs |
| Problem | A green test suite says nothing about whether the deployed app hands real rows to an anonymous request or ships a key that bypasses row-level security | README |
| Input | A workflow in the repo with `url` and `owner-confirmed: 'true'`, or one `npx leakless gate` command | README, Usage and Local use |
| Action | Pick when it runs, copy the workflow or command | `WORKFLOWS` in `src/lib/example.ts` |
| Output | A job report with score, grade and findings, and exit 0, 1 or 2 | README, What it looks like and Exit codes |
| Free / paid | Free, MIT. It runs BreachProbe's free scan. BreachProbe's authenticated cross-tenant probe is paid and is not run | README, Honest limitations |
| Timing | One scan per run, default timeout 90 seconds | README, Inputs and Rate limits |
| Limits | Four stated limitations | `LIMITS` |
| Permissions | `owner-confirmed` must be the literal `true`; the Action never sets it | README, Inputs |
| Failure states | Exit 2 means the gate could not run; it never reads as a pass | `EXITS` |
| Recovery | No account. A new 404 page has recovery links in both views | `src/app/not-found.tsx` |
| Shared state | The picked workflow lives in the provider's in-memory map | `useViewState('simple:workflow')` |

How it differs from CiteRank: there is no input field, request or checkout. The action card holds
the product's real first action, a workflow or command to copy, chosen with a themed listbox.
The example is the README's own real run against example.com, read rather than invented. The
paid step is a plain statement that the Action is free.

## Route inventory (blueprint 2.E)

| Route | Class | Simple surface |
| --- | --- | --- |
| `/` | curated | `SimpleHome`: hero, workflow card, README example with findings disclosure, what fails the build, exit codes, cost, questions, next steps |
| 404 | recovery | new `src/app/not-found.tsx`: `SimpleNotFound` and a Console 404 |
| `/llms.txt`, `/robots.txt`, `/sitemap.xml`, images | machine | unchanged |

The site has one page. There is no pricing, help, dashboard or account route. Help sits on the
Simple home as disclosures.

## Mechanics

- `src/components/site-view/SiteViewProvider.tsx`: `leakless:view`, `leakless:welcome-off`. URL
  `?view=` beats saved beats Console. Every storage access is in try/catch.
- `Welcome.tsx`: native dialog, opens on `/` unless suppressed or `?welcome=0`; `data-lenis-prevent`
  so Lenis leaves its scroll alone.
- `ViewControls.tsx` sits in the Simple footer and the Console footer (`footer.console-foot`).
- `ThemedSelect.tsx` is the custom listbox; there is no native select.
- Console markup is unchanged apart from the footer controls. `page.tsx` keeps the strings
  `scripts/check-register.mjs` reads.
- The Open Graph title's em dash became a colon, because the register gate refused it.

## Verification receipt, 2026-10-01

- `npx tsc --noEmit`: clean.
- `npx eslint src`: 0 errors (pre-existing `no-img-element` warnings only).
- `npm run check`: 10 of 10 pass. It failed before this change on the em dash in `layout.tsx`.
- `npm run build`: passes.
- `node scripts/verify-simple.mjs`: 37 of 37 pass at 1440 and 390, against `devserver leakless-site`
  on port 3306. Every off-localhost request is aborted; the mailto anchor is guarded.
- `contrast.mjs` on `/?view=simple&welcome=0` at 1440: 0 findings.
- Not verified: Safari rendering (Chromium only), and a real GitHub Actions run of the copied workflow.

Screens: `compound-ops/standards/simple-view-ref/review/leakless-site-{welcome,simple,simple-select-open,simple-example-open,simple-404,console}-1440.png`.
