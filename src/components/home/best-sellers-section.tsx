'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../products/product-card';
import { orders } from '@/lib/orders';
import { getProduct } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';
import { Skeleton } from '../ui/skeleton';

export default function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const productSalesMap = new Map<string, number>();
        orders.forEach(order => {
          order.items.forEach(item => {
            // Assuming item.id is the product ID
            const productId = item.id; 
            productSalesMap.set(productId, (productSalesMap.get(productId) || 0) + item.quantity);
          });
        });

        const sortedProducts = Array.from(productSalesMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(entry => entry[0]);

        const productPromises = sortedProducts.map(id => getProduct(id));
        const productsData = await Promise.all(productPromises);
        
        const validProducts = productsData.filter((p): p is IProduct => p !== null);

        setBestSellers(validProducts);
      } catch (error) {
        console.error("Failed to fetch best sellers", error);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBestSellers();
  }, []);

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">Our Best Sellers</h2>
        <p className="mt-2 text-lg text-muted-foreground">Check out the products everyone is raving about.</p>
      </div>
       {loading ? (
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
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
