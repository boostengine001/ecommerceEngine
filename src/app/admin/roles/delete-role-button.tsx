
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
import { deleteRole, recoverRole, deleteRolePermanently } from '@/lib/actions/role.actions';
import { cn } from '@/lib/utils';
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import type { IRole } from '@/models/Role';
import { useToast } from '@/hooks/use-toast';

interface DeleteRoleButtonProps {
  role: IRole;
}

export default function DeleteRoleButton({ role }: DeleteRoleButtonProps) {
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
      {role.isDeleted ? (
        <Button variant="ghost" className="w-full justify-start text-sm font-normal" onClick={() => handleAction(() => recoverRole(role._id), 'Role recovered')}>
          <ArchiveRestore className="mr-2 h-4 w-4" />
          Recover
        </Button>
      ) : (
        <Button variant="ghost" className="w-full justify-start text-sm font-normal" onClick={() => handleAction(() => deleteRole(role._id), 'Role deleted')}>
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
              This action cannot be undone. This will permanently delete the role. Users assigned to this role will lose their admin permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAction(() => deleteRolePermanently(role._id), 'Role deleted permanently')} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
