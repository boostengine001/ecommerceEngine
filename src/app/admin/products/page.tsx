import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import ProductsDataTable from './products-data-table';
import { columns } from './columns';
import { Card } from '@/components/ui/card';
import { ProductCard } from './product-card';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage the products in your store.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

       {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {products.length === 0 && (
            <Card className="flex items-center justify-center p-10">
                <p className="text-muted-foreground">No products found.</p>
            </Card>
        )}
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <ProductsDataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
