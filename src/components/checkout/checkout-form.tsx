
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { CreditCard, Truck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const shippingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits.").refine(val => !isNaN(parseInt(val)), "Card number must be digits."),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvc: z.string().min(3, "CVC must be 3 or 4 digits.").max(4, "CVC must be 3 or 4 digits.").refine(val => !isNaN(parseInt(val)), "CVC must be digits."),
});

const formSchema = shippingSchema.merge(paymentSchema);

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: user?.displayName || "", 
      address: "", 
      city: "", 
      zip: "", 
      cardNumber: "", 
      expiry: "", 
      cvc: "" 
    },
  });

  const handleNextStep = async () => {
    const isValid = await form.trigger(["name", "address", "city", "zip"]);
    if (isValid) {
      setStep(2);
    }
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Order submitted:", values);
    clearCart();
    router.push('/order-confirmed');
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={step === 1 ? 'block' : 'hidden'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Truck/> Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
              <Button type="button" onClick={handleNextStep} className="w-full !mt-6">Continue to Payment</Button>
            </CardContent>
          </div>

          <div className={step === 2 ? 'block' : 'hidden'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard/> Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="cardNumber" render={({ field }) => (
                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="expiry" render={({ field }) => (
                  <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cvc" render={({ field }) => (
                  <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex flex-col-reverse gap-4 sm:flex-row !mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">Back to Shipping</Button>
                <Button type="submit" className="w-full">Place Order</Button>
              </div>
            </CardContent>
          </div>
        </form>
      </Form>
    </Card>
  );
}
