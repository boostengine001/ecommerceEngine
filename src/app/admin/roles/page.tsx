import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { getRoles } from '@/lib/actions/role.actions';
import type { IRole } from '@/models/Role';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import SeedRolesButton from './seed-roles-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import DeleteRoleButton from './delete-role-button';

type RoleWithUserCount = IRole & { userCount: number };

function RoleCard({ role }: { role: RoleWithUserCount }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{role.name}</CardTitle>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{role.description}</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
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
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Badge variant="secondary">{role.permissions.length} Permissions</Badge>
        <span className="text-sm text-muted-foreground">{role.userCount} User(s)</span>
      </CardContent>
    </Card>
  )
}

export default async function AdminRolesPage() {
  const roles: RoleWithUserCount[] = await getRoles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage admin roles and what they can access.</p>
        </div>
        <div className="flex items-center gap-2">
          <SeedRolesButton />
          <Button asChild>
            <Link href="/admin/roles/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Role
            </Link>
          </Button>
        </div>
      </div>

       {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {roles.map((role) => (
          <RoleCard key={role._id} role={role} />
        ))}
         {roles.length === 0 && (
            <Card className="flex items-center justify-center p-10">
                <p className="text-muted-foreground">No roles found.</p>
            </Card>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={roles} />
      </div>

    </div>
  );
}
