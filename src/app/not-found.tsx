"use client";

import Link from "next/link";
import PageViews from "@/components/site-view/PageViews";
import { SimpleNotFound } from "@/components/site-view/SimpleHome";
import ViewControls from "@/components/site-view/ViewControls";

/* THE 404, in both views. The site is one page, so both views point back to it. */
export default function NotFound() {
  return (
    <PageViews
      simpleView={<SimpleNotFound />}
      consoleView={
        <main>
          <header className="masthead"><Link className="brand" href="/"><span className="brand-mark"><img src="/icon.svg" alt="" width={22} height={22} /></span><strong>leakless</strong></Link></header>
          <section className="headband"><div className="claim"><p className="eyebrow">404</p><h1>This page does not exist.</h1><p className="lede">Go back to <Link href="/">the gate</Link>, <Link href="/#contract">the contract</Link> or <Link href="/#sources">the sources</Link>.</p></div></section>
          <footer className="console-foot"><span>© 2026 leakless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a><ViewControls /></footer>
        </main>
      }
    />
  );
}
