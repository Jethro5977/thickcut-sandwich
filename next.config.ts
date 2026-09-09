import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Publish the exported public directory through Sites static hosting.
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
