

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
import { getUsers } from '@/lib/actions/user.actions';
import type { IUser } from '@/models/User';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { IRole } from '@/models/Role';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserActions from './user-actions';

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
          <p className="text-sm text-muted-foreground">{user.email || user.phone}</p>
        </div>
        <UserActions user={user} />
      </CardHeader>
       <CardFooter className="gap-2">
          {user.isGuest && <Badge variant="secondary">Guest</Badge>}
          {role ? (
            <Badge variant="outline">{role.name}</Badge>
          ) : !user.isGuest && (
            <span className="text-sm text-muted-foreground">No Role</span>
          )}
          {user.isDeleted && <Badge variant="destructive">Deleted</Badge>}
        </CardFooter>
    </Card>
  )
}


export default async function AdminCustomersPage() {
  const users = await getUsers(true);
  const activeUsers = users.filter(u => !u.isDeleted && !u.isGuest);
  const deletedUsers = users.filter(u => u.isDeleted);
  const guestUsers = users.filter(u => u.isGuest && !u.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">View and manage your customers.</p>
        </div>
      </div>
      
       <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="guests">Guests ({guestUsers.length})</TabsTrigger>
          <TabsTrigger value="deleted">Deleted ({deletedUsers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {activeUsers.map((user) => (
                <CustomerCard key={user._id} user={user} />
                ))}
                {activeUsers.length === 0 && (
                    <Card className="flex items-center justify-center p-10">
                        <p className="text-muted-foreground">No active customers found.</p>
                    </Card>
                )}
            </div>
             {/* Desktop View */}
            <div className="hidden md:block">
                <Card>
                <CardHeader>
                    <CardTitle>Active Customers</CardTitle>
                    <CardDescription>
                    A list of all active users in your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeUsers.length > 0 ? activeUsers.map((user: IUser) => (
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
                            <TableCell>{user.email || user.phone}</TableCell>
                            <TableCell>
                            <div className="flex items-center gap-2">
                                {user.isGuest && <Badge variant="secondary">Guest</Badge>}
                                {user.role ? (
                                    <Badge variant="outline">{(user.role as IRole).name}</Badge>
                                ) : !user.isGuest && (
                                    <span className="text-muted-foreground">No Role</span>
                                )}
                            </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} />
                            </TableCell>
                        </TableRow>
                        )) : (
                             <TableRow><TableCell colSpan={4} className="h-24 text-center">No active customers found.</TableCell></TableRow>
                        )}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </div>
        </TabsContent>
         <TabsContent value="guests" className="mt-4">
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {guestUsers.map((user) => (
                <CustomerCard key={user._id} user={user} />
                ))}
                {guestUsers.length === 0 && (
                    <Card className="flex items-center justify-center p-10">
                        <p className="text-muted-foreground">No guest customers found.</p>
                    </Card>
                )}
            </div>
            {/* Desktop View */}
            <div className="hidden md:block">
                <Card>
                <CardHeader>
                    <CardTitle>Guest Customers</CardTitle>
                    <CardDescription>
                    A list of all guest users who have placed an order.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                     <TableHeader>
                        <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {guestUsers.length > 0 ? guestUsers.map((user: IUser) => (
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
                            <TableCell>{user.email || user.phone}</TableCell>
                            <TableCell>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">Guest</Badge>
                            </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} />
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">No guest customers found.</TableCell></TableRow>
                        )}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="deleted" className="mt-4">
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {deletedUsers.map((user) => (
                <CustomerCard key={user._id} user={user} />
                ))}
                {deletedUsers.length === 0 && (
                    <Card className="flex items-center justify-center p-10">
                        <p className="text-muted-foreground">No deleted customers found.</p>
                    </Card>
                )}
            </div>
            {/* Desktop View */}
            <div className="hidden md:block">
                <Card>
                <CardHeader>
                    <CardTitle>Deleted Customers</CardTitle>
                    <CardDescription>
                    A list of all deleted users from your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                     <TableHeader>
                        <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deletedUsers.length > 0 ? deletedUsers.map((user: IUser) => (
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
                            <TableCell>{user.email || user.phone}</TableCell>
                            <TableCell>
                            <div className="flex items-center gap-2">
                                {user.isGuest && <Badge variant="secondary">Guest</Badge>}
                                {user.role ? (
                                    <Badge variant="outline">{(user.role as IRole).name}</Badge>
                                ) : !user.isGuest && (
                                    <span className="text-muted-foreground">No Role</span>
                                )}
                            </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} />
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">No deleted customers found.</TableCell></TableRow>
                        )}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
