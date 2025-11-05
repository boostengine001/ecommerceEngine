'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../products/product-card';
import { getProducts } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';
import { Skeleton } from '../ui/skeleton';

export default function OnSaleSection() {
  const [onSaleProducts, setOnSaleProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOnSaleProducts() {
      try {
        const allProducts = await getProducts();
        const saleProducts = allProducts.filter(p => p.salePrice && p.salePrice < p.price).slice(0, 4);
        setOnSaleProducts(saleProducts);
      } catch (error) {
        console.error("Failed to fetch on-sale products", error);
        setOnSaleProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOnSaleProducts();
  }, []);

  if (loading) {
    return (
        <div className="py-12">
            <div className="mb-8 border-b pb-4">
                <h2 className="text-4xl font-bold tracking-tight">On Sale Now</h2>
                <p className="mt-2 text-lg text-muted-foreground">Grab these deals before they're gone!</p>
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

  if (onSaleProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">On Sale Now</h2>
        <p className="mt-2 text-lg text-muted-foreground">Grab these deals before they're gone!</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {onSaleProducts.map((product) => (
          <ProductCard key={product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
}
