import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* The dev badge paints over the page's bottom left corner and lands in every shot
   * scripts/shoot.mjs takes, so a capture of localhost stops being a capture of the page. */
  devIndicators: false,
};

export default nextConfig;
