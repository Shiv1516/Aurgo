import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TermsPopup from "@/components/common/TermsPopup";

export const metadata: Metadata = {
  title: {
    default: "Augeo Vault - Premium Auction Platform",
    template: "%s | Augeo Vault"
  },
  description:
    "Discover extraordinary items at premium auctions. Bid on rare collectibles, fine art, exclusive jewelry, and historic motors from world-class auction houses.",
  keywords: ["auction", "bidding", "fine art", "collectibles", "luxury", "auction house", "watches", "real estate", "augeo"],
  metadataBase: new URL("https://augeo.auction"),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Augeo Vault - Premium Auction Platform",
    description: "Discover extraordinary items at premium auctions. Bid on rare collectibles, fine art, exclusive jewelry, and historic motors.",
    url: "https://augeo.auction",
    siteName: "Augeo Vault",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Augeo Vault Premium Auctions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Augeo Vault - Premium Auction Platform",
    description: "Experience the pinnacle of live high-end asset auctions.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "google-site-verification-id", // User should update this
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <TermsPopup />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a1a2e",
                color: "#fff",
                borderRadius: "12px",
              },
              success: { iconTheme: { primary: "#c9a84c", secondary: "#fff" } },
              error: { iconTheme: { primary: "#e94560", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
