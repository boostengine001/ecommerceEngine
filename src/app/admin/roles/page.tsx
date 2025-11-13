
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getRoles } from '@/lib/actions/role.actions';
import type { IRole } from '@/models/Role';
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function AdminRolesPage() {
  const roles: IRole[] = await getRoles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage admin roles and what they can access.</p>
        </div>
        <Button asChild>
          <Link href="/admin/roles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Role
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={roles} />
    </div>
  );
}
