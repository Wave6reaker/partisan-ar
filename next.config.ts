const nextConfig = {
  output: 'export',
  distDir: 'out',
  // Принудительно указываем корень проекта, чтобы Next.js не искал lock-файлы выше по дереву
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
  },
  basePath: '/partisan-ar',
  assetPrefix: '/partisan-ar/',
};

export default nextConfig;
