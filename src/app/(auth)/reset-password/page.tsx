
'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { resetPassword } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
        toast({ variant: 'destructive', title: 'Error', description: 'Invalid or missing reset token.' });
        return;
    }
    setLoading(true);
    try {
      await resetPassword(token, values.password);
      toast({ title: 'Success', description: 'Your password has been reset. You can now log in.' });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not reset your password.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!token) {
      return (
           <div className="mx-auto grid w-full max-w-[350px] gap-6 text-center">
                 <Card>
                    <CardHeader className="items-center">
                        <ShieldAlert className="h-12 w-12 text-destructive"/>
                        <CardTitle>Invalid Link</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-balance text-muted-foreground">The password reset link is either invalid or has expired. Please request a new one.</p>
                        <Button asChild className="mt-6 w-full">
                            <Link href="/forgot-password">Request a new link</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
      )
  }

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter a new password for your account.
        </p>
      </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Form>
      <div className="mt-4 text-center text-sm">
        Remembered your password?{' '}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </>
  );
}


function ResetPasswordSkeleton() {
    return (
        <div className="grid w-full max-w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Skeleton className="h-9 w-48 mx-auto" />
                <Skeleton className="h-5 w-64 mx-auto" />
            </div>
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-5 w-48 mx-auto mt-4" />
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="mx-auto grid w-full max-w-[350px] gap-6">
            <Suspense fallback={<ResetPasswordSkeleton />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
