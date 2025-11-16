
"use client"

import type { ICoupon } from "@/models/Coupon";
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
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { deleteCoupon, recoverCoupon, deleteCouponPermanently } from "@/lib/actions/coupon.actions";
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
import { useToast } from "@/hooks/use-toast";

function CouponActions({ coupon }: { coupon: ICoupon }) {
  const { toast } = useToast();

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };

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
          <Link href={`/admin/discounts/${coupon._id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {coupon.isDeleted ? (
          <DropdownMenuItem onClick={() => handleAction(() => recoverCoupon(coupon._id), "Coupon recovered")}>
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Recover
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleAction(() => deleteCoupon(coupon._id), "Coupon deleted")}>
            <Archive className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the coupon.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction(() => deleteCouponPermanently(coupon._id), "Coupon deleted permanently")} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
};

export const columns: ColumnDef<ICoupon>[] = [
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
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Code" />
      )
    },
    cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.code}</Badge>
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span className="capitalize">{row.original.type}</span>
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
        const coupon = row.original;
        return coupon.type === 'percentage'
            ? `${coupon.value}%`
            : formatPrice(coupon.value);
    }
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => new Date(row.original.expiryDate).toLocaleDateString()
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const coupon = row.original;
        const isExpired = new Date(coupon.expiryDate) < new Date();
        
        if(coupon.isDeleted) {
          return <Badge variant="destructive">Deleted</Badge>
        }
        if (isExpired) {
            return <Badge variant="outline">Expired</Badge>
        }
        return <Badge variant={coupon.isActive ? 'default' : 'secondary'}>{coupon.isActive ? 'Active' : 'Inactive'}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CouponActions coupon={row.original} />,
  },
]
