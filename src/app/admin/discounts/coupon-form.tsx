
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { ICoupon } from '@/models/Coupon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';


const formSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3, 'Code must be at least 3 characters.'),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0, 'Value must be a positive number.'),
  expiryDate: z.date(),
  minSpend: z.coerce.number().min(0).optional(),
  isActive: z.boolean(),
});

interface CouponFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: ICoupon;
  buttonLabel: string;
  loadingButtonLabel: string;
}

export default function CouponForm({
  action,
  initialData,
  buttonLabel,
  loadingButtonLabel
}: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?._id,
      code: initialData?.code || '',
      type: initialData?.type || 'percentage',
      value: initialData?.value || 0,
      expiryDate: initialData ? new Date(initialData.expiryDate) : undefined,
      minSpend: initialData?.minSpend || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = new FormData();
    if(values.id) formData.append('id', values.id);
    formData.append('code', values.code);
    formData.append('type', values.type);
    formData.append('value', values.value.toString());
    formData.append('expiryDate', values.expiryDate.toISOString());
    if (values.minSpend) formData.append('minSpend', values.minSpend.toString());
    formData.append('isActive', values.isActive ? 'on' : 'off');


    try {
      await action(formData);
      router.push('/admin/discounts');
    } catch (error: any) {
      console.error('Failed to save coupon:', error);
      alert(error.message || 'Failed to save coupon. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Details</CardTitle>
                <CardDescription>Configure the coupon code and its discount value.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., SUMMER20" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} placeholder="e.g., 20 or 500"/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Conditions</CardTitle>
                    <CardDescription>Set rules for when this coupon can be used.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="minSpend"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Minimum Spend (optional)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} placeholder="e.g., 1000" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Expiry Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                     <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                                <FormDescription>
                                    Customers can use this coupon.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Save Coupon</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? loadingButtonLabel : buttonLabel}
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
