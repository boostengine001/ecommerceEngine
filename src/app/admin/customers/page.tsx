
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUsers } from '@/lib/actions/user.actions';
import type { IUser } from '@/models/User';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { IRole } from '@/models/Role';

function CustomerCard({ user }: { user: IUser }) {
  const role = user.role as IRole | null;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/customers/${user._id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>View Orders</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardHeader>
       <CardFooter>
          {role ? (
            <Badge variant="secondary">{role.name}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">No Role</span>
          )}
        </CardFooter>
    </Card>
  )
}


export default async function AdminCustomersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">View and manage your customers.</p>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {users.map((user) => (
          <CustomerCard key={user._id} user={user} />
        ))}
         {users.length === 0 && (
            <Card className="flex items-center justify-center p-10">
                <p className="text-muted-foreground">No customers found.</p>
            </Card>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              A list of all registered users in your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.map((user: IUser) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role ? (
                        <Badge variant="secondary">{(user.role as IRole).name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No Role</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/customers/${user._id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>View Orders</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!users || users.length === 0) && (
                <div className="py-10 text-center text-muted-foreground">
                  No customers found.
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
