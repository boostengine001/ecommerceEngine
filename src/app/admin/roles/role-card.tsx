
'use client';

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
import type { IRole } from '@/models/Role';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

type RoleWithUserCount = IRole & { userCount: number };

export function RoleCard({ role }: { role: RoleWithUserCount }) {
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
                 <DeleteRoleButton role={role} />
            </DropdownMenuContent>
            </DropdownMenu>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Badge variant="secondary">{role.permissions.length} Permissions</Badge>
            <span className="text-sm text-muted-foreground">{role.userCount} User(s)</span>
        </div>
        <Badge variant={role.isDeleted ? 'destructive' : 'default'}>{role.isDeleted ? 'Deleted' : 'Active'}</Badge>
      </CardContent>
    </Card>
  )
}
