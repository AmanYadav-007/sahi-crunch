import type { Metadata, Viewport } from 'next';
import '../src/styles/fonts.css';
import '../src/index.css';
import { AuthProvider } from '../src/lib/AuthContext';
import { ToastProvider } from '../src/lib/ToastContext';
import AuthModal from '../src/screens/AuthModal';

export const metadata: Metadata = {
  title: 'SAHI CRUNCH — Bhopal\'s Guilt-Free Snack Brand',
  description: 'Preservative-free makhana, namkeen, and fresh-baked nankhatai. Small-batch, WhatsApp-first, delivered fresh from our Bhopal kitchen within 48 hours. Sahi Spice. Modern Crunch.',
  keywords: ['makhana', 'Bhopal snacks', 'preservative-free', 'namkeen', 'nankhatai', 'healthy snacks', 'Sahi Crunch'],
  openGraph: {
    title: 'SAHI CRUNCH — Sahi Spice. Modern Crunch.',
    description: 'Bhopal\'s small-batch, preservative-free snack brand. Fresh within 48 hours. Order on WhatsApp.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ff5200',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            {children}
            <AuthModal />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
