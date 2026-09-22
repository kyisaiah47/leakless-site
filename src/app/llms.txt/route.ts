import { ROUTES } from "@/lib/product";
export function GET() { return new Response(`# leakless\n\nA GitHub Action that scans a deployed URL with BreachProbe and fails the build on an exposed database or an open write path.\n\nRoutes:\n${ROUTES.map((route) => `- https://leakless.thecompound.tech${route}`).join("\n")}\n\nSource: https://github.com/kyisaiah47/leakless\n`); }
