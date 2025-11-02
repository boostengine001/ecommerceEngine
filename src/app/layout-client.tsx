
'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { ISettings } from '@/models/Setting';

export default function RootLayoutClient({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: ISettings;
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
      <Header logoUrl={settings.logoUrl} storeName={settings.storeName} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
