
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
import { deleteRole } from '@/lib/actions/role.actions';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface DeleteRoleButtonProps {
  id: string;
}

export default function DeleteRoleButton({ id }: DeleteRoleButtonProps) {
  
  const handleDelete = async () => {
    try {
      await deleteRole(id);
    } catch (error) {
      console.error("Failed to delete role:", error);
      alert("Failed to delete role. See console for details.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start p-2 h-auto font-normal text-destructive hover:text-destructive")}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role. Users assigned to this role will lose their admin permissions.
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
