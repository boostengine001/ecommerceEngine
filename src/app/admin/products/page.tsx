import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import ProductsDataTable from './products-data-table';
import { columns } from './columns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import DeleteProductButton from './delete-product-button';
import type { IProduct } from '@/models/Product';
import type { ICategory } from '@/models/Category';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
};

function ProductCard({ product }: { product: IProduct }) {
  const imageUrl = product.media && product.media.length > 0 ? product.media[0].url : '/placeholder.svg';
  const category = product.category as ICategory;
  const isOnSale = product.salePrice && product.salePrice < product.price;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Image src={imageUrl} alt={product.name} width={60} height={60} className="rounded-md object-cover" />
        <div className="flex-1">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{category?.name || 'Uncategorized'}</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product._id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/products/${product.slug}`} target="_blank">View</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                    <DeleteProductButton id={product._id} />
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
         <div className="flex flex-col">
              {isOnSale ? (
                  <>
                      <span className="font-bold text-lg text-destructive">{formatPrice(product.salePrice!)}</span>
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  </>
              ) : (
                  <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              )}
          </div>
          <Badge variant={product.isActive ? 'default' : 'destructive'}>{product.isActive ? 'Active' : 'Archived'}</Badge>
      </CardContent>
    </Card>
  )
}

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
