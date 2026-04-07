const path = require('path');

const nextConfig = {
  output: 'export',
  distDir: 'deploy_dist', // Меняем имя на уникальное
  // Жестко фиксируем корень проекта через абсолютный путь
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    unoptimized: true,
  },
  basePath: '/partisan-ar',
  assetPrefix: '/partisan-ar/',
};

module.exports = nextConfig;
