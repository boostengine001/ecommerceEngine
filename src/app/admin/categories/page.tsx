
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getAllCategories } from '@/lib/actions/category.actions';
import Image from 'next/image';
import DeleteCategoryButton from '@/components/admin/categories/delete-category-button';
import { Badge } from '@/components/ui/badge';
import type { ICategory } from '@/models/Category';

export default async function AdminCategoriesPage() {
  const categories: ICategory[] = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage your product categories and sub-categories.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category._id} className="flex flex-col">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle>{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/categories/${category._id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                         <DeleteCategoryButton id={category._id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image src={category.image} alt={category.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Subcategories</h4>
                  {category.subcategories && category.subcategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map((sub: any) => (
                          <Badge key={sub.slug} variant="secondary">{sub.name}</Badge>
                        ))}
                      </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subcategories yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No Categories Found</CardTitle>
            <p className="text-muted-foreground">Get started by adding your first product category.</p>
          </CardHeader>
          <CardContent>
             <Button asChild>
              <Link href="/admin/categories/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
