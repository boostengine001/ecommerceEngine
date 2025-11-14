
'use client';

import { useAuth, type ClientUser } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { updateUserProfile } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import ImageDropzone from '@/components/admin/image-dropzone';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your new password.'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
});


function ProfileForm({ user }: { user: ClientUser }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    },
  });
  
  const handleProfileSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData(data.currentTarget);
    formData.append('id', user.id);
    
    try {
        await updateUserProfile(formData);
        toast({ title: 'Profile Updated', description: 'Your information has been saved.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleProfileSubmit}>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name, email address and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <ImageDropzone name="avatar" initialImage={user.avatar} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input id='firstName' name='firstName' defaultValue={user.firstName} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input id='lastName' name='lastName' defaultValue={user.lastName} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input type='email' value={user.email} readOnly disabled />
            </div>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </CardContent>
      </form>
    </Card>
  );
}

function PasswordForm({ userId }: { userId: string }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof passwordSchema>>({
      resolver: zodResolver(passwordSchema),
      defaultValues: { currentPassword: '', newPassword: '', confirmPassword: ''},
    });

    const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
        setLoading(true);
        
        const formData = new FormData();
        formData.append('id', userId);
        formData.append('currentPassword', values.currentPassword);
        formData.append('newPassword', values.newPassword);
        
        try {
            await updateUserProfile(formData);
            toast({ title: 'Password Updated', description: 'Your password has been changed successfully.' });
            form.reset();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update password.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account's password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField control={form.control} name="currentPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="newPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Password"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}


export default function ProfilePage() {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-1/4 mb-8" />
             <div className="mb-8 border-b pb-4">
                <Skeleton className="h-10 w-1/3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
  }

  if (!user) {
    // This should ideally be handled by a higher-level auth guard
    // For now, just show a message or redirect
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <ProfileForm user={user} />
        <PasswordForm userId={user.id} />
      </div>
    </div>
  );
}
