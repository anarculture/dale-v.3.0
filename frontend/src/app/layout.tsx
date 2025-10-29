// Root layout for Dale PWA
import './globals.css'
import { AuthProvider } from '@/lib/AuthContext'
import ServiceWorker from '@/components/ServiceWorker'

export const metadata = {
  title: 'Dale - Comparte tu viaje',
  description: 'Plataforma para compartir viajes y ahorrar dinero',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dale',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ServiceWorker />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}