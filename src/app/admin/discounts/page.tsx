
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllCoupons } from '@/lib/actions/coupon.actions';
import type { ICoupon } from '@/models/Coupon';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const dynamic = 'force-dynamic';

export default async function AdminDiscountsPage() {
  const allCoupons: ICoupon[] = await getAllCoupons(true);
  const activeCoupons = allCoupons.filter(c => !c.isDeleted);
  const deletedCoupons = allCoupons.filter(c => c.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discounts & Coupons</h2>
          <p className="text-muted-foreground">Create and manage coupon codes.</p>
        </div>
        <Button asChild>
          <Link href="/admin/discounts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeCoupons.length})</TabsTrigger>
          <TabsTrigger value="deleted">Deleted ({deletedCoupons.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <DataTable columns={columns} data={activeCoupons} />
        </TabsContent>
        <TabsContent value="deleted" className="mt-4">
          <DataTable columns={columns} data={deletedCoupons} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
