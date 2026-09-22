import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/product";
export default function sitemap(): MetadataRoute.Sitemap { return ROUTES.map((path) => ({ url: `https://leakless.thecompound.tech${path}`, lastModified: new Date("2026-09-22") })); }
