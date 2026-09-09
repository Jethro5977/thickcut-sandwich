import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The menu is fully client-side, so it can be published directly to GitHub Pages.
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
