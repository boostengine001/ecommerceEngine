'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader } from '../ui/card';
import { ArrowRight, ImageOff } from 'lucide-react';
import { getAllCategories } from '@/lib/actions/category.actions';
import type { ICategory } from '@/models/Category';
import { Skeleton } from '../ui/skeleton';

export default function CategorySection() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const topLevelCategories = (await getAllCategories()).filter(c => !c.parent).slice(0, 3);
        setCategories(topLevelCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
       <div className="py-12">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-4xl font-bold tracking-tight">Shop by Category</h2>
          <p className="mt-2 text-lg text-muted-foreground">Explore our curated product categories.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="group flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                    <Skeleton className="aspect-video w-full" />
                </CardHeader>
                <div className="flex flex-1 flex-col p-4">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex-grow" />
                    <Skeleton className="h-6 w-1/4 mt-4" />
                </div>
            </Card>
          ))}
        </div>
       </div>
    );
  }

  if (categories.length === 0) {
      return null;
  }

  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">Shop by Category</h2>
        <p className="mt-2 text-lg text-muted-foreground">Explore our curated product categories.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category._id} className="group flex flex-col overflow-hidden">
            <Link href={`/category/${category.slug}`} className="block">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={`Image for ${category.name}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <ImageOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </CardHeader>
            </Link>
            <div className="flex flex-1 flex-col p-4">
               <Link href={`/category/${category.slug}`} className="block">
                <h3 className="text-xl font-bold">{category.name}</h3>
               </Link>
               {/* In a real app, you'd fetch and show subcategories */}
               <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Explore Collection</span>
               </div>
               <div className="flex-grow" />
               <Link href={`/category/${category.slug}`} className="mt-4 flex items-center font-semibold text-primary">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
