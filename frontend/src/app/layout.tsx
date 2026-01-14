import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColorSync from "@/components/ColorSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Kurdish font (supports Arabic script used in Sorani Kurdish)
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-kurdish",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KCAY - Kurdish Cultural Association at York",
  description: "Welcome to the Kurdish Cultural Association at York. Celebrating Kurdish culture, heritage, and community through events, podcasts, and educational resources.",
  keywords: ["Kurdish", "Kurdish culture", "York University", "Kurdish community", "Kurdish events", "Kurdish podcast", "Kurdish heritage", "Kurdish language", "Kurdish dance"],
  authors: [{ name: "KCAY" }],
  creator: "Kurdish Cultural Association at York",
  publisher: "Kurdish Cultural Association at York",
  metadataBase: new URL('https://kcay.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "KCAY - Kurdish Cultural Association at York",
    description: "Welcome to the Kurdish Cultural Association at York. Celebrating Kurdish culture, heritage, and community through events, podcasts, and educational resources.",
    url: "https://kcay.ca",
    siteName: "KCAY",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KCAY - Kurdish Cultural Association at York",
    description: "Welcome to the Kurdish Cultural Association at York. Celebrating Kurdish culture, heritage, and community.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased flex flex-col min-h-screen`}
      >
        <ColorSync />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
