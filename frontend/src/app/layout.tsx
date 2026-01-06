import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui";

export const viewport: Viewport = {
  themeColor: "#fd5810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Dale - Comparte viajes y ahorra",
  description: "Encuentra y comparte viajes de forma fácil, económica y sostenible con Dale.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dale",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-neutral-50" suppressHydrationWarning>
        <HeroUIProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
