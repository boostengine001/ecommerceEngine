
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { CreditCard, Truck, Loader2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { createOrder, verifyPayment } from '@/lib/actions/order.actions';
import { useToast } from '@/hooks/use-toast';
import type { ISettings } from '@/models/Setting';
import { getSettings } from '@/lib/actions/setting.actions';
import { PhoneInput } from '@/components/ui/phone-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IAddress } from '@/models/User';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code is required"),
  email: z.string().email(),
  phone: z.string().refine(value => isValidPhoneNumber(value || ''), { message: "Invalid phone number" }),
});

interface CheckoutFormProps {
    totalAmount: number;
    discount: number;
    couponCode?: string;
}

export default function CheckoutForm({ totalAmount, discount, couponCode }: CheckoutFormProps) {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: user?.firstName ? `${user.firstName} ${user.lastName}` : "", 
      email: user?.email || "",
      address: "", 
      city: "", 
      zip: "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (selectedAddressId !== 'new' && user?.addresses) {
      const selectedAddr = user.addresses.find(a => a._id === selectedAddressId);
      if (selectedAddr) {
        form.reset({
          name: selectedAddr.name,
          address: selectedAddr.address,
          city: selectedAddr.city,
          zip: selectedAddr.zip,
          phone: selectedAddr.phone,
          email: user.email || '',
        });
      }
    } else {
       form.reset({
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : "", 
          email: user?.email || "",
          address: "", 
          city: "", 
          zip: "",
          phone: user?.phone || "",
       });
    }
  }, [selectedAddressId, user, form]);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
        const orderPayload = {
            shippingAddress: values,
            items: cartItems.map(item => ({
                productId: item.productId, // Pass the parent product ID
                quantity: item.quantity,
                price: item.price,
                variantSku: item.id.includes('-') ? item.id : undefined
            })),
            totalAmount: totalAmount,
            originalAmount: totalPrice,
            discountAmount: discount,
            couponCode: couponCode,
            saveAddress: selectedAddressId === 'new',
        }

        const serverOrder = await createOrder(orderPayload);
        const settings: ISettings = await getSettings();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: serverOrder.razorpayOrder.amount,
            currency: serverOrder.razorpayOrder.currency,
            name: settings.storeName || "BlueCart",
            description: `Order #${serverOrder.orderId}`,
            image: settings.logoUrl,
            order_id: serverOrder.razorpayOrder.id,
            handler: async function (response: any) {
                const verificationData = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                };

                const result = await verifyPayment(verificationData);

                if (result.isVerified) {
                    clearCart();
                    router.push(`/order-confirmed?orderId=${result.orderId}`);
                } else {
                     toast({
                        variant: "destructive",
                        title: "Payment Failed",
                        description: "Payment verification failed. Please contact support.",
                    });
                }
            },
            prefill: {
                name: values.name,
                email: values.email,
                contact: values.phone,
            },
            notes: {
                address: `${values.address}, ${values.city}, ${values.zip}`
            },
            theme: {
                color: "#3399cc"
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: response.error.description,
            });
             setLoading(false);
        });
        rzp.open();

    } catch (error) {
        console.error("Failed to create order:", error);
        toast({
            variant: "destructive",
            title: "Order Error",
            description: "Could not create the order. Please try again.",
        });
        setLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Truck/> Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {user && user.addresses && user.addresses.length > 0 && (
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-2">
                        {user.addresses.map(addr => (
                            <Label key={addr._id} htmlFor={addr._id} className="flex items-start gap-4 rounded-md border p-4 cursor-pointer has-[:checked]:border-primary">
                                <RadioGroupItem value={addr._id} id={addr._id} />
                                <div>
                                    <p className="font-semibold">{addr.name}</p>
                                    <p className="text-sm text-muted-foreground">{addr.address}, {addr.city}, {addr.zip}</p>
                                </div>
                            </Label>
                        ))}
                         <Label htmlFor="new" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer has-[:checked]:border-primary">
                            <RadioGroupItem value="new" id="new" />
                            <p className="font-semibold">Use a new address</p>
                        </Label>
                    </RadioGroup>
                )}

                <div className={selectedAddressId !== 'new' && user?.addresses && user.addresses.length > 0 ? 'hidden' : 'space-y-4'}>
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={!!user} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <PhoneInput international defaultCountry="IN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>

              <Button type="submit" className="w-full !mt-6" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {loading ? "Processing..." : `Pay ${formatPrice(totalAmount)}`}
              </Button>
            </CardContent>
        </form>
      </Form>
    </Card>
  );
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };
