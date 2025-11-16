
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
        const topLevelCategories = (await getAllCategories()).filter(c => !c.parent);
        setCategories(topLevelCategories.slice(0, 3)); // Limit to 3 for a cleaner look
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Skeleton className="h-full w-full" />
            </div>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
        {categories.map((category) => (
          <Link key={category._id} href={`/category/${category.slug}`} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg">
            {category.image ? (
                <Image
                    src={category.image}
                    alt={`Image for ${category.name}`}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageOff className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <p className="mt-1 flex items-center text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
