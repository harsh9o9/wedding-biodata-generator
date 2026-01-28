import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Serif, Playfair_Display } from "next/font/google";
import "./globals.css";

// Primary font for body text - supports Devanagari script
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Serif font for body alternatives
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display font for headings
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Indian Wedding Biodata Generator | Create Beautiful Biodatas Online",
    template: "%s | Indian Wedding Biodata Generator",
  },
  description:
    "Create beautiful, customizable Indian wedding biodatas online. Choose from traditional and modern templates, add your details, and download as PDF. Free biodata maker for matrimonial purposes.",
  keywords: [
    "biodata",
    "wedding biodata",
    "Indian biodata",
    "biodata maker",
    "biodata generator",
    "matrimonial biodata",
    "biodata template",
    "biodata format",
    "शादी का बायोडाटा",
    "बायोडाटा बनाएं",
  ],
  authors: [{ name: "Biodata Generator" }],
  creator: "Biodata Generator",
  publisher: "Biodata Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://biodata-generator.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "hi_IN",
    url: "https://biodata-generator.vercel.app",
    siteName: "Indian Wedding Biodata Generator",
    title: "Indian Wedding Biodata Generator | Create Beautiful Biodatas Online",
    description:
      "Create beautiful, customizable Indian wedding biodatas online. Choose from traditional and modern templates, add your details, and download as PDF.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indian Wedding Biodata Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Wedding Biodata Generator",
    description: "Create beautiful Indian wedding biodatas online",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "lifestyle",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF6B35" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Structured data for SEO (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Indian Wedding Biodata Generator",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "Create beautiful, customizable Indian wedding biodatas online. Choose from traditional and modern templates, add your details, and download as PDF.",
  featureList: [
    "Multiple biodata templates",
    "PDF export",
    "Bilingual support (English & Hindi)",
    "Custom backgrounds",
    "Auto-save feature",
  ],
  screenshot: "https://biodata-generator.vercel.app/og-image.png",
  softwareVersion: "1.0.0",
  author: {
    "@type": "Organization",
    name: "Biodata Generator",
  },
  inLanguage: ["en", "hi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${playfairDisplay.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
