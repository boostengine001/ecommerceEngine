import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import RootLayoutClient from './layout-client';
import { AuthProvider } from '@/hooks/use-auth';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { getSettings } from '@/lib/actions/setting.actions';

export const metadata: Metadata = {
  title: 'BlueCart',
  description: 'A modern eCommerce storefront for browsing and purchasing products.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <style id="theme-variables">
          {`:root { --primary: ${settings.primaryColor}; }`}
        </style>
      </head>
      <body className={cn('h-full font-body antialiased')}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <RootLayoutClient logoUrl={settings.logoUrl} storeName={settings.storeName}>{children}</RootLayoutClient>
              <Toaster />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
