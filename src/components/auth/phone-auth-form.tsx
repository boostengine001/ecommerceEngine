
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { PhoneInput } from '../ui/phone-input';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const phoneSchema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});


export function PhoneAuthForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });
  
  const handlePhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    setLoading(true);
    try {
        await sendPhoneOtp(values.phone);
        setPhone(values.phone);
        setStep('otp');
        toast({ title: "OTP Sent", description: "An OTP has been sent to your phone (check server logs)." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message || "Failed to send OTP." });
    } finally {
        setLoading(false);
    }
  };
  
  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
      setLoading(true);
      try {
          await verifyPhoneOtp(phone, values.otp);
          toast({ title: "Success", description: "You are now logged in." });
          router.push('/');
      } catch (error: any) {
          toast({ variant: "destructive", title: "Error", description: error.message || "Failed to verify OTP." });
      } finally {
          setLoading(false);
      }
  };

  if (step === 'otp') {
      return (
        <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4 pt-6">
                <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter OTP</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </Button>
                <Button variant="link" onClick={() => setStep('phone')}>Back</Button>
            </form>
        </Form>
      )
  }

  return (
    <Form {...phoneForm}>
        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4 pt-6">
            <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <PhoneInput international defaultCountry="IN" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
        </form>
    </Form>
  );
}
