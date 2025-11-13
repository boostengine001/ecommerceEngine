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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { getOrders } from '@/lib/actions/order.actions';
import type { IOrder } from '@/models/Order';
import type { IUser } from '@/models/User';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const users = await getUsers();
  const orders = await getOrders();

  const successfulOrders = orders.filter(o => o.status !== 'Pending' && o.status !== 'Failed');

  const totalRevenue = successfulOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalSales = successfulOrders.length;
  
  const stats = [
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
      change: `${totalSales} successful sales`,
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: `+${totalSales}`,
      change: `Across all time`,
      icon: ShoppingCart,
    },
    {
      title: 'Active Customers',
      value: `+${users.length}`,
      change: `${users.length} registered`,
      icon: Users,
    },
    {
      title: 'Total Products',
      value: products.length.toString(),
      change: `${products.length} products available`,
      icon: Package,
    },
  ];

  const recentSales: IOrder[] = orders.slice(0, 5);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Shipped':
      case 'Delivered':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Failed':
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Your 5 most recent sales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <Link href={`/admin/orders/${sale._id}`}>
                        <div className="font-medium hover:underline">{(sale.user as IUser).firstName} {(sale.user as IUser).lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          {(sale.user as IUser).email}
                        </div>
                      </Link>
                    </TableCell>
                     <TableCell>
                      <Badge
                        variant={getStatusVariant(sale.status)}
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{formatPrice(sale.totalAmount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No recent sales.
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
