
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

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
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction(() => recoverRole(role._id), 'Role recovered')}}>
          <ArchiveRestore className="mr-2 h-4 w-4" />
          Recover
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem onSelect={(e) => {e.preventDefault(); handleAction(() => deleteRole(role._id), 'Role deleted')}}>
          <Archive className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive"
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
