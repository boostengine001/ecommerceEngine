
"use client"

import type { IProduct } from "@/models/Product";
import type { ICategory } from "@/models/Category";
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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
import DeleteProductButton from "./delete-product-button";

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
        return <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? 'Active' : 'Archived'}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
 
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
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                    <DeleteProductButton id={product._id} />
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
