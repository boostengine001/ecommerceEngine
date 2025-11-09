
'use client';

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
import { Skeleton } from '@/components/ui/skeleton';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  // NOTE: This page is using static data until order creation is implemented.
  const order = null;

  if (!order) {
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
                    <h2 className="text-3xl font-bold tracking-tight">Order Not Found</h2>
                    <p className="text-muted-foreground">This order does not exist or has not been created yet.</p>
                </div>
             </div>
             <div className="text-center py-16 text-muted-foreground">
                There are no orders yet.
            </div>
        </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    // This part of the code is currently unreachable as there are no orders.
    // It is kept for when order creation is implemented.
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Orders</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
