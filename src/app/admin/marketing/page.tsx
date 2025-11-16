
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllBanners } from '@/lib/actions/banner.actions';
import type { IBanner } from '@/models/Banner';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export const dynamic = 'force-dynamic';

export default async function AdminMarketingPage() {
  const allBanners: IBanner[] = await getAllBanners(true);
  const activeBanners = allBanners.filter(b => !b.isDeleted);
  const deletedBanners = allBanners.filter(b => b.isDeleted);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Banners</h2>
          <p className="text-muted-foreground">Manage your promotional banners.</p>
        </div>
        <Button asChild>
          <Link href="/admin/marketing/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
          </Link>
        </Button>
      </div>

       <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeBanners.length})</TabsTrigger>
          <TabsTrigger value="deleted">Deleted ({deletedBanners.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <DataTable columns={columns} data={activeBanners} />
        </TabsContent>
        <TabsContent value="deleted" className="mt-4">
           <DataTable columns={columns} data={deletedBanners} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
