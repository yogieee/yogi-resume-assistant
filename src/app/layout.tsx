import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Geist } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yogi Dev Console",
  description: "AI-powered developer portfolio for Yogananda Govind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${jetbrainsMono.variable} ${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
