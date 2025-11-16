
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import ProductsDataTable from './products-data-table';
import { columns } from './columns';
import { Card } from '@/components/ui/card';
import { ProductCard } from './product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AdminProductsPage() {
  const allProducts = await getProducts(true);
  const activeProducts = allProducts.filter(p => p.isActive);
  const archivedProducts = allProducts.filter(p => !p.isActive);

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

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedProducts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden mt-4">
              {activeProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
              {activeProducts.length === 0 && (
                  <Card className="flex items-center justify-center p-10">
                      <p className="text-muted-foreground">No active products found.</p>
                  </Card>
              )}
            </div>
            
            {/* Desktop View */}
            <div className="hidden md:block">
              <ProductsDataTable columns={columns} data={activeProducts} />
            </div>
        </TabsContent>
         <TabsContent value="archived">
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden mt-4">
              {archivedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
              {archivedProducts.length === 0 && (
                  <Card className="flex items-center justify-center p-10">
                      <p className="text-muted-foreground">No archived products found.</p>
                  </Card>
              )}
            </div>
            
            {/* Desktop View */}
            <div className="hidden md:block">
              <ProductsDataTable columns={columns} data={archivedProducts} />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
