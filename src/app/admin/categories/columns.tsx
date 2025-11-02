
"use client"

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
import DeleteCategoryButton from "@/components/admin/categories/delete-category-button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const columns: ColumnDef<ICategory>[] = [
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
        <DataTableColumnHeader column={column} title="Category" />
      )
    },
    cell: ({ row }) => {
        const category = row.original;
        return (
            <div className="flex items-center gap-4">
                <Image src={category.image} alt={category.name} width={40} height={40} className="rounded-md object-cover" />
                <div className="flex flex-col">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">/{category.slug}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "subcategories",
    header: "Sub-categories",
    cell: ({ row }) => {
        const subcategories = row.original.subcategories;
        if (!subcategories || subcategories.length === 0) {
            return <span className="text-muted-foreground">None</span>
        }
        return (
            <div className="flex flex-wrap gap-1">
                {subcategories.map(sub => (
                    <Badge key={sub.slug} variant="secondary">{sub.name}</Badge>
                ))}
            </div>
        )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
 
      return (
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
                <Link href={`/admin/categories/${category._id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteCategoryButton id={category._id} variant="ghost" className="w-full justify-start p-2 h-auto font-normal text-destructive hover:text-destructive" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
