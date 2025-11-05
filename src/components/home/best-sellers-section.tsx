'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../products/product-card';
import { getProducts } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';
import { Skeleton } from '../ui/skeleton';

// Note: In a real app, this logic would live on the server and use real order data.
// This is a simplified version using mock order data for demonstration.
const MOCK_BEST_SELLER_IDS = ['blue-watch', 'wireless-headphones', 'smart-speaker', 'leather-backpack'];

export default function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const allProducts = await getProducts();
        
        // Filter products that are in our mock best sellers list
        const bestSellingProducts = allProducts.filter(p => {
          // A simple way to match mock IDs to product names if slugs/IDs aren't 1:1
          const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
          return MOCK_BEST_SELLER_IDS.includes(slug);
        }).slice(0, 4);

        setBestSellers(bestSellingProducts);
      } catch (error) {
        console.error("Failed to fetch best sellers", error);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-4xl font-bold tracking-tight">Our Best Sellers</h2>
          <p className="mt-2 text-lg text-muted-foreground">Check out the products everyone is raving about.</p>
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

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">Our Best Sellers</h2>
        <p className="mt-2 text-lg text-muted-foreground">Check out the products everyone is raving about.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
}
