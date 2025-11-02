
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllCategories } from '@/lib/actions/category.actions';
import type { ICategory } from '@/models/Category';
import { columns } from "./columns";
import { DataTable } from "./data-table";

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

      <DataTable columns={columns} data={categories} />
    </div>
  );
}
