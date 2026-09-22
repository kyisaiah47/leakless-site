#!/usr/bin/env node
/* CAPTURE. Everything this site shows that a program produced is captured here, never typed.
 *
 *   node scripts/capture.mjs --scans   re-read the two LIVE BreachProbe responses. Deliberate.
 *   node scripts/capture.mjs           re-run the gate over every frozen scan and every input
 *   node scripts/capture.mjs --check   the same, then byte-compare. Exit 1 on any drift.
 *
 * TWO KINDS OF EVIDENCE, AND THEY ARE FROZEN SEPARATELY.
 *
 * 1. THE SCAN RESPONSES, src/lib/scans.ts. Eight of them. Two came from the live BreachProbe,
 *    the same two hosts leakless's own .github/workflows/ci.yml scans on every push, and they
 *    carry the day they were read. Six are the canned responses the package's own offline suite
 *    ships in test/stub-breachprobe.mjs. A live host answers differently next week, so a scan is
 *    evidence with a read date and is never re-read by a check.
 *
 * 2. THE RUNS, src/lib/runs.ts. Every one is real stdout from `node bin/leakless.mjs gate`, the
 *    same entry point action.yml runs, against a local server replaying one frozen scan. One
 *    live scan therefore produced twenty runs, which is the package's own rule: one scan per
 *    run, no retry and no polling. A run is fully determined by its scan and its inputs, so
 *    --check re-derives all of them and compares bytes.
 *
 * GITHUB_STEP_SUMMARY and GITHUB_OUTPUT are left unset on purpose. src/gh.mjs writes the job
 * summary and the step outputs to stdout when the runner is absent, so what is captured is
 * everything the runner would have been handed, in one stream.
 */
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = process.env.LEAKLESS_PKG || '/Users/admin/CompoundLabs/packages/leakless';
const SCANS_TS = path.join(ROOT, 'src/lib/scans.ts');
const RUNS_TS = path.join(ROOT, 'src/lib/runs.ts');
const MODE = process.argv.includes('--scans') ? 'scans' : process.argv.includes('--check') ? 'check' : 'runs';

if (!fs.existsSync(path.join(PKG, 'bin/leakless.mjs'))) {
  process.stderr.write(`the leakless package is not at ${PKG}, so nothing here can be captured\n`);
  process.exit(1);
}

const GRADES = ['A', 'B', 'C', 'D', 'F'];
const BOOLS = [true, false];
const today = () => new Date().toISOString().slice(0, 10);

/* THE EIGHT SCANS. `live` names a host to POST to BreachProbe; `stub` names a mode of the
 * package's own test/stub-breachprobe.mjs; `transport` is a response that never reaches the
 * gate's JSON path at all. */
const SCANS = [
  { id: 'example-com', kind: 'live', host: 'https://example.com', label: 'example.com', note: "IANA's reserved documentation domain, and the third-party host leakless's own CI scans." },
  { id: 'breachprobe', kind: 'live', host: 'https://breachprobe.thecompound.tech', label: 'breachprobe.thecompound.tech', note: 'A live Compound Labs product, and the required check on leakless’s own CI.' },
  { id: 'clean', kind: 'stub', stub: 'clean', label: 'a clean scan', note: 'test/stub-breachprobe.mjs, mode clean.' },
  { id: 'headers', kind: 'stub', stub: 'headers', label: 'header gaps only', note: 'test/stub-breachprobe.mjs, mode headers.' },
  { id: 'database', kind: 'stub', stub: 'database', label: 'an exposed database', note: 'test/stub-breachprobe.mjs, mode database.' },
  { id: 'writepath', kind: 'stub', stub: 'writepath', label: 'an open write path', note: 'test/stub-breachprobe.mjs, mode writepath.' },
  { id: 'writepath-isolated', kind: 'stub', stub: 'writepath-isolated', label: 'a write path at grade B', note: 'test/stub-breachprobe.mjs, mode writepath-isolated.' },
  { id: 'unreachable', kind: 'stub', stub: 'unreachable', label: 'a host nobody reached', note: 'test/stub-breachprobe.mjs, mode unreachable.' },
];
const TRANSPORT = [
  { id: 'outage', status: 500, body: JSON.stringify({ error: 'stub is down' }), label: 'BreachProbe returned 500', note: 'test/stub-breachprobe.mjs, mode 500.' },
  { id: 'badjson', status: 200, body: 'not json', label: 'a body that is not JSON', note: 'test/stub-breachprobe.mjs, mode badjson.' },
];

const post = (url, body, timeoutMs = 120000) =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  }).then(async (r) => ({ status: r.status, text: await r.text() }));

/* Read one canned response straight out of the package's own stub, by starting it and asking it
 * once. Transcribing it here would make this file a second copy that drifts. */
async function fromStub(mode) {
  const p = spawn(process.execPath, ['test/stub-breachprobe.mjs', mode], { cwd: PKG });
  const base = await new Promise((res, rej) => {
    let buf = '';
    p.stdout.on('data', (c) => { buf += c; if (buf.includes('\n')) res(buf.split('\n')[0].trim()); });
    p.on('error', rej);
    setTimeout(() => rej(new Error(`stub ${mode} never printed a url`)), 8000);
  });
  const r = await post(`${base}/api/scan`, { url: 'https://target.example', ownerConfirmed: true });
  p.kill();
  return JSON.parse(r.text);
}

