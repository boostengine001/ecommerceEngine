'use client';

import { products } from '@/lib/products';
import ProductCard from '../products/product-card';

export default function OnSaleSection() {
  const onSaleProducts = products.filter(p => p.salePrice).slice(0, 4);
    
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
