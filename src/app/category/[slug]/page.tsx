import { products } from '@/lib/products';
import { categories } from '@/lib/categories';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/products/product-card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
    const mainCategories = categories.map(category => ({ slug: category.id }));
    const subCategories = categories.flatMap(category => 
        category.subcategories.map(sub => ({ slug: `${category.id}/${sub.id}` }))
    );
    return [...mainCategories, ...subCategories.map(s => ({slug: s.slug.split('/')[1]}))];
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categories.find(c => c.id === slug);
  
  if (!category) {
    notFound();
  }
  
  const categoryProducts = products.filter(p => p.category === category.id);

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
        <p className="mt-2 text-lg text-muted-foreground">
          Showing {categoryProducts.length} products
        </p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
