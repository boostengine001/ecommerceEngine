"use client";

import Link from 'next/link';
import { ShoppingBag, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { UserNav } from '../auth/user-nav';
import { useWishlist } from '@/hooks/use-wishlist';
import Image from 'next/image';

interface HeaderProps {
    logoUrl: string;
    storeName: string;
}

export default function Header({ logoUrl, storeName }: HeaderProps) {
  const { totalItems: totalCartItems } = useCart();
  const { totalItems: totalWishlistItems } = useWishlist();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
           {logoUrl ? (
            <Image src={logoUrl} alt={storeName} width={120} height={40} className="h-10 w-auto" />
          ) : (
            <>
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">{storeName}</span>
            </>
          )}
        </Link>
        
        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-sm">
            <Input type="search" placeholder="Search products..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2">
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
