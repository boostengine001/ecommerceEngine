
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
import { deleteCategory } from '@/lib/actions/category.actions';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

interface DeleteCategoryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  id: string;
}

export default function DeleteCategoryButton({
  id,
  variant,
  className,
  ...props
}: DeleteCategoryButtonProps) {
  const handleDelete = async () => {
    await deleteCategory(id);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant || 'destructive'} className={cn(className)} {...props}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category and all of its subcategories.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: 'destructive' })}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
