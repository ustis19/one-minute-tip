import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import ThemeToggle from "./ThemeToggle"; // Удаляем/комментируем, если не нужен

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Одна минута полезности",
  description: "Каждый день — новый короткий совет на 1 минуту.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <ThemeToggle /> */} {/* Убрали кнопку переключения темы */}
        {children}
      </body>
    </html>
  );
}
