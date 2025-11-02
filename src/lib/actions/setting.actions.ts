
'use server';

import dbConnect from '../db';
import Setting, { type ISettings } from '@/models/Setting';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';

const defaultSettings = {
    storeName: 'BlueCart',
    contactEmail: 'sales@bluecart.com',
    storeAddress: '123 Market St, San Francisco, CA 94103',
    theme: 'light',
    font: 'inter',
    primaryColor: '#2563eb',
    logoUrl: '',
};

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  try {
    const url = await uploadFile(buffer, fileName);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload image.");
  }
}

export async function getSettings(): Promise<ISettings> {
    await dbConnect();
    let settings = await Setting.findOne();
    if (!settings) {
        settings = new Setting(defaultSettings);
        await settings.save();
    }
    return JSON.parse(JSON.stringify(settings));
}

export async function updateSettings(formData: FormData) {
    await dbConnect();

    const currentSettings = await getSettings();
    let finalLogoUrl = currentSettings.logoUrl;

    const imageFile = formData.get('logo') as File | null;
    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
            finalLogoUrl = uploadedUrl;
        }
    }
    
    const updates: Partial<ISettings> = {
        storeName: formData.get('storeName') as string,
        contactEmail: formData.get('contactEmail') as string,
        storeAddress: formData.get('storeAddress') as string,
        theme: formData.get('theme') as 'light' | 'dark' | 'system',
        font: formData.get('font') as string,
        primaryColor: formData.get('primaryColor') as string,
        logoUrl: finalLogoUrl,
    };

    const settings = await Setting.findOneAndUpdate({}, updates, { new: true, upsert: true, setDefaultsOnInsert: true });
    
    revalidatePath('/admin/settings');
    revalidatePath('/'); // Revalidate home page to update header logo

    return JSON.parse(JSON.stringify(settings));
}
