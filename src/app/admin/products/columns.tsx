
"use client"

import type { IProduct } from "@/models/Product";
import type { ICategory } from "@/models/Category";
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Archive, ArchiveRestore, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { archiveProduct, recoverProduct, deleteProductPermanently } from "@/lib/actions/product.actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


function ProductActions({ product }: { product: IProduct }) {
  const { toast } = useToast();

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred.' });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
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
          {product.isActive ? (
            <DropdownMenuItem onClick={() => handleAction(() => archiveProduct(product._id), 'Product archived')}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleAction(() => recoverProduct(product._id), 'Product recovered')}>
              <ArchiveRestore className="mr-2 h-4 w-4" />
              Recover
            </DropdownMenuItem>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(() => deleteProductPermanently(product._id), 'Product deleted permanently')} className="bg-destructive hover:bg-destructive/90">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
};

export const columns: ColumnDef<IProduct>[] = [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Product" />
      )
    },
    cell: ({ row }) => {
        const product = row.original;
        const imageUrl = product.media && product.media.length > 0 ? product.media[0].url : '/placeholder.svg';
        return (
            <div className="flex items-center gap-4">
                <Image src={imageUrl} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">/{product.slug}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Price" />
      )
    },
    cell: ({ row }) => {
        const product = row.original;
        return (
            <div className="flex flex-col">
                {product.salePrice ? (
                    <>
                        <span className="font-bold text-destructive">{formatPrice(product.salePrice)}</span>
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    </>
                ) : (
                    <span>{formatPrice(product.price)}</span>
                )}
            </div>
        )
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
        const category = row.original.category as ICategory;
        if (!category) {
            return <Badge variant="secondary">Uncategorized</Badge>
        }
        return (
            <Badge variant="outline">{category.name}</Badge>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const isActive = row.original.isActive;
        return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Archived'}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
]
