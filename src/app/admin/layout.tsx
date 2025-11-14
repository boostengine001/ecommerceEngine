
'use client';

import {
  SidebarProvider,
  Sidebar,
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
  Moon,
  Sun,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
      href: '/admin/roles',
      label: 'Roles & Permissions',
      icon: ShieldCheck,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: LineChart,
    },
  ];

  const isMenuItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
           <div className="p-2 flex justify-between items-center">
              <Button asChild variant="ghost" className="p-2 justify-start w-full text-lg font-bold">
                <Link href="/admin">
                  <ShoppingCart className="h-6 w-6 mr-2 shrink-0" />
                  <span className='truncate'>Admin Panel</span>
                </Link>
              </Button>
            </div>
          <SidebarMenu className='flex-1'>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isMenuItemActive(item.href)}
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
           <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <Link href="/" target="_blank" aria-label="Back to site">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <UserNav />
        </header>
        <div className="p-4 sm:p-6 bg-muted/40 min-h-[calc(100vh-3.5rem)]">{children}</div>
      </main>
    </SidebarProvider>
  );
}
