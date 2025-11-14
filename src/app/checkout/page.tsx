
"use client";

import CheckoutForm from "@/components/checkout/checkout-form";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { applyCoupon } from "@/lib/actions/coupon.actions";
import type { ICoupon } from "@/models/Coupon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { cartItems, totalPrice, totalItems } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (totalItems === 0) {
      router.replace('/');
    }
  }, [totalItems, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const result = await applyCoupon(couponCode, totalPrice);
      if (result.success && result.coupon && result.discount) {
        setAppliedCoupon(result.coupon);
        setDiscount(result.discount);
        toast({ title: "Coupon Applied", description: `Discount of ${formatPrice(result.discount)} applied.`});
      } else {
        toast({ variant: "destructive", title: "Invalid Coupon", description: result.error });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not apply coupon." });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };


  const finalTotal = totalPrice - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };
  
  if (totalItems === 0) {
    return null; // or a loading spinner while redirecting
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
      </div>
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
        <div className="lg:order-last">
           <Card>
            <CardHeader>
              <CardTitle>Order Summary ({totalItems} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4">
                <div className="flex flex-col gap-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image src={item.image} alt={item.name} className="rounded-md object-cover" fill />
                        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.quantity}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                 {!appliedCoupon ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Coupon code" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={couponLoading}
                      />
                      <Button onClick={handleApplyCoupon} disabled={!couponCode || couponLoading}>
                        {couponLoading ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between text-destructive">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>- {formatPrice(discount)}</span>
                    </div>
                  )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                {appliedCoupon && <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleRemoveCoupon}>Remove Coupon</Button>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:order-first">
          <CheckoutForm 
            totalAmount={finalTotal}
            discount={discount}
            couponCode={appliedCoupon?.code}
          />
        </div>
      </div>
    </div>
  );
}
