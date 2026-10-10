/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // 1. Proxy ALL backend API routes to the dedicated backend server on port 5000
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*',
      },
      // 2. SPA fallback for client-side routing
      {
        source: '/((?!api|_next/static|_next/image|images|favicon|fonts).*)',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
