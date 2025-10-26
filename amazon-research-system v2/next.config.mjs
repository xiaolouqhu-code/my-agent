/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 启用 standalone 输出模式，用于 Docker 部署
  output: 'standalone',
  // 允许外部访问
  poweredByHeader: false,
}

export default nextConfig
