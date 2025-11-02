'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Tag,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { Separator } from '@/components/ui/separator';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: ShoppingCart,
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: Package,
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: Tag,
    },
    {
      href: '/admin/customers',
      label: 'Customers',
      icon: Users,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: LineChart,
    },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    const currentItem = menuItems.find(item => pathname.startsWith(item.href) && item.href !== '/admin');
    if (currentItem) return currentItem.label;
    
    if (pathname.startsWith('/admin/orders/')) return 'Order Details';
    if (pathname.startsWith('/admin/products/new')) return 'New Product';
    if (pathname.startsWith('/admin/categories/new')) return 'New Category';

    return 'Admin';
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" className="p-0 text-lg font-bold">
                    <Link href="/admin">Admin Panel</Link>
                    </Button>
                </div>
            </SidebarHeader>
             <Separator className="my-2" />
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
             <Separator className="my-2" />
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        tooltip={{ children: "Settings" }}
                        disabled
                    >
                    <Link href="/admin/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            </SidebarMenu>
             <Separator className="my-2" />
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
