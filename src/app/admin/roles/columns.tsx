
"use client"

import type { IRole } from "@/models/Role";
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
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import DeleteRoleButton from "./delete-role-button";

export const columns: ColumnDef<IRole & { userCount: number }>[] = [
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
        <DataTableColumnHeader column={column} title="Role Name" />
      )
    },
    cell: ({ row }) => {
        const role = row.original;
        return (
            <Link href={`/admin/roles/${role._id}/edit`} className="font-medium hover:underline">
                {role.name}
            </Link>
        )
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
        const description = row.original.description;
        return <div className="truncate max-w-sm">{description}</div>
    }
  },
  {
    accessorKey: "userCount",
    header: "Users",
    cell: ({ row }) => {
      const userCount = row.original.userCount;
      return <div>{userCount}</div>
    }
  },
   {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
        const permissions = row.original.permissions;
        return <Badge variant="secondary">{permissions.length} Permissions</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original
 
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
                    <Link href={`/admin/roles/${role._id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                    <DeleteRoleButton id={role._id} />
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
