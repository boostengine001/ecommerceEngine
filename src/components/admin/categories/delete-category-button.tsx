
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
import { Button } from '@/components/ui/button';
import { deleteCategory, recoverCategory, deleteCategoryPermanently } from '@/lib/actions/category.actions';
import { cn } from '@/lib/utils';
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ICategory } from '@/models/Category';

interface DeleteCategoryButtonProps {
  category: ICategory;
}

export default function DeleteCategoryButton({ category }: DeleteCategoryButtonProps) {
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
    <>
      {category.isDeleted ? (
        <Button variant="ghost" className="w-full justify-start text-sm font-normal" onClick={() => handleAction(() => recoverCategory(category._id), 'Category recovered')}>
          <ArchiveRestore className="mr-2 h-4 w-4" />
          Recover
        </Button>
      ) : (
        <Button variant="ghost" className="w-full justify-start text-sm font-normal" onClick={() => handleAction(() => deleteCategory(category._id), 'Category deleted')}>
          <Archive className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'w-full justify-start font-normal text-destructive hover:text-destructive'
          )}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Permanently
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and all its subcategories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAction(() => deleteCategoryPermanently(category._id), 'Category deleted permanently')} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
