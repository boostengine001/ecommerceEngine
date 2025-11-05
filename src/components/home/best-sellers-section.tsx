
'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../products/product-card';
import { getProducts } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';
import { Skeleton } from '../ui/skeleton';

export default function BestSellersSection() {
  const [newArrivals, setNewArrivals] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewestProducts() {
      try {
        // Fetches all products, sorted by creation date descending by default in the action
        const allProducts = await getProducts();
        // Take the first 4
        setNewArrivals(allProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNewestProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-4xl font-bold tracking-tight">New Arrivals</h2>
          <p className="mt-2 text-lg text-muted-foreground">Check out our latest products.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (newArrivals.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">New Arrivals</h2>
        <p className="mt-2 text-lg text-muted-foreground">Check out our latest products.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {newArrivals.map((product) => (
          <ProductCard key={product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
}
