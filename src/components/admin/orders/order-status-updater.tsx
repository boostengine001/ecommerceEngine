
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatus } from '@/lib/actions/order.actions';
import { useToast } from '@/hooks/use-toast';

const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;

    setLoading(true);
    try {
      await updateOrderStatus(orderId, selectedStatus);
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${selectedStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update status', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the order status.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Select
        defaultValue={currentStatus}
        onValueChange={setSelectedStatus}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Change status..." />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={loading || selectedStatus === currentStatus}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
