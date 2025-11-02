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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { orders } from '@/lib/orders';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  products: {
    label: 'Products',
    color: 'hsl(var(--chart-2))',
  }
};

export default function AnalyticsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
        const prods = await getProducts();
        setProducts(prods);
        setLoading(false);
    }
    fetchProducts();
  }, []);

  const { monthlyRevenue, totalRevenue, totalOrders, totalCustomers, topSellingProducts } = useMemo(() => {
    if (loading) {
      return { monthlyRevenue: [], totalRevenue: 0, totalOrders: 0, totalCustomers: 0, topSellingProducts: [] };
    }

    const monthlyRevenueMap = new Map<string, number>();
    let totalRevenue = 0;
    const customerEmails = new Set<string>();

    orders.forEach((order) => {
      totalRevenue += order.total;
      customerEmails.add(order.customer.email);

      const month = new Date(order.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyRevenueMap.set(month, (monthlyRevenueMap.get(month) || 0) + order.total);
    });

    const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month) < new Date(b.month) ? -1 : 1);


    const productSalesMap = new Map<string, number>();
    orders.forEach(order => {
        order.items.forEach(item => {
            productSalesMap.set(item.name, (productSalesMap.get(item.name) || 0) + item.quantity);
        });
    });

    const topSellingProducts = Array.from(productSalesMap.entries())
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);


    return {
      monthlyRevenue,
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customerEmails.size,
      topSellingProducts,
    };
  }, [loading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const stats = [
    { title: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign },
    { title: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart },
    { title: 'Total Customers', value: totalCustomers.toString(), icon: Users },
    { title: 'Total Products', value: products.length.toString(), icon: Package },
  ];

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                  <p className="text-muted-foreground">Get insights into your store's performance.</p>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2"/></CardContent></Card>)}
            </div>
             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 <Card><CardHeader><Skeleton className="h-6 w-1/2"/></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>
                 <Card><CardHeader><Skeleton className="h-6 w-1/2"/></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>A summary of your store's revenue per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={monthlyRevenue} margin={{ left: -20, right: 20, top: 5, bottom: 5}}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8}/>
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                   <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products by units sold.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={topSellingProducts} layout="vertical" margin={{ left: 20, right: 0, top: 5, bottom: 5}}>
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
                    <XAxis type="number" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="var(--color-products)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
