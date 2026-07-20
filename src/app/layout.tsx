import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8C0B0E",
};

export const metadata: Metadata = {
  title: {
    template: "%s | CommercePilot AI",
    default: "CommercePilot AI",
  },
  description: "Multi-Tenant AI Commerce SaaS Platform for WooCommerce, Facebook Page sellers, and SMBs.",
  keywords: ["commerce", "inventory", "sales", "POS", "e-commerce", "SaaS", "AI"],
  authors: [{ name: "CommercePilot AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CommercePilot AI",
    title: "CommercePilot AI",
    description: "Multi-Tenant AI Commerce SaaS Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommercePilot AI",
    description: "Multi-Tenant AI Commerce SaaS Platform",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
