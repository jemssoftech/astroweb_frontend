import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import LandingNavbar from "../components/landing-page/LandingNavbar";
import LandingFooter from "../components/landing-page/LandingFooter";
import { SocketProvider } from "@/src/context/SocketContext";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

// Comprehensive Metadata
export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default:
      "AstroWeb - Free Vedic Astrology | Kundli, Horoscope & Birth Chart",
    template: "%s | AstroWeb - Vedic Astrology",
  },
  description:
    "Get FREE accurate Vedic astrology predictions, Kundli matching, birth chart analysis, daily horoscope, Rashifal, Panchang, and personalized astrological guidance. Ancient Indian astrology wisdom for modern life. जन्म कुंडली, राशिफल, और ज्योतिष विज्ञान।",

  // ... (keeping other metadata standard)
  keywords: [
    "vedic astrology",
    "kundli",
    "kundali",
    "horoscope",
    "birth chart",
    "janam kundli",
    "free kundli",
    "astrology",
    "jyotish",
  ],
  authors: [{ name: "AstroWeb Team" }, { name: "Vedic Astrology Experts" }],
  creator: "AstroWeb",
  publisher: "AstroWeb",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`antialiased min-h-screen flex flex-col w-full h-full font-sans m-0 p-0 ${publicSans.variable}`}
      >
        <SocketProvider>
          <LandingNavbar />
          {children}
          <LandingFooter />
        </SocketProvider>
      </body>
    </html>
  );
}
