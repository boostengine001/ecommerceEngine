
'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, categories] = await Promise.all([
          getProducts(),
          getAllCategories(),
        ]);
        setAllProducts(products);
        setAllCategories(categories);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const { minPrice, maxPrice } = useMemo(() => {
    if (allProducts.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = allProducts.map((p) => p.salePrice ?? p.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const price = product.salePrice ?? product.price;
      const isInPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const isOnSale = onSaleOnly ? !!product.salePrice : true;
      const isInSelectedCategory = selectedCategories.length === 0 || selectedCategories.includes((product.category as ICategory)._id.toString());
      return isInPriceRange && isOnSale && isInSelectedCategory;
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
  }, [allProducts, priceRange, onSaleOnly, sortBy, selectedCategories]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
                     <Skeleton className="h-64 w-full rounded-lg" />
                </aside>
                <main className="md:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-[180px]" />
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                         {[...Array(9)].map((_, i) => (
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
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <div className="space-y-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
             <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="text-base font-semibold">Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {allCategories.map(cat => (
                        <div key={cat._id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cat-${cat._id}`}
                            checked={selectedCategories.includes(cat._id)}
                            onCheckedChange={() => handleCategoryChange(cat._id)}
                          />
                          <Label htmlFor={`cat-${cat._id}`} className="font-normal">{cat.name}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                   <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
                   <AccordionContent>
                    <div className="pt-2">
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
                   </AccordionContent>
                </AccordionItem>
            </Accordion>
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
