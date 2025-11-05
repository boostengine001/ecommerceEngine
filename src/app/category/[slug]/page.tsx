'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { getAllCategories } from '@/lib/actions/category.actions';
import { getProducts } from '@/lib/actions/product.actions';
import type { ICategory } from '@/models/Category';
import type { IProduct } from '@/models/Product';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const [category, setCategory] = useState<ICategory | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allCategories, allProducts] = await Promise.all([
          getAllCategories(),
          getProducts(),
        ]);
        
        const currentCategory = allCategories.find(c => c.slug === slug);
        if (currentCategory) {
          setCategory(currentCategory);
          const categoryProducts = allProducts.filter(p => (p.category as ICategory)._id.toString() === currentCategory._id);
          setProducts(categoryProducts);
        } else {
          // Handle category not found
          setCategory(null);
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = products.map((p) => p.salePrice ?? p.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);


  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
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
  }, [products, priceRange, onSaleOnly, sortBy]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
             <Skeleton className="h-6 w-1/4 mb-8" />
             <div className="mb-8 border-b pb-4">
                <Skeleton className="h-10 w-1/3" />
            </div>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <aside className="md:col-span-1">
                     <Skeleton className="h-8 w-1/2 mb-4" />
                     <Skeleton className="h-40 w-full rounded-lg" />
                </aside>
                <main className="md:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-[180px]" />
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                         {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="aspect-square w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
  }

  if (!category) {
    notFound();
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
                <ProductCard key={product._id} product={product} />
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
