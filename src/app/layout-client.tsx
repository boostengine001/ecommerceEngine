'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function RootLayoutClient({
  children,
  logoUrl,
  storeName,
}: {
  children: React.ReactNode;
  logoUrl: string;
  storeName: string;
}) {
  const pathname = usePathname();

  const isAuthPage = useMemo(() => {
    return pathname === '/login' || pathname === '/signup';
  }, [pathname]);

  const isAdminPage = useMemo(() => {
    return pathname.startsWith('/admin');
  }, [pathname]);

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header logoUrl={logoUrl} storeName={storeName} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
