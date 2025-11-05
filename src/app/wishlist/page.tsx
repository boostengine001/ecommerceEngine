'use client';

import { useWishlist } from '@/hooks/use-wishlist';
import ProductCard from '@/components/products/product-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import type { IProduct } from '@/models/Product';

export default function WishlistPage() {
  const { wishlistItems, totalItems } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Wishlist</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight">My Wishlist</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {totalItems > 0
            ? `You have ${totalItems} item(s) in your wishlist.`
            : 'Your wishlist is empty.'}
        </p>
      </div>

      {totalItems > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product as IProduct} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">Your Wishlist is Empty</h2>
            <p className="mt-2 text-center text-muted-foreground">
                Looks like you haven't added anything to your wishlist yet.
            </p>
        </div>
      )}
    </div>
  );
}
