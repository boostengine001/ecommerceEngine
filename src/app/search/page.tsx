
import { search, type SearchResults } from '@/lib/actions/search.actions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import ProductCard from '@/components/products/product-card';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { IProduct } from '@/models/Product';
import type { ICategory } from '@/models/Category';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = searchParams;

  if (!q) {
    notFound();
  }

  const results: SearchResults = await search(q);
  const hasResults = results.products.length > 0 || results.categories.length > 0;

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
            <BreadcrumbPage>Search</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-3xl font-bold tracking-tight">
        Search results for "{q}"
      </h1>
      <p className="mt-2 text-muted-foreground">
        Found {results.products.length} product(s) and {results.categories.length} categorie(s).
      </p>

      <div className="mt-8">
        {hasResults ? (
          <div className="space-y-12">
            {results.categories.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold">Categories</h2>
                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {results.categories.map((category: ICategory) => (
                    <Card key={category._id} className="group overflow-hidden">
                       <Link href={`/category/${category.slug}`} className="block">
                        <div className="relative aspect-video">
                            <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                             <p className="text-sm text-muted-foreground mt-2 flex items-center">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </p>
                        </div>
                       </Link>
                    </Card>
                  ))}
                 </div>
              </section>
            )}

            {results.products.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold">Products</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.products.map((product: IProduct) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold">No results found</h2>
            <p className="mt-2 text-muted-foreground">
              We couldn't find anything matching your search. Try a different term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
