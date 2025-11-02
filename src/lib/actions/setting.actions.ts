
'use server';

import dbConnect from '../db';
import Setting, { type ISettings } from '@/models/Setting';
import { revalidatePath } from 'next/cache';

const defaultSettings = {
    storeName: 'BlueCart',
    contactEmail: 'sales@bluecart.com',
    storeAddress: '123 Market St, San Francisco, CA 94103',
    theme: 'light',
    font: 'inter',
    primaryColor: '#2563eb',
};

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
    
    const updates: Partial<ISettings> = {
        storeName: formData.get('storeName') as string,
        contactEmail: formData.get('contactEmail') as string,
        storeAddress: formData.get('storeAddress') as string,
        theme: formData.get('theme') as 'light' | 'dark' | 'system',
        font: formData.get('font') as string,
        primaryColor: formData.get('primaryColor') as string,
    };

    const settings = await Setting.findOneAndUpdate({}, updates, { new: true, upsert: true, setDefaultsOnInsert: true });
    
    revalidatePath('/admin/settings');

    return JSON.parse(JSON.stringify(settings));
}
