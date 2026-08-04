/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['discord.js', '@discordjs/ws', 'zlib-sync'],
  },
};

export default nextConfig;
