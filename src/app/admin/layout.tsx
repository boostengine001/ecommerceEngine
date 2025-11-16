
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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  ExternalLink,
  Megaphone,
  TicketPercent,
  Tag,
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
import { useSettings } from '@/hooks/use-settings';
import Image from 'next/image';

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
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
  const { settings } = useSettings();

  const menuGroups = [
    {
        label: 'Store',
        items: [
            { href: '/admin', label: 'Dashboard', icon: Home },
            { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
            { href: '/admin/products', label: 'Products', icon: Package },
            { href: '/admin/categories', label: 'Categories', icon: Tag },
            { href: '/admin/customers', label: 'Customers', icon: Users },
            { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
        ]
    },
    {
        label: 'Growth',
        items: [
             { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
             { href: '/admin/discounts', label: 'Discounts', icon: TicketPercent },
        ]
    },
     {
        label: 'Configuration',
        items: [
            { href: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck },
            { href: '/admin/settings', label: 'Settings', icon: Settings },
        ]
    }
  ]

  const isMenuItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className='border-r bg-card/60'>
        <SidebarContent>
           <div className="p-2 flex justify-center items-center">
              <Button asChild variant="ghost" className="p-2 h-12 justify-start w-full text-lg font-bold">
                <Link href="/admin" className="flex items-center gap-3">
                   {settings.logoUrl ? (
                     <Image src={settings.logoUrl} alt={settings.storeName} width={32} height={32} className="h-8 w-8 object-contain shrink-0" />
                   ) : (
                     <ShoppingCart className="h-6 w-6 shrink-0" />
                   )}
                  <span className='truncate font-headline text-xl'>{settings.storeName} Admin</span>
                </Link>
              </Button>
            </div>
          <SidebarMenu className='flex-1 p-2'>
            {menuGroups.map((group) => (
                <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    {group.items.map(item => (
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
                </SidebarGroup>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className='p-2 flex justify-between items-center'>
               <UserNav />
               <ThemeToggle />
            </div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 bg-muted/40 relative">
         <div className="absolute inset-0 bg-repeat bg-center" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")"}} />
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex-1" />
           <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <Link href="/" target="_blank" aria-label="Back to site">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
           <div className="hidden md:block">
             <UserNav />
           </div>
        </header>
        <div className="relative p-4 sm:p-6 min-h-[calc(100vh-3.5rem)]">{children}</div>
      </main>
    </SidebarProvider>
  );
}
