
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISocials {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

export interface ISettings extends Document {
  storeName: string;
  contactEmail: string;
  storeAddress: string;
  phone?: string;
  whatsapp?: string;
  socials?: ISocials;
  theme: 'light' | 'dark' | 'system';
  font: string;
  primaryColor: string;
  logoUrl: string;
}

const SocialsSchema: Schema = new Schema({
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
}, { _id: false });

const SettingsSchema: Schema = new Schema({
  storeName: { type: String, default: 'BlueCart' },
  contactEmail: { type: String, default: 'sales@bluecart.com' },
  storeAddress: { type: String, default: '123 Market St, San Francisco, CA 94103' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  socials: { type: SocialsSchema, default: () => ({}) },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  font: { type: String, default: 'inter' },
  primaryColor: { type: String, default: '#2563eb' },
  logoUrl: { type: String, default: '' },
}, { timestamps: true });

export default models.Setting || model<ISettings>('Setting', SettingsSchema);
