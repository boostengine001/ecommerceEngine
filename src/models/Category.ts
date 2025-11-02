
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubcategory {
  name: string;
  slug: string;
}

const SubcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
}, { _id: false });

export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  subcategories: ISubcategory[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  subcategories: { type: [SubcategorySchema], default: [] },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
