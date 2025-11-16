
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Heart, Menu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { UserNav } from '../auth/user-nav';
import { useWishlist } from '@/hooks/use-wishlist';
import { useSettings } from '@/hooks/use-settings';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuListItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '../ui/sheet';
import { useMemo, useState } from 'react';
import type { ICategory } from '@/models/Category';
import SearchSuggestions from '../search/search-suggestions';

function MainNav({ categories }: { categories: ICategory[] }) {
  const categoryMap = useMemo(() => {
    const map: Record<string, { category: ICategory, children: ICategory[] }> = {};
    categories.forEach(category => {
      const parentId = (category.parent as ICategory)?._id || category._id;
      
      if (!map[parentId]) {
        // Find or create the top-level category entry
        const topLevelCat = categories.find(c => c._id === parentId);
        if (topLevelCat) {
          map[parentId] = { category: topLevelCat, children: [] };
        }
      }

      if (category.parent) {
          map[parentId].children.push(category);
      }
    });
    return Object.values(map).sort((a,b) => a.category.name.localeCompare(b.category.name));
  }, [categories]);

  const topLevelCategories = categoryMap.map(item => item.category);

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-4 gap-6 p-4">
              {categoryMap.slice(0, 2).map((group) => (
                 <div key={group.category._id} className="flex flex-col">
                   <div className="group relative h-40 w-full overflow-hidden rounded-md">
                     <Link href={`/category/${group.category.slug}`} className="block h-full w-full">
                       <Image
                         src={group.category.image}
                         alt={group.category.name}
                         fill
                         className="object-cover transition-transform duration-300 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                       <div className="absolute bottom-0 p-3 text-white">
                         <h4 className="text-lg font-bold">{group.category.name}</h4>
                       </div>
                     </Link>
                   </div>
                   <ul className="mt-2 space-y-1">
                      {group.children.slice(0, 4).map(child => (
                        <li key={child._id}>
                          <NavigationMenuListItem href={`/category/${child.slug}`} title={child.name} />
                        </li>
                      ))}
                   </ul>
                 </div>
              ))}
              <div className="flex flex-col space-y-4">
                {categoryMap.slice(2, 5).map(group => (
                  <div key={group.category._id}>
                    <Link href={`/category/${group.category.slug}`} className="font-bold text-foreground hover:text-primary">
                      {group.category.name}
                    </Link>
                    <ul className="mt-1 space-y-1">
                       {group.children.slice(0, 3).map(child => (
                        <li key={child._id}>
                          <NavigationMenuListItem href={`/category/${child.slug}`} title={child.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
               <div className="flex flex-col justify-between rounded-md bg-muted p-4">
                 <div>
                    <h4 className="text-lg font-bold">New Arrivals</h4>
                    <p className="mt-1 text-sm text-muted-foreground">The latest trends and styles, updated daily.</p>
                 </div>
                 <div className="pt-4">
                    <Button variant="outline" asChild className="w-full">
                    <Link href="/shop">
                        Shop All Products <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                 </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
         {topLevelCategories.slice(0,4).map(cat => (
          <NavigationMenuItem key={cat._id}>
            <Link href={`/category/${cat.slug}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {cat.name}
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const topLevelCategories = useMemo(() => categories.filter(c => !c.parent), [categories]);


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 lg:gap-2">
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px]">
                        <div className="flex h-full flex-col">
                             <div className="mb-4 border-b pb-4">
                                <SheetClose asChild>
                                  <Link href="/" className="flex items-center gap-2 font-bold">
                                      <ShoppingBag className="h-6 w-6 text-primary" />
                                      <span>{storeName || 'BlueCart'}</span>
                                  </Link>
                                </SheetClose>
                            </div>
                            <div className="flex flex-col gap-2">
                                <SheetClose asChild>
                                 <Link href="/shop" className="text-lg font-medium">Shop All</Link>
                                </SheetClose>
                                 {topLevelCategories.map(cat => (
                                    <SheetClose asChild key={cat._id}>
                                     <Link href={`/category/${cat.slug}`} className="text-lg font-medium text-muted-foreground">{cat.name}</Link>
                                    </SheetClose>
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
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
            <div className="hidden w-full max-w-xs lg:block">
                <SearchSuggestions />
            </div>
            
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)}>
                <Search className="h-6 w-6" />
                <span className="sr-only">Search</span>
            </Button>

            <div className="hidden md:flex md:items-center md:gap-2">
              <UserNav />
              <Button asChild variant="ghost" size="icon" className="relative">
                  <Link href="/wishlist">
                      <Heart className="h-6 w-6" />
                      <span className="sr-only">Open wishlist</span>
                  </Link>
              </Button>
            </div>

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
      {searchOpen && (
        <div className="absolute top-full left-0 w-full border-b bg-background p-4 shadow-md lg:hidden">
            <SearchSuggestions onSelect={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
