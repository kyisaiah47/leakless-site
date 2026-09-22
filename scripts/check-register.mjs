#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const ok = (name, detail) => checks.push([name, true, detail]);
const fail = (name, detail) => checks.push([name, false, detail]);
const files = [];
const walk = (dir) => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { if (["node_modules", ".next", ".next-stale-check", ".git", "reference-shots", "review", "AGENTS.md", "CLAUDE.md"].includes(entry.name)) continue; const full = path.join(dir, entry.name); if (entry.isDirectory()) walk(full); else files.push(full); } };
walk(root);
const source = read("src/lib/product.ts");
const css = read("src/app/globals.css");
const page = read("src/app/page.tsx");
const layout = read("src/app/layout.tsx");

for (const [file, body] of files.map((file) => [path.relative(root, file), fs.readFileSync(file, "utf8")])) /[\u2014\u2013\u2015\u2212]/u.test(body) ? fail("no wide dash", file) : null;
css.includes("--accent:#C8B14F") && css.includes("--accent-hover:#DBC463") ? ok("accent", "declared in the register") : fail("accent", "accent declaration missing");
css.includes("74 existing accent pairs") && css.includes("12 is not the floor") ? ok("ring clause", "estate ring note recorded") : fail("ring clause", "estate ring note missing");
css.includes(".frame::before") && css.includes(".frame::after") ? ok("grid lines", "painted on the frame") : fail("grid lines", "frame lines missing");
read("src/components/SmoothScroll.tsx").includes("allowNestedScroll") ? ok("lenis", "nested scrolling enabled") : fail("lenis", "nested scrolling missing");
layout.includes("publisher") ? ok("credit entity", "JSON-LD publisher present") : fail("credit entity", "JSON-LD publisher missing");
page.includes("Built by") && page.includes("hello@thecompound.tech") && page.includes('alt="Compound Labs"') ? ok("credit", "mark, copyright area, and contact present") : fail("credit", "credit layers missing");
page.includes("NumberFlow") ? ok("number flow", "changing figures use NumberFlow") : fail("number flow", "NumberFlow missing");
const entries = [...source.matchAll(/id: "([^"]+)"[\s\S]*?quote: "([^"]+?)"[\s\S]*?url: "(https?:[^\"]+)"[\s\S]*?read_at: "(\d{4}-\d{2}-\d{2})"/g)];
entries.length >= 10 ? ok("sources", `${entries.length} claims recorded`) : fail("sources", `${entries.length} claims recorded`);
page.includes("SOURCES") ? ok("sources rendered", "source register is rendered") : fail("sources rendered", "source register not rendered");
files.some((file) => file.endsWith("public/brand/compound-labs.svg")) ? ok("mark", "brand asset present") : fail("mark", "brand asset missing");
for (const [name, passed, detail] of checks) console.log(`${passed ? "PASS" : "FAIL"} ${name}: ${detail}`);
if (checks.some(([, passed]) => !passed)) process.exit(1);
