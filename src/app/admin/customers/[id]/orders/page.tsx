
import { getOrdersByUserId } from '@/lib/actions/order.actions';
import { getUser } from '@/lib/actions/user.actions';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import type { IOrder } from '@/models/Order';
import type { IUser } from '@/models/User';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CustomerOrdersPageProps {
  params: {
    id: string;
  };
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Paid': case 'Shipped': case 'Delivered': return 'default';
        case 'Processing': return 'secondary';
        case 'Failed': case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
};

export default async function CustomerOrdersPage({ params }: CustomerOrdersPageProps) {
  const [user, orders] = await Promise.all([
    getUser(params.id),
    getOrdersByUserId(params.id)
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Customers</span>
          </Link>
        </Button>
         <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders for {user.firstName} {user.lastName}</h2>
            <p className="text-muted-foreground">
                View all orders placed by this customer.
            </p>
         </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            A list of all orders placed by {user.firstName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length > 0 ? (
                    orders.map((order: IOrder) => (
                        <TableRow key={order._id}>
                            <TableCell className="font-medium">
                                <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                                    #{order.orderId}
                                </Link>
                            </TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatPrice(order.totalAmount)}</TableCell>
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
                                      <Link href={`/admin/orders/${order._id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            This customer has not placed any orders yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
