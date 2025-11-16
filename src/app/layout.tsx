
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import RootLayoutClient from './layout-client';
import { AuthProvider } from '@/hooks/use-auth';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { getSettings } from '@/lib/actions/setting.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import { hexToHsl } from '@/lib/utils';
import { SettingsProvider } from '@/hooks/use-settings';

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
  const categories = await getAllCategories();
  const primaryColorLightHsl = hexToHsl(settings.primaryColor);
  const primaryColorDarkHsl = hexToHsl(settings.primaryColorDark);

  return (
    <html lang="en" className={cn("h-full")} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@500;700&display=swap" rel="stylesheet" />
        <style id="theme-variables" dangerouslySetInnerHTML={{__html: `
          :root { 
            --primary-light: hsl(${primaryColorLightHsl});
            --primary-light-hsl: ${primaryColorLightHsl};
            --primary-dark: hsl(${primaryColorDarkHsl});
            --primary-dark-hsl: ${primaryColorDarkHsl};
            --font-body: 'Inter', sans-serif;
            --font-headline: 'Poppins', sans-serif;
          }
        `}} />
      </head>
      <body className={cn('h-full font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.theme}
          enableSystem
        >
          <SettingsProvider settings={settings} categories={categories}>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <RootLayoutClient>{children}</RootLayoutClient>
                  <Toaster />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
