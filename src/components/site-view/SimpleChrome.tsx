'use client';

import Link from 'next/link';
import { PRODUCT } from '@/lib/product';
import ViewControls from './ViewControls';

const NAV = [
  { href: '/#start', label: 'Add it' },
  { href: '/#example', label: 'Example' },
  { href: '/#fails', label: 'What fails' },
  { href: '/#questions', label: 'Help' },
];

export function SimpleHeader() {
  return (
    <header className="sv-nav">
      <div className="sv-in">
        <Link className="sv-brand" href="/" aria-label="leakless home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={24} height={24} />
          {PRODUCT.name}
        </Link>
        <nav aria-label="Main navigation">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
          <a href={PRODUCT.repo} rel="noopener">GitHub <span aria-hidden="true">{'↗'}</span></a>
        </nav>
      </div>
    </header>
  );
}

/* The studio credit travels with the Simple footer: the Built by mark with its alt, the
 * copyright sentence and the contact address. The publisher @id is in the layout. */
export function SimpleFooter() {
  return (
    <footer className="sv-footer">
      <div className="sv-in">
        <div className="sv-footer-main">
          <nav aria-label="Footer">
            <a href={PRODUCT.repo} rel="noopener">Source on GitHub</a>
            <a href={`${PRODUCT.repo}/blob/main/action.yml`} rel="noopener">action.yml</a>
            <a href={`${PRODUCT.repo}/blob/main/LICENSE`} rel="noopener">MIT licence</a>
            <a href="https://breachprobe.thecompound.tech" rel="noopener">BreachProbe</a>
            <a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a>
          </nav>
          <div className="sv-footer-credit">
            <a className="sv-credit" href={`https://thecompound.tech/?utm_source=${PRODUCT.slug}&utm_medium=studio_credit`} rel="noopener">
              Built by
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} />
            </a>
            <span>© 2026 leakless. A Compound Labs product.</span>
          </div>
        </div>
        <ViewControls />
      </div>
    </footer>
  );
}
