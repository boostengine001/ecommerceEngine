
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { UserNav } from '../auth/user-nav';
import { useWishlist } from '@/hooks/use-wishlist';
import { useSettings } from '@/hooks/use-settings';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/models/Category';

function MainNav({ categories }: { categories: ICategory[] }) {
  const topLevelCategories = useMemo(() => categories.filter(c => !c.parent).slice(0, 5), [categories]);

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/shop" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Shop All
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {topLevelCategories.map(category => (
          <NavigationMenuItem key={category._id}>
            <Link href={`/category/${category.slug}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {category.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}


export default function Header() {
  const { settings, categories } = useSettings();
  const { logoUrl, storeName } = settings;
  const { totalItems: totalCartItems } = useCart();
  const { totalItems: totalWishlistItems } = useWishlist();
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('q');
    if (typeof query === 'string' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const topLevelCategories = useMemo(() => categories.filter(c => !c.parent), [categories]);


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                    <div className="flex h-full flex-col">
                         <div className="mb-4 border-b pb-4">
                            <Link href="/" className="flex items-center gap-2 font-bold">
                                <ShoppingBag className="h-6 w-6 text-primary" />
                                <span>{storeName || 'BlueCart'}</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                             <Link href="/shop" className="text-lg font-medium">Shop All</Link>
                             {topLevelCategories.map(cat => (
                                 <Link key={cat._id} href={`/category/${cat.slug}`} className="text-lg font-medium text-muted-foreground">{cat.name}</Link>
                             ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
                <Image src={logoUrl} alt={storeName || 'Store Logo'} width={120} height={40} className="h-8 w-auto" />
            ) : (
                <span className="font-headline text-xl font-bold">{storeName || 'BlueCart'}</span>
            )}
            </Link>
        </div>
        
        <MainNav categories={categories} />

        <div className="flex flex-1 items-center justify-end gap-2">
           <form onSubmit={handleSearch} className="relative hidden w-full max-w-xs lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search products..."
                className="w-full rounded-lg bg-background pl-8"
              />
          </form>
           <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-6 w-6" />
              <span className="sr-only">Search</span>
          </Button>
          <UserNav />
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/wishlist">
                <Heart className="h-6 w-6" />
                 {totalWishlistItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalWishlistItems}
                </span>
              )}
                <span className="sr-only">Open wishlist</span>
            </Link>
          </Button>
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-6 w-6" />
              {totalCartItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalCartItems}
                </span>
              )}
              <span className="sr-only">Open cart</span>
            </Button>
          </CartSheet>
        </div>
      </div>
    </header>
  );
}
