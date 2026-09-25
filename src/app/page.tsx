"use client";

import { useMemo, useState } from "react";
import NumberFlow from "@number-flow/react";
import { GLYPH, type GlyphName } from "@/lib/phosphor";
import { PRODUCT, SOURCES, type GateMode } from "@/lib/product";
import FAMILY from "@/lib/app-family.json";

function Icon({ name, size = 16 }: { name: GlyphName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 256 256" dangerouslySetInnerHTML={{ __html: GLYPH[name] }} />;
}

const modes: { id: GateMode; label: string; figure: number; note: string }[] = [
  { id: "default", label: "Default gate", figure: 2, note: "database exposure and open write path" },
  { id: "grade", label: "Grade floor", figure: 5, note: "the grade threshold underneath both checks" },
  { id: "reachability", label: "Reachability", figure: 1, note: "one request, no retry or poll" },
];

const findings = [
  { icon: "database" as GlyphName, title: "Exposed database", detail: "A database finding at high or critical severity", ink: "fail" },
  { icon: "key" as GlyphName, title: "Open write path", detail: "A service_role key, secret key, or broken tenant policy", ink: "fail" },
  { icon: "gauge" as GlyphName, title: "Grade floor", detail: "The BreachProbe letter grade is at or below min-grade", ink: "caution" },
  { icon: "globe-hemisphere-west" as GlyphName, title: "Could not check", detail: "An unreachable URL or failed scan returns exit 2", ink: "dim" },
];

const exits = [
  { code: "0", label: "reachable, no named condition", ink: "pass" },
  { code: "1", label: "database, write path, or grade floor", ink: "fail" },
  { code: "2", label: "could not check", ink: "dim" },
];

export default function Home() {
  const [mode, setMode] = useState<GateMode>("default");
  const [stripOpen, setStripOpen] = useState(false);
  const selected = modes.find((item) => item.id === mode) ?? modes[0];
  const sample = useMemo(() => mode === "grade" ? { score: 58, grade: "C", findings: 1 } : mode === "reachability" ? { score: 0, grade: "?", findings: 0 } : { score: 71, grade: "C", findings: 5 }, [mode]);

  return <main>
    <div className="top-rule"><span>leakless the gate</span><span>claims read from the package, action and live repository on {PRODUCT.readAt}</span></div>
    <header className="masthead">
      <div className="brand"><span className="brand-mark"><img src="/icon.svg" alt="" width={22} height={22} /></span><strong>leakless</strong><button className="app-switch" aria-label="Open product switcher" onClick={() => setStripOpen((value) => !value)}><Icon name="caret-up-down" size={15} /></button></div>
      <div className="standing">LIVE URL, BUILD GATE</div>
      <nav aria-label="Main navigation"><a className="active" href="#console"><Icon name="terminal-window" />Console</a><a href="#contract"><Icon name="table" />Contract</a><a href="#method"><Icon name="list-checks" />Method</a><a href="#sources"><Icon name="arrow-square-out" />Source</a></nav>
      <div className="live"><span className="dot" /> READ {PRODUCT.readAt}</div>
      <a className="action" href="https://github.com/kyisaiah47/leakless/blob/main/action.yml"><Icon name="arrow-square-out" /> Read the Action</a>
    </header>
    {stripOpen && <div className="switcher"><span className="switch-label">COMPOUND LABS / {FAMILY.label.toUpperCase()}</span>{FAMILY.apps.map((a) => <a key={a.slug} href={a.url} className={a.slug === PRODUCT.slug + '-site' ? 'current' : undefined}><img src={a.logo} alt="" width={16} height={16} />{a.name}</a>)}</div>}
    <div className="folio" aria-label="Package facts"><span><b>0</b> runtime dependencies</span><span><b>1</b> request per run</span><span><b>3</b> exit codes</span><span><b>2</b> named failure paths</span><span><b>90</b> second default timeout</span><span>VERSION <b>0.1.0</b></span><span>SCROLL RIGHT FOR MORE</span></div>

    <section className="headband" id="console"><div className="claim"><p className="eyebrow">GITHUB ACTION / DEPLOYED URL</p><h1>{PRODUCT.headline}</h1><p className="lede">{PRODUCT.blurb}</p></div><aside className="evidence-panel"><div><span>PACKAGE</span><b>kyisaiah47/leakless</b></div><div><span>VERSION</span><b>{PRODUCT.version}</b></div><div><span>RUNTIME</span><b>Node 18 or newer</b></div><div><span>LICENSE</span><b>MIT</b></div><div><span>DEPENDENCIES</span><b>0</b></div></aside></section>

    <section className="controlbar" aria-label="Gate control"><div className="control-row"><span className="control-label"><Icon name="scan" /> RE-READ AS</span>{modes.map((item) => <button key={item.id} className={`chip ${mode === item.id ? "selected" : ""}`} onClick={() => setMode(item.id)}><Icon name={item.id === "grade" ? "gauge" : item.id === "reachability" ? "browsers" : "check-circle"} />{item.label}<NumberFlow value={item.figure} /></button>)}</div><div className="control-note">Pressed state changes the sample figure, the contract rows, and both rails. Scroll right for more. The package makes no retry.</div></section>

    <section className="frame"><aside className="rail rail-left"><p className="rail-title">WHAT CAN FAIL</p>{findings.map((item) => <div className="rail-item" key={item.title}><Icon name={item.icon} /><span>{item.title}<small>{item.detail}</small></span></div>)}<p className="rail-title second">EXIT CODES</p>{exits.map((item) => <div className="exit-row" key={item.code}><b className={`ink-${item.ink}`}>{item.code}</b><span>{item.label}</span></div>)}</aside>
      <div className="track">
        <section className="band sample-band"><div className="band-head"><span className="eyebrow">SAMPLE OUTPUT / {selected.label.toUpperCase()}</span><span className="read">READ FROM README</span></div><h2>Scanned <code>example.com</code>: <NumberFlow value={sample.score} />/100, grade {sample.grade}.</h2><p>A few hardening gaps. No open door we could walk through, but <NumberFlow value={sample.findings} /> things to tighten.</p><div className="severity-line"><span style={{ width: mode === "reachability" ? "0%" : "44%" }} /><span style={{ width: mode === "grade" ? "18%" : "32%" }} /><span style={{ width: mode === "reachability" ? "0%" : "24%" }} /></div><small>THE SAMPLE IS THE README OUTPUT. A LIVE RUN WRITES ITS OWN REPORT.</small></section>
        <section className="band" id="contract"><div className="band-head"><span className="eyebrow">CONTRACT</span><span className="read">ONE SCAN / NO LOOP</span></div><h3>What the Action reads from the running system</h3><div className="table"><div className="table-head"><span>INPUT</span><span>MEANING</span><span>DEFAULT</span></div><div className="table-row"><span><code>url</code></span><span>The deployed URL to scan.</span><span>required</span></div><div className="table-row"><span><code>owner-confirmed</code></span><span>Literal <code>true</code>, for a URL you own or are authorised to scan.</span><span>required</span></div><div className="table-row"><span><code>min-grade</code></span><span>Fail when the scan grade is at or below this.</span><span>F</span></div><div className="table-row"><span><code>timeout</code></span><span>Seconds to wait before the run becomes exit 2.</span><span>90</span></div></div><div className="table-note">SCROLL RIGHT FOR MORE INPUTS</div></section>
        <section className="band" id="method"><div className="band-head"><span className="eyebrow">THE RUN</span><span className="read">ONE REQUEST</span></div><h3>One scan, then the build gets an honest result.</h3><div className="steps"><div><b>01</b><span>POST the URL to BreachProbe.</span></div><div><b>02</b><span>Read <code>score</code>, <code>grade</code>, and <code>findings</code> from its response.</span></div><div><b>03</b><span>Print the job summary, set outputs, and return 0, 1, or 2.</span></div></div></section>
    <section className="band" id="sources"><div className="band-head"><span className="eyebrow">SOURCES</span><span className="read">{SOURCES.length} CLAIMS RE-READ</span></div><h3>Every sentence above comes from the package.</h3><div className="sources">{SOURCES.map((source) => <a key={source.id} href={source.url}><span>{source.cite}</span><small>{source.quote}</small></a>)}</div></section>
      </div>
      <aside className="rail rail-right"><p className="rail-title">THE CONTROL</p><div className="control-card"><span className="eyebrow">{selected.label.toUpperCase()}</span><strong>{selected.figure} <small>conditions in view</small></strong><p>{selected.note}.</p><a href="https://github.com/kyisaiah47/leakless#usage">Read usage <Icon name="arrow-square-out" size={14} /></a></div><p className="rail-title second">HONEST LIMITATIONS</p><p className="rail-copy">The scan is against what is live right now. It does not inspect pull request code.</p><p className="rail-copy">The free scan does not run the authenticated cross-tenant probe.</p><p className="rail-copy">One scan tells you about one URL at one moment.</p><p className="rail-title second">READ THE PACKAGE</p><a className="repo-link" href="https://github.com/kyisaiah47/leakless"><Icon name="arrow-square-out" /> github.com/kyisaiah47/leakless</a></aside></section>
    <footer><div><span>Built by</span><img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={80} height={20} /></div><span>© 2026 leakless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></footer>
  </main>;
}
