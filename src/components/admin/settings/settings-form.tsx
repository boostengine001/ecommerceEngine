
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ISettings } from '@/models/Setting';
import { updateSettings as updateSettingsAction } from '@/lib/actions/setting.actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import ImageDropzone from '../image-dropzone';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useSettings } from '@/hooks/use-settings';

const phoneSchema = z.string().refine((value) => {
    if (!value || value.length === 0) return true;
    return isValidPhoneNumber(value);
}, {
    message: 'Invalid phone number'
}).optional().or(z.literal(''));


const formSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeAddress: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').or(z.literal('')),
  phone: phoneSchema,
  whatsapp: phoneSchema,
  'socials.facebook': z.string().url().or(z.literal('')).optional(),
  'socials.instagram': z.string().url().or(z.literal('')).optional(),
  'socials.twitter': z.string().url().or(z.literal('')).optional(),
  'socials.youtube': z.string().url().or(z.literal('')).optional(),
  theme: z.enum(['light', 'dark', 'system']),
  font: z.string(),
  primaryColor: z.string(),
  primaryColorDark: z.string(),
});

export default function SettingsForm({ settings }: { settings: ISettings }) {
  const { toast } = useToast();
  const { updateSettings } = useSettings();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        storeName: settings.storeName || '',
        storeAddress: settings.storeAddress || '',
        contactEmail: settings.contactEmail || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        'socials.facebook': settings.socials?.facebook || '',
        'socials.instagram': settings.socials?.instagram || '',
        'socials.twitter': settings.socials?.twitter || '',
        'socials.youtube': settings.socials?.youtube || '',
        theme: settings.theme || 'light',
        font: settings.font || 'inter',
        primaryColor: settings.primaryColor || '#2563eb',
        primaryColorDark: settings.primaryColorDark || '#60a5fa',
    }
  });

  useEffect(() => {
    form.reset({
      ...settings,
      primaryColor: settings.primaryColor || '#2563eb',
      primaryColorDark: settings.primaryColorDark || '#60a5fa',
      'socials.facebook': settings.socials?.facebook || '',
      'socials.instagram': settings.socials?.instagram || '',
      'socials.twitter': settings.socials?.twitter || '',
      'socials.youtube': settings.socials?.youtube || '',
    });
  }, [settings, form]);


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const formValues = form.getValues();

    try {
        await updateSettingsAction(formData);
        
        // This is a bit of a workaround to get the new logo URL if it was uploaded
        const logoFile = formData.get('logo') as File | null;
        let newLogoUrl = settings.logoUrl;
        if(logoFile && logoFile.size > 0) {
            // we can't know the final s3 url here, but we can display a local preview
            newLogoUrl = URL.createObjectURL(logoFile);
        } else if (formData.has('isLogoRemoved')) {
            newLogoUrl = '';
        } else if(formData.has('currentImage')){
            newLogoUrl = formData.get('currentImage') as string;
        }

        updateSettings({
            ...formValues,
            logoUrl: newLogoUrl,
        });

        toast({
            title: "Settings Updated",
            description: "Your settings have been successfully saved.",
        });
    } catch (error) {
        console.error("Failed to update settings", error);
        toast({
            title: "Error",
            description: "Failed to update settings. Please try again.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
        <Tabs defaultValue="store">
            <TabsList>
                <TabsTrigger value="store">Store</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="store" className="mt-6">
                 <Card>
                <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                    <CardDescription>
                    Update your store's name, contact information, and social media links.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="storeAddress"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Address</FormLabel>
                            <FormControl>
                            <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div className="space-y-4 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Contact Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <PhoneInput
                                    international
                                    defaultCountry="IN"
                                    className={cn(
                                        'flex h-10 w-full rounded-md border border-input bg-background pl-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                        '[&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:focus-visible:ring-0 [&_input]:focus-visible:ring-offset-0'
                                    )}
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                        <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>WhatsApp Number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    international
                                    defaultCountry="IN"
                                    placeholder="+1 234 567 890"
                                    className={cn(
                                    'flex h-10 w-full rounded-md border border-input bg-background pl-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                    '[&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:focus-visible:ring-0 [&_input]:focus-visible:ring-offset-0'
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-medium">Social Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="socials.facebook" render={({field}) => (<FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                        <FormField control={form.control} name="socials.instagram" render={({field}) => (<FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                        <FormField control={form.control} name="socials.twitter" render={({field}) => (<FormItem><FormLabel>Twitter (X) URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                        <FormField control={form.control} name="socials.youtube" render={({field}) => (<FormItem><FormLabel>YouTube URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                        </div>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6">
                <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                    Customize the look and feel of your store.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <Label>Logo</Label>
                        <ImageDropzone name="logo" initialImage={settings.logoUrl} />
                    </div>
                    <div className="space-y-6">
                       <FormField
                          control={form.control}
                          name="primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Color (Light)</FormLabel>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input type="color" className="h-10 w-14 p-1" {...field} />
                                </FormControl>
                                <FormControl>
                                  <Input type="text" className="max-w-xs" {...field} />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="primaryColorDark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Color (Dark)</FormLabel>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input type="color" className="h-10 w-14 p-1" {...field} />
                                </FormControl>
                                <FormControl>
                                  <Input type="text" className="max-w-xs" {...field} />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Theme</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a theme" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="font"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Font</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="inter">Inter</SelectItem>
                                            <SelectItem value="poppins">Poppins</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Advanced</CardTitle>
                        <CardDescription>
                        Handle advanced configurations and dangerous operations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">Reset Store Data</CardTitle>
                                <CardDescription>This action is irreversible. All products, orders, and customer data will be permanently deleted.</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="destructive" disabled>Reset Store</Button>
                            </CardFooter>
                        </Card>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Saving...' : 'Save All Settings'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
