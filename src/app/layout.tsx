import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'You&Me',
  description: '품격 있으면서 럭셔리한 힐링을 위한 나를 위한 특별한 공간',
  manifest: '/manifest.json', // 1단계에서 만든 파일 연결
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YouAndMe',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // 핀치 줌으로 레이아웃이 깨지는 걸 방지
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
