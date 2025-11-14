
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICoupon extends Document {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: Date;
  minSpend?: number;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  expiryDate: { type: Date, required: true },
  minSpend: { type: Number, min: 0 },
  isActive: { type: Boolean, default: true, index: true },
  usageLimit: { type: Number, min: 1 },
  usageCount: { type: Number, default: 0 },
}, { timestamps: true });

export default models.Coupon || model<ICoupon>('Coupon', CouponSchema);
