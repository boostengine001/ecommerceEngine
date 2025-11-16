
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, Tooltip } from 'recharts';
import { useMemo, useState, useEffect } from 'react';
import { DollarSign, Package, Users, ShoppingCart, TrendingUp, UserPlus } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { getOrders } from '@/lib/actions/order.actions';
import type { IProduct } from '@/models/Product';
import type { IUser } from '@/models/User';
import type { IOrder } from '@/models/Order';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const chartConfigPie = { products: { label: 'Products' } } as const;
const chartConfigBar = { sales: { label: 'Sales', color: 'hsl(var(--chart-1))' } };
const chartConfigLine = { revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' } };

const CustomYAxisTick = ({ y, payload }: any) => {
  return (
    <g transform={`translate(0,${y})`}>
      <text x={0} y={0} dy={4} textAnchor="start" fill="#666" style={{ fontSize: 12 }}>
        {payload.value}
      </text>
    </g>
  );
};


export default function AnalyticsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [prods, userList, orderList] = await Promise.all([
        getProducts(),
        getUsers(true), // get all users including guests to calculate new customers
        getOrders(),
      ]);
      setProducts(prods);
      setUsers(userList);
      setOrders(orderList);
      setLoading(false);
    }
    fetchData();
  }, []);

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
    const totalRevenue = successfulOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const avgOrderValue = successfulOrders.length > 0 ? totalRevenue / successfulOrders.length : 0;
    const newCustomers = filteredUsers.length;

    const revenueOverTime = successfulOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += order.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const revenueChartData = Object.entries(revenueOverTime).map(([date, revenue]) => ({ date, revenue })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

    const topSellingProducts = Object.values(productSales).sort((a,b) => b.sales - a.sales).slice(0, 10);
    
    const categoryCount = products.reduce((acc, product) => {
        const categoryName = (product.category as any)?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const productsPerCategory = Object.entries(categoryCount).map(([name, products], index) => ({ name, products, fill: `hsl(var(--chart-${index + 1}))`}));

    const orderStatusCounts = filteredOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const ordersByStatus = Object.entries(orderStatusCounts).map(([name, count], index) => ({ name, count, fill: `hsl(var(--chart-${index+1}))`}));

    return {
      totalRevenue,
      avgOrderValue,
      newCustomers,
      totalOrders: successfulOrders.length,
      revenueChartData,
      topSellingProducts,
      productsPerCategory,
      ordersByStatus,
    };
  }, [orders, users, products, timeFilter]);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  const stats = [
    { title: 'Total Revenue', value: formatPrice(filteredData.totalRevenue), icon: DollarSign },
    { title: 'Total Orders', value: filteredData.totalOrders.toString(), icon: ShoppingCart },
    { title: 'Avg. Order Value', value: formatPrice(filteredData.avgOrderValue), icon: TrendingUp },
    { title: 'New Customers', value: filteredData.newCustomers.toString(), icon: UserPlus },
  ];

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                  <p className="text-muted-foreground">Get insights into your store's performance.</p>
                </div>
                 <Skeleton className="h-10 w-[180px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2"/></CardContent></Card>)}
            </div>
             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle><CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription></CardHeader>
                        <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
                    </Card>
                ))}
            </div>
          </div>
      )
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Get insights into your store's performance.</p>
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
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
            <CardContent>
              {filteredData.revenueChartData.length > 0 ? (
                <ChartContainer config={chartConfigLine} className="h-[250px] w-full">
                    <LineChart data={filteredData.revenueChartData} margin={{ left: 12, right: 12 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => formatPrice(value).replace('₹', '')} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                      <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">No revenue data for this period.</div>
              )}
            </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>A breakdown of products across categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             {filteredData.productsPerCategory.length > 0 ? (
                <ChartContainer config={chartConfigPie} className="mx-auto aspect-square max-h-[250px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="products" hideLabel />} />
                    <Pie data={filteredData.productsPerCategory} dataKey="products" nameKey="name" innerRadius={60}>
                      {filteredData.productsPerCategory.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ChartContainer>
             ) : (
                <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">No product data available.</div>
             )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products by units sold.</CardDescription>
          </CardHeader>
          <CardContent>
             {filteredData.topSellingProducts.length > 0 ? (
                <ChartContainer config={chartConfigBar} className="h-[250px] w-full">
                    <BarChart data={filteredData.topSellingProducts} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5}}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} tick={<CustomYAxisTick />} />
                        <XAxis type="number" dataKey="sales"/>
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                </ChartContainer>
             ) : (
                <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">No sales data available yet.</div>
             )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Orders by Status</CardTitle></CardHeader>
            <CardContent>
                 {filteredData.ordersByStatus.length > 0 ? (
                    <ChartContainer config={chartConfigPie} className="mx-auto aspect-square max-h-[250px]">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                        <Pie data={filteredData.ordersByStatus} dataKey="count" nameKey="name" innerRadius={60}>
                          {filteredData.ordersByStatus.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                 ) : (
                    <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">No order data for this period.</div>
                 )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    