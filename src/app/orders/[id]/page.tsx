
import { getOrderById } from '@/lib/actions/order.actions';
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
import Link from 'next/link';
import { ArrowLeft, User, Home, Truck, CreditCard } from 'lucide-react';
import type { IOrder, IOrderItem } from '@/models/Order';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';


interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

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

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const order: IOrder | null = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const shipping = order.shippingAddress as any;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-8">
            <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                 <BreadcrumbLink asChild>
                <Link href="/orders">My Orders</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
             <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>Order #{order.orderId}</BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      
       <div className="flex items-center gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.orderId}</h1>
            <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
         </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
           <Card>
            <CardHeader>
                <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map((item: IOrderItem) => (
                            <TableRow key={item.product._id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image src={item.product.media[0].url} alt={item.product.name} width={40} height={40} className="rounded-md object-cover" />
                                        <div>
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.variantSku || 'Standard'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <Separator className="my-4" />
                 <div className="space-y-2 text-right">
                    <div className="flex justify-end gap-4">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                     <div className="flex justify-end gap-4">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-end gap-4 text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                 </div>
            </CardContent>
           </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Truck/> Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <Badge variant={getStatusVariant(order.status)} className="text-base">
                        {order.status}
                    </Badge>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Home/> Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{shipping.name}</p>
                    <p>{shipping.address}</p>
                    <p>{shipping.city}, {shipping.zip}</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
