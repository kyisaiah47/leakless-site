import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "leakless.kynth.studio" }],
        destination: "https://leakless.thecompound.tech/:path*",
        permanent: true,
      },
    ];
  },
  /* The dev badge paints over the page's bottom left corner and lands in every shot
   * scripts/shoot.mjs takes, so a capture of localhost stops being a capture of the page. */
  devIndicators: false,
};

export default nextConfig;
