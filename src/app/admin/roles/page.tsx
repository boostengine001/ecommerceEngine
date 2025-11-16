
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getRoles } from '@/lib/actions/role.actions';
import type { IRole } from '@/models/Role';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import SeedRolesButton from './seed-roles-button';
import {
  Card,
} from '@/components/ui/card';
import { RoleCard } from './role-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type RoleWithUserCount = IRole & { userCount: number };

export default async function AdminRolesPage() {
  const allRoles: RoleWithUserCount[] = await getRoles(true);
  const activeRoles = allRoles.filter(r => !r.isDeleted);
  const deletedRoles = allRoles.filter(r => r.isDeleted);

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

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeRoles.length})</TabsTrigger>
          <TabsTrigger value="deleted">Deleted ({deletedRoles.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4 md:hidden">
            {activeRoles.map((role) => ( <RoleCard key={role._id} role={role} /> ))}
            {activeRoles.length === 0 && (<Card className="flex items-center justify-center p-10"><p className="text-muted-foreground">No active roles found.</p></Card>)}
          </div>
          <div className="hidden md:block"><DataTable columns={columns} data={activeRoles} /></div>
        </TabsContent>
        <TabsContent value="deleted" className="mt-4">
          <div className="grid gap-4 md:hidden">
            {deletedRoles.map((role) => ( <RoleCard key={role._id} role={role} /> ))}
            {deletedRoles.length === 0 && (<Card className="flex items-center justify-center p-10"><p className="text-muted-foreground">No deleted roles found.</p></Card>)}
          </div>
          <div className="hidden md:block"><DataTable columns={columns} data={deletedRoles} /></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
