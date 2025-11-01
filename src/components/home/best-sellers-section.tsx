'use client';

import { products } from '@/lib/products';
import ProductCard from '../products/product-card';

export default function BestSellersSection() {
  // In a real app, this would be determined by sales data.
  // For now, we'll just pick a few products to feature.
  const bestSellers = products.slice(0, 4).sort(() => 0.5 - Math.random());

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">Our Best Sellers</h2>
        <p className="mt-2 text-lg text-muted-foreground">Check out the products everyone is raving about.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
