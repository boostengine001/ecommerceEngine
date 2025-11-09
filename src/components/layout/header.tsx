
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
import { useRouter } from 'next/navigation';

interface HeaderProps {
    logoUrl?: string | null;
    storeName?: string | null;
}

export default function Header({ logoUrl, storeName }: HeaderProps) {
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
           {logoUrl ? (
            <Image src={logoUrl} alt={storeName || 'Store Logo'} width={120} height={40} className="h-10 w-auto" />
          ) : (
            <>
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">{storeName || 'BlueCart'}</span>
            </>
          )}
        </Link>
        
        <div className="hidden flex-1 justify-center md:flex md:gap-x-4">
          <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">Shop</Link>
          <Link href="/category/menswear" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Men</Link>
          <Link href="/category/womenswear" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Women</Link>
          <Link href="/category/accessories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Accessories</Link>
        </div>

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
