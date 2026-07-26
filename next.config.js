/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    // Mengabaikan ESLint saat build (sudah dijalankan di local/pre-commit)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengabaikan type-checking saat build untuk menghemat RAM dan mencegah OOM di Jenkins
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
