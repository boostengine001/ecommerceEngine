
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IBanner extends Document {
  _id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  isDeleted: boolean;
}

const BannerSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  link: { type: String, trim: true },
  isActive: { type: Boolean, default: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default models.Banner || model<IBanner>('Banner', BannerSchema);
