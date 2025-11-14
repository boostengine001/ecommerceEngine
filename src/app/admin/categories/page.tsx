
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllCategories } from '@/lib/actions/category.actions';
import type { ICategory } from '@/models/Category';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import DeleteCategoryButton from '@/components/admin/categories/delete-category-button';

export const dynamic = 'force-dynamic';

function CategoryCard({ category }: { category: ICategory }) {
  const parent = category.parent as ICategory | null;
  return (
    <Card className="flex items-center gap-4 p-4">
       <Image src={category.image} alt={category.name} width={60} height={60} className="rounded-md object-cover aspect-square" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <div>
                 <h3 className="font-semibold">{category.name}</h3>
                 <p className="text-sm text-muted-foreground">/{category.slug}</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/categories/${category._id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                        <DeleteCategoryButton id={category._id} variant="ghost" className="w-full justify-start p-2 h-auto font-normal text-destructive hover:text-destructive" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
         <div className="mt-2">
            {parent ? (
                <Link href={`/admin/categories/${parent._id}/edit`} className="text-xs hover:underline">
                Parent: <span className="font-medium">{parent.name}</span>
                </Link>
            ) : (
                <Badge variant="secondary">Top-Level</Badge>
            )}
        </div>
      </div>
    </Card>
  )
}


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

       {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
         {categories.length === 0 && (
            <Card className="flex items-center justify-center p-10">
                <p className="text-muted-foreground">No categories found.</p>
            </Card>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={categories} />
      </div>
    </div>
  );
}
