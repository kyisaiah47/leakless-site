'use client';

import Link from 'next/link';
import { PRODUCT } from '@/lib/product';
import { EXAMPLE, EXAMPLE_COMMAND, EXAMPLE_URL, WORKFLOWS, INPUTS, EXITS, CONDITIONS, LIMITS, RATE_LIMIT } from '@/lib/example';
import { SimpleHeader, SimpleFooter } from './SimpleChrome';
import Disclosure from './Disclosure';
import ThemedSelect from './ThemedSelect';
import CopyBlock from './CopyBlock';
import Code from './Code';
import { useViewState } from './SiteViewProvider';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* THE SIMPLE HOME. Outcome, the one action, the readable example, what fails the build, the
 * cost, next steps. Every finding, input, exit code and limit is read from lib/example.ts,
 * which holds the README's own words. */
export default function SimpleHome() {
  const [picked, setPicked] = useViewState<string>('simple:workflow', WORKFLOWS[0].id);
  const workflow = WORKFLOWS.find((w) => w.id === picked) ?? WORKFLOWS[0];
  const severities = new Set(EXAMPLE.findings.map((f) => f.severity));
  const categories = new Set(EXAMPLE.findings.map((f) => f.category));

  return (
    <>
      <SimpleHeader />
      <main className="sv-main">
        <div className="sv-in">
          <section className="sv-hero">
            <div className="sv-pitch">
              <span className="sv-label">GITHUB ACTION · DEPLOYED URL</span>
              <h1>The Action fails the build when your live app leaks data.</h1>
              <p>
                Your tests check the code you wrote. leakless checks the app you deployed. It scans the live URL with
                BreachProbe and fails the build on an exposed database or an open write path.
              </p>
              <p className="sv-qualifier">
                leakless uses the MIT licence. It requires Node 18 or newer. It has zero runtime dependencies. Scan only a URL you own or are authorised to scan.
              </p>
            </div>

            <div className="sv-card sv-action" id="start">
              <div className="sv-step"><span>01 / ADD IT TO A REPO</span><span>FREE</span></div>
              <h2>Choose when it runs, then copy it.</h2>
              <p>Paste a workflow into your repo, or run it once from a terminal. Each run makes one scan.</p>
              <ThemedSelect
                label="When it runs"
                options={WORKFLOWS.map((w) => ({ value: w.id, label: w.label }))}
                value={workflow.id}
                onChange={setPicked}
              />
              <CopyBlock text={workflow.text} file={workflow.file} />
              <p className="sv-terms">
                You do not need an account. <code>owner-confirmed: &apos;true&apos;</code> is required, and the Action never sets it for you.
              </p>
            </div>
          </section>

          <section className="sv-section" id="example" aria-labelledby="sv-see">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">02 / WHAT YOU&apos;LL SEE</span>
                <h2 id="sv-see">Each run returns a pass or a fail that you can read.</h2>
              </div>
              <p>Each run writes a short report on the job. Open the findings when you want the detail.</p>
            </div>

            <div className="sv-card sv-result">
              <div className="sv-step"><span>EXAMPLE RESULT</span><span>From the leakless README</span></div>
              <h3>
                The job passes. {EXAMPLE.host} scored {EXAMPLE.score}/100, received grade {EXAMPLE.grade}, and triggered neither named condition.
              </h3>
              <p>
                The scan returned {EXAMPLE.findings.length} findings. All findings are {[...categories].join(', ')} findings at {[...severities].join(' or ')} severity. The run ends with exit {EXAMPLE.exit}.
              </p>
              <Disclosure title={`See the ${EXAMPLE.findings.length} findings`}>
                <ul className="sv-findings">
                  {EXAMPLE.findings.map((f) => (
                    <li key={f.finding}>
                      <span className="sv-sev" data-sev={f.severity}>{f.severity}</span>
                      <p>{f.finding}</p>
                      <code>{f.category}</code>
                    </li>
                  ))}
                </ul>
              </Disclosure>
              <Disclosure title="Why this run passes">
                <p><Code text={EXAMPLE.verdict} /></p>
                <p>{EXAMPLE.probeNote}</p>
              </Disclosure>
              <p className="sv-note">
                This is the README&apos;s example run, <code>{EXAMPLE_COMMAND}</code>, against the live BreachProbe. It
                is not a scan of your app. <a href={EXAMPLE_URL} rel="noopener">Read it in the README ↗</a>
              </p>
            </div>
          </section>

          <section className="sv-section" id="fails" aria-labelledby="sv-fails">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">03 / WHAT FAILS THE BUILD</span>
                <h2 id="sv-fails">Three checks fail the job.</h2>
              </div>
              <p>Each named check is its own input, so you can turn either one off. The grade floor applies to both.</p>
            </div>
            <div className="sv-conditions">
              {CONDITIONS.map((c) => (
                <article className="sv-card" key={c.name}>
                  <h3>{c.name}</h3>
                  <p><Code text={c.says} /></p>
                </article>
              ))}
            </div>
            <div className="sv-exits">
              <h3>What each exit code means</h3>
              <ul>
                {EXITS.map((e) => (
                  <li key={e.code}>
                    <b data-ink={e.ink}>{e.code}</b>
                    <p>{cap(e.meaning)}.</p>
                  </li>
                ))}
              </ul>
              <p className="sv-note">An unreachable URL produces exit 2. The Action never reports it as a pass.</p>
            </div>
          </section>

          <section className="sv-section" id="cost" aria-labelledby="sv-cost">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">04 / WHAT IT COSTS</span>
                <h2 id="sv-cost">The Action is free.</h2>
              </div>
              <p>
                leakless has an MIT licence. It runs BreachProbe&apos;s free scan. It does not run BreachProbe&apos;s paid, authenticated cross-tenant probe.
              </p>
            </div>
          </section>

          <section className="sv-section" id="questions" aria-labelledby="sv-questions">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">05 / QUESTIONS</span>
                <h2 id="sv-questions">Useful answers</h2>
              </div>
              <p>Read these answers before you add the Action to a repo.</p>
            </div>
            <Disclosure title="Inputs you can set">
              <ul className="sv-inputs">
                {INPUTS.map((i) => (
                  <li key={i.name}>
                    <code>{i.name}</code>
                    <p><Code text={i.meaning} /> <span className="sv-def">Default: {i.def}</span></p>
                  </li>
                ))}
              </ul>
            </Disclosure>
            <Disclosure title="Retry behavior after a failed scan">
              <p><Code text={RATE_LIMIT} /></p>
            </Disclosure>
            <Disclosure title="Checks that leakless does not perform">
              <ul className="sv-plain">
                {LIMITS.map((l) => (
                  <li key={l.head}><strong>{l.head}.</strong> {cap(l.say)}</li>
                ))}
              </ul>
            </Disclosure>
            <div className="sv-support">
              <h3>Support</h3>
              <p>
                Email <a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a> with your workflow file and the
                job&apos;s output.
              </p>
            </div>
          </section>

          <nav className="sv-next" aria-label="Next steps">
            <a href={`${PRODUCT.repo}#usage`} rel="noopener">Read the usage guide <span aria-hidden="true">↗</span></a>
            <a href={`${PRODUCT.repo}/blob/main/action.yml`} rel="noopener">Read the Action <span aria-hidden="true">↗</span></a>
            <a href="https://breachprobe.thecompound.tech" rel="noopener">Scan once on BreachProbe <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}

/* The 404, in Simple. */
export function SimpleNotFound() {
  return (
    <>
      <SimpleHeader />
      <main className="sv-main">
        <div className="sv-in">
          <section className="sv-page-head">
            <div>
              <span className="sv-label">404</span>
              <h1>This page does not exist.</h1>
            </div>
            <p>The site has one page. That page contains everything leakless does.</p>
          </section>
          <nav className="sv-next" aria-label="Next steps">
            <Link href="/#start">Add it to a repo <span aria-hidden="true">↗</span></Link>
            <Link href="/#example">See an example run <span aria-hidden="true">↗</span></Link>
            <a href={PRODUCT.repo} rel="noopener">Read the source <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}
