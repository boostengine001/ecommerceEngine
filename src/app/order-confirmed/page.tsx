
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="mt-4 text-3xl">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          {orderId && (
            <p className="text-muted-foreground">
              Your Order ID is: <span className="font-semibold text-foreground">#{orderId}</span>. 
              You will receive an email confirmation shortly.
            </p>
          )}
          <div className="mt-6 flex flex-col gap-4">
            {orderId && (
                <Button asChild variant="outline">
                    <Link href={`/orders`}>View My Orders</Link>
                </Button>
            )}
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
