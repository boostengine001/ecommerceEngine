
import { getOrderById, updateOrderStatus } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
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
import { ArrowLeft, User, Home, Truck, CreditCard } from 'lucide-react';
import type { IOrder, IOrderItem } from '@/models/Order';
import OrderStatusUpdater from '@/components/admin/orders/order-status-updater';


interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
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

  const user = order.user as any;
  const shipping = order.shippingAddress as any;

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
            <h2 className="text-3xl font-bold tracking-tight">Order #{order.orderId}</h2>
            <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
         </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard /> Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium">Razorpay Payment ID</p>
                        <p className="text-muted-foreground">{order.razorpayPaymentId}</p>
                    </div>
                     <div>
                        <p className="font-medium">Razorpay Order ID</p>
                        <p className="text-muted-foreground">{order.razorpayOrderId}</p>
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
                <CardFooter>
                    <OrderStatusUpdater orderId={order._id} currentStatus={order.status} />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User/> Customer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-muted-foreground">{user.email}</p>
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
