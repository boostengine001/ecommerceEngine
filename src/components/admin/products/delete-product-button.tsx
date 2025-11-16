
'use client';

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
import { Button, buttonVariants } from '@/components/ui/button';
import { archiveProduct, deleteProductPermanently, recoverProduct } from '@/lib/actions/product.actions';
import { cn } from '@/lib/utils';
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface ProductActionButtonsProps {
  product: { _id: string; isActive: boolean };
}

export default function ProductActionButtons({ product }: ProductActionButtonsProps) {
  const { toast } = useToast();

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred while performing the action.' });
    }
  };

  return (
    <>
      {product.isActive ? (
         <AlertDialog>
          <AlertDialogTrigger asChild>
             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="w-full justify-start p-2 h-auto font-normal text-sm">
                <Archive className="mr-2 h-4 w-4" />
                Archive
             </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will archive the product, hiding it from the storefront.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction(() => archiveProduct(product._id), 'Product archived')}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
         <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction(() => recoverProduct(product._id), 'Product recovered')}} className="w-full justify-start text-sm font-normal">
          <ArchiveRestore className="mr-2 h-4 w-4" />
          Recover
        </DropdownMenuItem>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive w-full justify-start p-2 h-auto font-normal text-sm"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Permanently
          </DropdownMenuItem>
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
            <AlertDialogAction onClick={() => handleAction(() => deleteProductPermanently(product._id), 'Product deleted permanently')} className={buttonVariants({ variant: 'destructive' })}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
