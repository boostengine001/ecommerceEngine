
'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { deleteCategory } from '@/lib/actions/category.actions';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

interface DeleteCategoryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    id: string;
}

export default function DeleteCategoryButton({ id, variant, className, ...props }: DeleteCategoryButtonProps) {
  return (
    <Button variant={variant || "destructive"} className={cn(className)} onClick={async () => {
      if(confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
        await deleteCategory(id);
      }
    }} {...props}>
      Delete
    </Button>
  );
}
