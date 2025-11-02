'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { categories } from '@/lib/categories';
import ProductCard from '@/components/products/product-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categories.find((c) => c.id === slug);

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === slug);
  }, [slug]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (categoryProducts.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = categoryProducts.map((p) => p.salePrice ?? p.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [categoryProducts]);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = categoryProducts.filter((product) => {
      const price = product.salePrice ?? product.price;
      const isInPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const isOnSale = onSaleOnly ? !!product.salePrice : true;
      return isInPriceRange && isOnSale;
    });

    switch (sortBy) {
      case 'price-asc':
        filtered.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
        );
        break;
      case 'price-desc':
        filtered.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
        );
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  }, [categoryProducts, priceRange, onSaleOnly, sortBy]);

  if (!category) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Update price range when min/max prices change
  if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
      if (priceRange[0] < minPrice || priceRange[1] > maxPrice) {
          setPriceRange([minPrice, maxPrice]);
      }
  }


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
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <div className="space-y-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div>
              <Label className="font-semibold">Price Range</Label>
               <div className="my-3 text-sm text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                minStepsBetweenThumbs={1}
              />
            </div>
            <Separator/>
            <div className="flex items-center justify-between">
              <Label htmlFor="sale-only" className="font-semibold">On Sale Only</Label>
              <Switch id="sale-only" checked={onSaleOnly} onCheckedChange={setOnSaleOnly} />
            </div>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="flex items-center justify-between mb-6">
             <p className="text-lg text-muted-foreground">
              Showing {filteredAndSortedProducts.length} products
            </p>
            <div className="flex items-center gap-2">
                <Label htmlFor="sort-by">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-by" className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
