
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

export default function SettingsForm({ settings }: { settings: ISettings }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
        await updateSettings(formData);
        toast({
            title: "Settings Updated",
            description: "Your store settings have been saved.",
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
  }


  return (
    <form onSubmit={handleSubmit}>
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
                <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" name="storeName" defaultValue={settings.storeName} />
                </div>
                <div>
                    <Label htmlFor="storeAddress">Store Address</Label>
                    <Textarea
                    id="storeAddress"
                    name="storeAddress"
                    defaultValue={settings.storeAddress}
                    />
                </div>
              </div>
               <div className="space-y-4 border-t pt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        defaultValue={settings.contactEmail}
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" defaultValue={settings.phone} />
                    </div>
                 </div>
                 <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input id="whatsapp" name="whatsapp" placeholder="+1234567890" defaultValue={settings.whatsapp} />
                 </div>
               </div>
               <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Social Media</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="socials.facebook">Facebook URL</Label>
                        <Input id="socials.facebook" name="socials.facebook" defaultValue={settings.socials?.facebook} />
                    </div>
                    <div>
                        <Label htmlFor="socials.instagram">Instagram URL</Label>
                        <Input id="socials.instagram" name="socials.instagram" defaultValue={settings.socials?.instagram} />
                    </div>
                    <div>
                        <Label htmlFor="socials.twitter">Twitter (X) URL</Label>
                        <Input id="socials.twitter" name="socials.twitter" defaultValue={settings.socials?.twitter} />
                    </div>
                    <div>
                        <Label htmlFor="socials.youtube">YouTube URL</Label>
                        <Input id="socials.youtube" name="socials.youtube" defaultValue={settings.socials?.youtube} />
                    </div>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </CardFooter>
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
                  <Input type="hidden" name="currentLogoUrl" defaultValue={settings.logoUrl} />
                </div>
                <div className="space-y-6">
                   <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                        <Input id="primaryColor" name="primaryColor" type="color" defaultValue={settings.primaryColor} className="h-10 w-14 p-1"/>
                        <Input type="text" defaultValue={settings.primaryColor} onChange={e => (document.getElementById('primaryColor') as HTMLInputElement).value = e.target.value } className="max-w-xs" />
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
             <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </CardFooter>
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
    </form>
  );
}
