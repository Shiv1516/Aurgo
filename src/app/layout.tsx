import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TermsPopup from "@/components/common/TermsPopup";

export const metadata: Metadata = {
  title: "Augeo - Premium Auction Platform",
  description:
    "Discover extraordinary items at premium auctions. Bid on rare collectibles, fine art, jewelry, and more from world-class auction houses.",
  keywords: "auction, bidding, fine art, collectibles, luxury, auction house",
  metadataBase: new URL("https://augeo.auction"),
  openGraph: {
    title: "Augeo - Premium Auction Platform",
    description: "Discover extraordinary items at premium auctions. Bid on rare collectibles, fine art, jewelry, and more.",
    url: "https://augeo.auction",
    siteName: "Augeo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Augeo - Premium Auction Platform",
    description: "Discover extraordinary items at premium auctions.",
    images: ["/og-image.jpg"],
  },
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
