
'use client';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Package, ShoppingCart, Users, MoreVertical } from 'lucide-react';
import type { IProduct } from '@/models/Product';
import type { IUser } from '@/models/User';
import type { IOrder, IOrderItem } from '@/models/Order';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface AdminDashboardClientProps {
  products: IProduct[];
  users: IUser[];
  orders: IOrder[];
  adminUser: IUser | null;
}

const chartConfigPie = {
  products: {
    label: 'Products',
  },
} as const;

const chartConfigBar = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  }
};


export default function AdminDashboardClient({ products, users, orders, adminUser }: AdminDashboardClientProps) {
  const [timeFilter, setTimeFilter] = useState('all');

  const filteredData = useMemo(() => {
    const now = new Date();
    let filteredOrders = orders;
    let filteredUsers = users;

    if (timeFilter === 'day') {
      filteredOrders = orders.filter(o => new Date(o.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000));
      filteredUsers = users.filter(u => new Date(u.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000));
    } else if (timeFilter === 'week') {
      filteredOrders = orders.filter(o => new Date(o.createdAt) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
       filteredUsers = users.filter(u => new Date(u.createdAt) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    }

    const successfulOrders = filteredOrders.filter(o => o.status !== 'Pending' && o.status !== 'Failed');
    const totalRevenue = successfulOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalSales = successfulOrders.length;
    const totalCustomers = filteredUsers.length;

    const categorySales = successfulOrders.reduce((acc, order) => {
        order.items.forEach((item: any) => {
            const categoryName = item.product?.category?.name || 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = 0;
            }
            acc[categoryName] += item.price * item.quantity;
        });
        return acc;
    }, {} as Record<string, number>);

    const salesPerCategory = Object.entries(categorySales).map(([name, revenue], index) => ({
      name,
      revenue,
      fill: `hsl(var(--chart-${index + 1}))`
    }));

    const productSales = successfulOrders.reduce((acc, order) => {
        order.items.forEach((item: any) => {
            const productId = item.product?._id?.toString();
            if (productId && item.product?.name) {
                 if (!acc[productId]) {
                    acc[productId] = { name: item.product.name, sales: 0 };
                }
                acc[productId].sales += item.quantity;
            }
        });
        return acc;
    }, {} as Record<string, {name: string, sales: number}>);

    const topSellingProducts = Object.values(productSales).sort((a,b) => b.sales - a.sales).slice(0, 5);


    return {
      totalRevenue,
      totalSales,
      totalCustomers,
      recentSales: filteredOrders.slice(0, 5),
      salesPerCategory,
      topSellingProducts
    };

  }, [orders, users, timeFilter]);
  
  const stats = [
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(filteredData.totalRevenue),
      change: `${filteredData.totalSales} successful sales`,
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: `+${filteredData.totalSales}`,
      change: `in selected period`,
      icon: ShoppingCart,
    },
    {
      title: 'New Customers',
      value: `+${filteredData.totalCustomers}`,
      change: `in selected period`,
      icon: Users,
    },
    {
      title: 'Total Products',
      value: products.length.toString(),
      change: `${products.length} active products`,
      icon: Package,
    },
  ];


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': case 'Shipped': case 'Delivered': return 'default';
      case 'Processing': return 'secondary';
      case 'Failed': case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {adminUser?.firstName || 'Admin'}!</h2>
          <p className="text-muted-foreground">Here's a summary of your store's performance.</p>
        </div>
        <Select onValueChange={setTimeFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="day">Last 24 Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
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
                    <TableHead className="text-right"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredData.recentSales.length > 0 ? (
                    filteredData.recentSales.map((sale) => {
                    const user = sale.user as IUser;
                    return (
                        <TableRow key={sale._id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                                <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {user.email}
                                </div>
                            </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(sale.status)}>{sale.status}</Badge>
                        </TableCell>
                        <TableCell>
                            {new Date(sale.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(sale.totalAmount)}</TableCell>
                         <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild><Link href={`/admin/orders/${sale._id}`}>View Order</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link href={`/admin/customers/${user._id}/edit`}>View Customer</Link></DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                         </TableCell>
                        </TableRow>
                    )
                    })
                ) : (
                    <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No recent sales in this period.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

         <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                 {filteredData.salesPerCategory.length > 0 ? (
                    <ChartContainer config={chartConfigPie} className="mx-auto aspect-square max-h-[200px]">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="revenue" hideLabel />} />
                        <Pie data={filteredData.salesPerCategory} dataKey="revenue" nameKey="name" innerRadius={50}>
                          {filteredData.salesPerCategory.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                 ) : (
                    <div className="flex h-[200px] items-center justify-center text-center text-muted-foreground">No sales data for this period.</div>
                 )}
              </CardContent>
            </Card>
             <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredData.topSellingProducts.length > 0 ? (
                    <div className="space-y-4">
                      {filteredData.topSellingProducts.map(p => (
                        <div key={p.name} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{p.name}</span>
                          <span className="text-sm font-bold">{p.sales} units</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-muted-foreground">No sales data for this period.</div>
                  )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
