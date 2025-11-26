/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Aumenta o limite de tamanho do corpo das Server Actions para permitir imagens em Base64
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
