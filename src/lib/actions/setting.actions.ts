
'use server';

import dbConnect from '../db';
import Setting, { type ISettings } from '@/models/Setting';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';
import { hexToHsl } from '../utils';

const defaultSettings = {
    storeName: 'BlueCart',
    contactEmail: 'sales@bluecart.com',
    storeAddress: '123 Market St, San Francisco, CA 94103',
    phone: '',
    whatsapp: '',
    socials: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
    },
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
    let settings = await Setting.findOne().lean();
    if (!settings) {
        settings = (await new Setting(defaultSettings).save()).toObject();
    }
    
    const plainSettings = JSON.parse(JSON.stringify(settings));
    // Ensure nested objects exist for easier access on the client
    if (!plainSettings.socials) {
        plainSettings.socials = {};
    }
    return plainSettings;
}

export async function updateSettings(formData: FormData) {
    await dbConnect();

    const currentSettings = await getSettings();
    const updates: { [key: string]: any } = {};
    
    // Iterate over form entries and build updates object
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('socials.')) {
            const socialKey = key.split('.')[1];
            if (!updates.socials) {
                // Initialize from current settings to not lose other social links
                updates.socials = { ...currentSettings.socials };
            }
            (updates.socials as any)[socialKey] = value;
        } else {
            updates[key] = value;
        }
    }

    const imageFile = formData.get('logo') as File | null;
    const isLogoRemoved = formData.get('isLogoRemoved') === 'true';
    
    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
            updates.logoUrl = uploadedUrl;
        }
    } else if (isLogoRemoved) {
        updates.logoUrl = '';
    } else if (formData.has('currentImage')) {
        // Keep the existing image if no new file is uploaded and it's not removed
        updates.logoUrl = formData.get('currentImage');
    }

    // Since forms are separate, we only want to update the fields present in the form.
    // We build a dynamic update object based on what's submitted.
    const updateObject: { [key: string]: any } = {};
    Object.keys(updates).forEach(key => {
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            if (!updateObject[parent]) updateObject[parent] = {};
            updateObject[parent][child] = updates[key];
        } else {
            updateObject[key] = updates[key];
        }
    });
    
    if (updateObject.primaryColor) {
      updateObject.primaryColor = hexToHsl(updateObject.primaryColor)
    }


    const settings = await Setting.findOneAndUpdate({}, { $set: updateObject }, { new: true, upsert: true, setDefaultsOnInsert: true });
    
    // Revalidate the entire site layout to reflect changes everywhere.
    revalidatePath('.', 'layout');

    return JSON.parse(JSON.stringify(settings));
}
