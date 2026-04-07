import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Включаем статический экспорт
  images: {
    unoptimized: true, // GitHub Pages не поддерживает стандартную оптимизацию изображений Next.js
  },
  // Устанавливаем имя вашего репозитория для корректной работы путей на GitHub Pages
  basePath: '/partisan-ar', 
  assetPrefix: '/partisan-ar/', // Дополнительно для корректной загрузки ассетов
};

export default nextConfig;
