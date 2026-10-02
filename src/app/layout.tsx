import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import { PRODUCT } from "@/lib/product";
import SiteViewProvider from "@/components/site-view/SiteViewProvider";
import Analytics from "@/components/Analytics";

const plex = IBM_Plex_Mono({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: PRODUCT.headline,
  description: PRODUCT.blurb,
  metadataBase: new URL(`https://${PRODUCT.host}`),
  alternates: { canonical: `https://${PRODUCT.host}/` },
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: `${PRODUCT.name}: Fails the build on an exposed database`,
    description: `A GitHub Action that runs BreachProbe on a deployed URL. ${PRODUCT.blurb}`,
    url: `https://${PRODUCT.host}/`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: PRODUCT.name, description: "A GitHub Action that runs BreachProbe on a deployed URL." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareSourceCode", name: PRODUCT.name, url: `https://${PRODUCT.host}`, description: PRODUCT.blurb, codeRepository: PRODUCT.repo, version: PRODUCT.version, license: "https://spdx.org/licenses/MIT.html", publisher: { "@type": "Organization", "@id": "https://thecompound.tech/#organization", name: "Compound Labs", url: "https://thecompound.tech" } };
  return <html lang="en" className={plex.variable}><body><Analytics /><SmoothScroll /><SiteViewProvider>{children}</SiteViewProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></body></html>;
}
