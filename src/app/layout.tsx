import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "PARTISAN | AR Furniture Showroom",
  description: "Премиальный мебельный шоурум в дополненной реальности",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased bg-[#fafafa]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
