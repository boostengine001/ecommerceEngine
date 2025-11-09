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

export default async function AdminDashboardPage() {

  const products = await getProducts();
  const users = await getUsers();
  // NOTE: Order data is not implemented yet.
  const totalRevenue = 0;
  const totalSales = 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
      change: 'No sales data yet',
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: `+${totalSales}`,
      change: 'No sales data yet',
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

  const recentSales: any[] = [];

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
            A list of recent sales from your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <TableRow key={sale.email}>
                    <TableCell>
                      <div className="font-medium">{sale.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {sale.email}
                      </div>
                    </TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sale.status === 'Shipped' || sale.status === 'Delivered'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{sale.amount}</TableCell>
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