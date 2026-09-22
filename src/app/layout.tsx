import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const plex = IBM_Plex_Mono({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "leakless. The deployed URL is part of the build check.",
  description: "A GitHub Action that scans a deployed URL with BreachProbe and fails the build on an exposed database or an open write path.",
  metadataBase: new URL("https://leakless.thecompound.tech"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "leakless", url: "https://leakless.thecompound.tech", publisher: { "@type": "Organization", "@id": "https://thecompound.tech/#organization", name: "Compound Labs", url: "https://thecompound.tech" } };
  return <html lang="en" className={plex.variable}><body><SmoothScroll />{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></body></html>;
}
