
import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { ICategory } from './Category';

export interface IProductMedia {
  type: 'image' | 'video';
  url: string;
}

export interface IDimensions {
    length: number;
    width: number;
    height: number;
}

export interface IVariant {
  name?: string;
  sku: string;
  options: { name: string; value: string }[];
  price: number;
  stock: number;
  weight?: number;
  dimensions?: IDimensions;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Types.ObjectId | ICategory;
  media: IProductMedia[];
  variants: IVariant[];
  dimensions?: IDimensions;
  weight?: number; // in a standard unit like kg
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductMediaSchema: Schema = new Schema({
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
});

const DimensionsSchema: Schema = new Schema({
    length: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 }
}, { _id: false });

const VariantSchema: Schema = new Schema({
    name: { type: String, trim: true },
    sku: { type: String, required: true, unique: true,sparse: true },
    options: [{
        name: { type: String, required: true }, // e.g., 'Color'
        value: { type: String, required: true } // e.g., 'Blue'
    }],
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    weight: { type: Number, min: 0 },
    dimensions: DimensionsSchema,
}, { _id: false });

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  media: [ProductMediaSchema],
  variants: [VariantSchema],
  dimensions: DimensionsSchema,
  weight: { type: Number, min: 0 }, // Assuming weight in kg
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.pre('save', function(next) {
    if (this.isModified('salePrice') && this.salePrice && this.price) {
        if (this.salePrice >= this.price) {
            return next(new Error('Sale price must be less than the regular price.'));
        }
    }
    next();
});

export default models.Product || model<IProduct>('Product', ProductSchema);
