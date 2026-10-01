'use client';

/* START HERE. What leakless does, one labelled illustration of its output, and the choice of
 * view. Opens by itself on `/` unless the visitor turned it off or `?welcome=0` is present.
 * Closing or choosing never turns it off; the checkbox does. The illustration is the README's
 * own example run, never an invented result. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { EXAMPLE } from '@/lib/example';
import { useSiteView, WELCOME_EVENT, WELCOME_OFF_KEY, type SiteView } from './SiteViewProvider';

function readOff(): boolean {
  try {
    return localStorage.getItem(WELCOME_OFF_KEY) === '1';
  } catch {
    return false; /* storage blocked: treat as not suppressed */
  }
}

export default function Welcome() {
  const mode = useSiteView();
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [off, setOff] = useState(false);
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOff(readOff());
    const el = dialog.current;
    if (!el) return;
    if (!el.open) {
      previous.current = document.activeElement as HTMLElement | null;
      el.showModal();
    }
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    if (timer.current) clearTimeout(timer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => {
      dialog.current?.close();
      const back = previous.current;
      if (back && back.isConnected && back !== document.body) back.focus();
      else document.querySelector<HTMLElement>('#start .sv-select-btn, .sv-brand, .brand')?.focus({ preventScroll: true });
    }, reduced ? 0 : 220);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // The dialog opens from browser-only facts (storage and the URL), so it opens after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (path === '/' && !readOff() && q.get('welcome') !== '0') show();
    window.addEventListener(WELCOME_EVENT, show);
    return () => {
      window.removeEventListener(WELCOME_EVENT, show);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [path, show]);

  function select(view: SiteView) {
    mode?.choose(view);
    close();
  }

  return (
    <dialog
      ref={dialog}
      className="sv-welcome"
      data-visible={visible}
      data-lenis-prevent
      aria-labelledby="sv-welcome-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <header className="sv-welcome-top">
        <span className="sv-brand-static">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={20} height={20} />
          leakless <small>/ START HERE</small>
        </span>
        <button type="button" className="sv-close" aria-label="Close welcome" onClick={close} autoFocus>
          ×
        </button>
      </header>
      <div className="sv-welcome-intro">
        <h2 id="sv-welcome-title">Would your build stop if your live app leaked its database?</h2>
        <p>
          leakless is a GitHub Action. It scans the deployed URL with BreachProbe after a deploy. It fails the build on an
          exposed database or an open write path.
        </p>
      </div>
      <section className="sv-illustration" aria-label="Illustration of one leakless run">
        <div className="sv-illustration-top">
          <span>ONE DEPLOY. ONE SCAN.</span>
          <span>ILLUSTRATION · README EXAMPLE</span>
        </div>
        <p>A deploy of {EXAMPLE.host} finished. The Action scanned it once.</p>
        <p className="sv-illustration-answer">
          Scanned {EXAMPLE.host}: {EXAMPLE.score}/100, grade {EXAMPLE.grade}. Header gaps only, so the job passes.
          <strong>EXIT {EXAMPLE.exit}</strong>
        </p>
        <p>An exposed database or a leaked service_role key would print on the run and fail the job.</p>
      </section>
      <section className="sv-welcome-choose">
        <div>
          <h3>How would you like to explore?</h3>
          <p>You can switch anytime.</p>
        </div>
        <div className="sv-choices">
          <button type="button" onClick={() => select('console')}>
            <span>
              ▦ <b>Console</b>
              <span aria-hidden="true">↗</span>
            </span>
            <strong>See more at once.</strong>
            <span>A compact layout with more data and controls on screen.</span>
          </button>
          <button type="button" onClick={() => select('simple')}>
            <span>
              ☰ <b>Simple</b>
              <span aria-hidden="true">↗</span>
            </span>
            <strong>Start with the essentials.</strong>
            <span>A roomier overview with details you can open as you go.</span>
          </button>
        </div>
      </section>
      <footer>
        <label>
          <input
            type="checkbox"
            checked={off}
            onChange={(e) => {
              const value = e.target.checked;
              setOff(value);
              try {
                if (value) localStorage.setItem(WELCOME_OFF_KEY, '1');
                else localStorage.removeItem(WELCOME_OFF_KEY);
              } catch {
                /* storage blocked: the choice lasts this visit */
              }
            }}
          />
          Don&rsquo;t open this when I come back
        </label>
      </footer>
    </dialog>
  );
}
