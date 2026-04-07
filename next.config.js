const path = require('path');

const nextConfig = {
  output: 'export',
  distDir: 'out', // Возвращаем стандартное имя
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    unoptimized: true,
  },
  basePath: '/partisan-ar',
  assetPrefix: '/partisan-ar/',
};

module.exports = nextConfig;
