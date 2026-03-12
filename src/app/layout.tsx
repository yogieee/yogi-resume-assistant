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

const siteUrl = "https://yoganandgovind.dev";

export const metadata: Metadata = {
  title: "Yoganand Govind | Senior Software Developer",
  description:
    "AI-powered developer portfolio for Yoganand Govind — Senior Software Developer specializing in Cloud & AI Platform Engineering. Explore projects, skills, and experience through an interactive terminal console.",
  keywords: [
    "Yoganand Govind",
    "Senior Software Developer",
    "Cloud Engineer",
    "AI Platform Engineer",
    "AWS",
    "Autowired.ai",
    "Portfolio",
    "IBM Curam",
    "Serverless",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "Yoganand Govind" }],
  creator: "Yoganand Govind",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Yoganand Govind — Developer Portfolio",
    title: "Yoganand Govind | Senior Software Developer & Cloud Architect",
    description:
      "12+ years building enterprise platforms. Creator of Autowired.ai. AWS certified. Explore my work through an interactive developer console.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yoganand Govind — Senior Software Developer & Cloud Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoganand Govind | Senior Software Developer",
    description:
      "12+ years building enterprise platforms. Creator of Autowired.ai. AWS certified. Explore my work through an interactive developer console.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
