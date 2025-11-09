
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderConfirmedPage() {
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
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