// ---------------------------------------------------------------- the scans
if (MODE === 'scans') {
  const out = {};
  for (const s of SCANS) {
    if (s.kind === 'live') {
      const r = await post('https://breachprobe.thecompound.tech/api/scan', { url: s.host, ownerConfirmed: true });
      if (r.status !== 200) throw new Error(`BreachProbe returned ${r.status} for ${s.host}`);
      out[s.id] = { ...JSON.parse(r.text), _read_at: today() };
    } else {
      const j = await fromStub(s.stub);
      /* scannedAt is the stub's own clock at the moment it answered. It is the one volatile
       * field, the gate never prints it, and keeping it would make this file differ from itself
       * on every capture. */
      delete j.scannedAt;
      out[s.id] = j;
    }
    process.stdout.write(`  ${s.id.padEnd(20)} ${s.kind}\n`);
  }
  fs.writeFileSync(
    SCANS_TS,
    `// GENERATED by scripts/capture.mjs --scans. Do not edit.\n` +
      `// The two live responses came from POST https://breachprobe.thecompound.tech/api/scan and\n` +
      `// carry their own _read_at. The six others are the canned responses the package's offline\n` +
      `// suite ships in test/stub-breachprobe.mjs, read by starting that stub and asking it once.\n` +
      `export const SCAN_JSON = ${JSON.stringify(out, null, 1)} as const;\n`,
  );
  process.stdout.write(`\nwrote src/lib/scans.ts, ${SCANS.length} scans\n`);
  process.exit(0);
}

// ---------------------------------------------------------------- the runs
if (!fs.existsSync(SCANS_TS)) {
  process.stderr.write('src/lib/scans.ts does not exist yet. Run: node scripts/capture.mjs --scans\n');
  process.exit(1);
}
const frozen = JSON.parse(/export const SCAN_JSON = ([\s\S]*?) as const;/.exec(fs.readFileSync(SCANS_TS, 'utf8'))[1]);

/* One server, replaying whatever the current case asks for. The gate cannot tell it from
 * BreachProbe, which is the point: the run is the real entry point's real output. */
let serve = { status: 200, body: '{}' };
const server = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    res.writeHead(serve.status, { 'content-type': 'application/json' });
    res.end(serve.body);
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const API = `http://127.0.0.1:${server.address().port}`;

const blobs = [];
const blobIndex = new Map();
const runs = {};
const intern = (s) => {
  if (!blobIndex.has(s)) { blobIndex.set(s, blobs.length); blobs.push(s); }
  return blobIndex.get(s);
};

const cases = [
  ...SCANS.map((s) => ({ id: s.id, url: frozen[s.id].url || 'https://target.example', status: 200, body: JSON.stringify(frozen[s.id]) })),
  ...TRANSPORT.map((t) => ({ id: t.id, url: 'https://target.example', status: t.status, body: t.body })),
];

for (const c of cases) {
  serve = { status: c.status, body: c.body };
  for (const grade of GRADES) {
    for (const db of BOOLS) {
      for (const wp of BOOLS) {
        const env = {
          PATH: process.env.PATH, HOME: process.env.HOME,
          LEAKLESS_API: API,
          LEAKLESS_URL: c.url,
          LEAKLESS_OWNER_CONFIRMED: 'true',
          LEAKLESS_MIN_GRADE: grade,
          LEAKLESS_FAIL_ON_DATABASE: String(db),
          LEAKLESS_FAIL_ON_WRITE_PATH: String(wp),
          RUNNER_TEMP: path.join(ROOT, '.capture-tmp'),
        };
        fs.mkdirSync(env.RUNNER_TEMP, { recursive: true });
        let stdout = '';
        let exit = 0;
        try {
          stdout = execFileSync(process.execPath, ['bin/leakless.mjs', 'gate'], { cwd: PKG, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        } catch (e) {
          exit = e.status ?? 2;
          stdout = (e.stdout || '') + (e.stderr || '');
        }
        /* RUNNER_TEMP is this machine's path and it lands in the report-path line. The site is
         * about what the gate decides, not about where this laptop put a file, so the one
         * machine-local string is replaced by the variable the runner itself sets. */
        stdout = stdout.split(env.RUNNER_TEMP).join('$RUNNER_TEMP');
        runs[`${c.id}|${grade}|${db ? 1 : 0}|${wp ? 1 : 0}`] = { exit, out: intern(stdout.trimEnd()) };
      }
    }
  }
  process.stdout.write(`  ${c.id.padEnd(20)} ${GRADES.length * 4} runs\n`);
}
server.close();
fs.rmSync(path.join(ROOT, '.capture-tmp'), { recursive: true, force: true });

const body =
  `// GENERATED by scripts/capture.mjs. Do not edit.\n` +
  `// Every string in OUT is real stdout from \`node bin/leakless.mjs gate\`, the same entry point\n` +
  `// action.yml runs, against a local server replaying one frozen response from src/lib/scans.ts.\n` +
  `// A run is fully determined by its scan and its four inputs, so \`npm run check\` re-derives\n` +
  `// every one of them and compares bytes.\n` +
  `export const OUT: string[] = ${JSON.stringify(blobs, null, 1)};\n` +
  `// key: "<scan id>|<min-grade>|<fail-on-database 1|0>|<fail-on-write-path 1|0>"\n` +
  `export const RUNS: Record<string, { exit: number; out: number }> = ${JSON.stringify(runs, null, 1)};\n`;

if (MODE === 'check') {
  const have = fs.existsSync(RUNS_TS) ? fs.readFileSync(RUNS_TS, 'utf8') : '';
  if (have === body) {
    process.stdout.write(`\n${Object.keys(runs).length} runs re-derived, byte identical\n`);
    process.exit(0);
  }
  process.stderr.write('\nsrc/lib/runs.ts is not what the gate prints today\n');
  process.exit(1);
}
fs.writeFileSync(RUNS_TS, body);
process.stdout.write(`\nwrote src/lib/runs.ts, ${Object.keys(runs).length} runs, ${blobs.length} distinct outputs\n`);
