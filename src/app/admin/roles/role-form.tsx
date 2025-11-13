
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PERMISSION_GROUPS, type Permission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { IRole } from '@/models/Role';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Role name is required.'),
  description: z.string().min(5, 'Description is required.'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required.'),
});

interface RoleFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: IRole;
  buttonLabel: string;
  loadingButtonLabel: string;
}

export default function RoleForm({
  action,
  initialData,
  buttonLabel,
  loadingButtonLabel
}: RoleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?._id,
      name: initialData?.name || '',
      description: initialData?.description || '',
      permissions: initialData?.permissions || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = new FormData();
    if(values.id) {
        formData.append('id', values.id);
    }
    formData.append('name', values.name);
    formData.append('description', values.description);
    values.permissions.forEach(p => formData.append('permissions', p));

    try {
      await action(formData);
      router.push('/admin/roles');
    } catch (error) {
      console.error('Failed to save role:', error);
      alert('Failed to save role. See console for details.');
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
                <CardTitle>Role Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., Product Manager" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="A short description of this role's responsibilities." />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      {PERMISSION_GROUPS.map((group) => (
                        <div key={group.group} className="space-y-2 border-b last:border-b-0 pb-4 last:pb-0">
                          <FormLabel className="text-base font-semibold">{group.group}</FormLabel>
                          <div className="space-y-2">
                             {group.permissions.map((permission) => (
                               <FormField
                                key={permission.id}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(permission.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...field.value, permission.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== permission.id
                                                        )
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {permission.label}
                                        </FormLabel>
                                    </FormItem>
                                )}
                               />
                             ))}
                          </div>
                        </div>
                      ))}
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
                    <CardTitle>Save Role</CardTitle>
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
