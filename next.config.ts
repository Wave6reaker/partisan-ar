import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Включаем статический экспорт
  images: {
    unoptimized: true, // GitHub Pages не поддерживает стандартную оптимизацию изображений Next.js
  },
  // Раскомментируйте и установите имя вашего репозитория, если деплоите не в корень домена
  // basePath: '/mvp-viewer', 
};

export default nextConfig;
