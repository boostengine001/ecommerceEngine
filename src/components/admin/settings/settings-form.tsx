
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

export default function SettingsForm({ settings }: { settings: ISettings }) {
  const { toast } = useToast();
  const [storeLoading, setStoreLoading] = useState(false);
  const [appearanceLoading, setAppearanceLoading] = useState(false);
  
  // State for color picker to be controlled
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#2563eb');


  const handleStoreSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStoreLoading(true);
    const formData = new FormData(event.currentTarget);
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
          <form onSubmit={handleStoreSubmit}>
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
                           <PhoneInput
                              id="phone"
                              name="phone"
                              defaultValue={settings.phone}
                            />
                      </div>
                  </div>
                  <div>
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                       <PhoneInput
                          id="whatsapp"
                          name="whatsapp"
                          placeholder="+1 234 567 890"
                          defaultValue={settings.whatsapp}
                        />
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
              <CardFooter>
                 <Button type="submit" disabled={storeLoading}>
                  {storeLoading ? 'Saving...' : 'Save Store Details'}
                </Button>
              </CardFooter>
            </Card>
          </form>
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
