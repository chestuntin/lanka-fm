/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/links/:path*', destination: '/', permanent: true },
      { source: '/linkss/:path*', destination: '/', permanent: true },
      { source: '/jersey/:path*', destination: '/', permanent: true },
      { source: '/portfolio/:path*', destination: '/', permanent: true },
      { source: '/slgdp/:path*', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
