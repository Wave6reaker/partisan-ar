const nextConfig = {
  output: 'export',
  distDir: 'out', // Принудительно устанавливаем папку для статики
  images: {
    unoptimized: true,
  },
  basePath: '/partisan-ar',
  assetPrefix: '/partisan-ar/',
};

export default nextConfig;
