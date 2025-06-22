/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 🔧 ここで画像サイズ対応
    },
  },
  // 追加オプション（必要に応じて）
  // output: 'standalone',
  // distDir: 'build',
}

module.exports = nextConfig
