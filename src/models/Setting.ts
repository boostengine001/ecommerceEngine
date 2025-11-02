
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  contactEmail: string;
  storeAddress: string;
  theme: 'light' | 'dark' | 'system';
  font: string;
  primaryColor: string;
  logoUrl: string;
}

const SettingsSchema: Schema = new Schema({
  storeName: { type: String, default: 'BlueCart' },
  contactEmail: { type: String, default: 'sales@bluecart.com' },
  storeAddress: { type: String, default: '123 Market St, San Francisco, CA 94103' },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  font: { type: String, default: 'inter' },
  primaryColor: { type: String, default: '#2563eb' },
  logoUrl: { type: String, default: '' },
}, { timestamps: true });

export default models.Setting || model<ISettings>('Setting', SettingsSchema);
