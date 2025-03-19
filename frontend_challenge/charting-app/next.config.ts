/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This setting helps suppress harmless hydration mismatches caused by browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default nextConfig;
