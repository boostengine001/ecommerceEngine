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

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" className="p-0 text-lg font-bold">
                    <Link href="/admin"><span>Admin Panel</span></Link>
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
                        isActive={pathname.startsWith('/admin/settings')}
                    >
                    <Link href="/admin/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex-1" />
          <UserNav />
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
