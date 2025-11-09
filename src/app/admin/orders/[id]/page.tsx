
'use client';

import { getOrderById } from '@/lib/orders';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const order = getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Orders</span>
          </Link>
        </Button>
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Order #{order.id}</h2>
            <p className="text-muted-foreground">Details for order placed on {order.date}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] hidden sm:table-cell"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                     <Separator className="my-2"/>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Status</CardTitle>
              <Badge 
                variant={
                    order.status === 'Shipped' || order.status === 'Delivered'
                        ? 'default'
                        : order.status === 'Processing' 
                        ? 'secondary'
                        : 'outline'
                }
              >
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
               <Select defaultValue={order.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full mt-4">Update Status</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                <Separator/>
                <h4 className="font-medium">Shipping Address</h4>
                <address className="not-italic text-sm text-muted-foreground">
                    {order.shippingAddress.address}<br/>
                    {order.shippingAddress.city}, {order.shippingAddress.zip}
                </address>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
