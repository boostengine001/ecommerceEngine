
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
import { updateSettings } from '@/lib/actions/setting.actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import ImageDropzone from '../image-dropzone';
import { PhoneInput } from '@/components/ui/phone-input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';


const phoneSchema = z.string().refine((value) => {
    if (!value) return true; // Allow empty string
    return isValidPhoneNumber(value || '');
}, {
    message: 'Invalid phone number'
});

const storeFormSchema = z.object({
  storeName: z.string(),
  storeAddress: z.string(),
  contactEmail: z.string().email().or(z.literal('')),
  phone: phoneSchema.optional(),
  whatsapp: phoneSchema.optional(),
  'socials.facebook': z.string().url().or(z.literal('')),
  'socials.instagram': z.string().url().or(z.literal('')),
  'socials.twitter': z.string().url().or(z.literal('')),
  'socials.youtube': z.string().url().or(z.literal('')),
});

export default function SettingsForm({ settings }: { settings: ISettings }) {
  const { toast } = useToast();
  const [storeLoading, setStoreLoading] = useState(false);
  const [appearanceLoading, setAppearanceLoading] = useState(false);
  
  // State for color picker to be controlled
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#2563eb');

  const storeForm = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
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
    }
  });


  const handleStoreSubmit = async (values: z.infer<typeof storeFormSchema>) => {
    setStoreLoading(true);
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
        if (value) {
           formData.append(key, value as string);
        }
    }
    
    try {
        await updateSettings(formData);
        toast({
            title: "Store Settings Updated",
            description: "Your store details have been saved.",
        });
    } catch (error) {
        console.error("Failed to update settings", error);
        toast({
            title: "Error",
            description: "Failed to update store settings. Please try again.",
            variant: "destructive",
        });
    } finally {
        setStoreLoading(false);
    }
  }
  
  const handleAppearanceSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppearanceLoading(true);
    const formData = new FormData(event.currentTarget);

    // Manually set the color from state, as the color input might not be perfectly in sync
    formData.set('primaryColor', primaryColor);

    try {
        await updateSettings(formData);
        toast({
            title: "Appearance Updated",
            description: "Your appearance settings have been saved.",
        });
    } catch (error) {
        console.error("Failed to update settings", error);
        toast({
            title: "Error",
            description: "Failed to update appearance settings. Please try again.",
            variant: "destructive",
        });
    } finally {
        setAppearanceLoading(false);
    }
  }


  return (
      <Tabs defaultValue="store">
        <TabsList>
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-6">
          <Form {...storeForm}>
          <form onSubmit={storeForm.handleSubmit(handleStoreSubmit)}>
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
                    control={storeForm.control}
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
                    control={storeForm.control}
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
                          control={storeForm.control}
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
                          control={storeForm.control}
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
                  </div>
                    <FormField
                      control={storeForm.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number</FormLabel>
                          <FormControl>
                            <PhoneInput placeholder="+1 234 567 890" international defaultCountry="IN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-medium">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={storeForm.control} name="socials.facebook" render={({field}) => (<FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                      <FormField control={storeForm.control} name="socials.instagram" render={({field}) => (<FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                      <FormField control={storeForm.control} name="socials.twitter" render={({field}) => (<FormItem><FormLabel>Twitter (X) URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                      <FormField control={storeForm.control} name="socials.youtube" render={({field}) => (<FormItem><FormLabel>YouTube URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={storeLoading}>
                  {storeLoading ? 'Saving...' : 'Save Store Details'}
                </Button>
              </CardFooter>
            </Card>
          </form>
          </Form>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <form onSubmit={handleAppearanceSubmit}>
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
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-2">
                          <Input 
                            id="primaryColorPicker" 
                            type="color" 
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="h-10 w-14 p-1"
                          />
                          <Input 
                            id="primaryColorText"
                            name="primaryColor"
                            type="text" 
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)} 
                            className="max-w-xs" 
                          />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select name="theme" defaultValue={settings.theme}>
                          <SelectTrigger id="theme">
                          <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                      <div>
                      <Label htmlFor="font">Font</Label>
                      <Select name="font" defaultValue={settings.font}>
                          <SelectTrigger id="font">
                          <SelectValue placeholder="Select a font" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="space-grotesk">Space Grotesk</SelectItem>
                          <SelectItem value="system-sans">System Sans-serif</SelectItem>
                          </SelectContent>
                      </Select>
                      </div>
                  </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button type="submit" disabled={appearanceLoading}>
                  {appearanceLoading ? 'Saving...' : 'Save Appearance'}
                </Button>
              </CardFooter>
            </Card>
          </form>
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
  );
}
