
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parent: mongoose.Types.ObjectId | ICategory | null;
  ancestors: { _id: mongoose.Types.ObjectId; name: string; slug: string }[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: [true, 'Category name is required.'], trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  image: { type: String, required: [true, 'Category image is required.'] },
  description: { type: String, required: [true, 'Category description is required.'], trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  ancestors: [{ 
    _id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  }],
}, { timestamps: true });

CategorySchema.index({ parent: 1, name: 1 }, { unique: true });

async function createSlug(name: string): Promise<string> {
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    let slug = baseSlug;
    let count = 1;
    const CategoryModel = models.Category || model<ICategory>('Category');

    let existingCategory = await CategoryModel.findOne({ slug });
    while (existingCategory && existingCategory._id.toString() !== (this as any)._id.toString()) {
        slug = `${baseSlug}-${count}`;
        count++;
        existingCategory = await CategoryModel.findOne({ slug });
    }
    return slug;
}

CategorySchema.pre<ICategory>('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = await createSlug.call(this, this.name);
  }

  if (this.isModified('parent')) {
    if (this.parent) {
      try {
        const CategoryModel = models.Category || model<ICategory>('Category');
        const parentCategory = await CategoryModel.findById(this.parent);
        if (parentCategory) {
          this.ancestors = [
              ...parentCategory.ancestors, 
              { _id: parentCategory._id, name: parentCategory.name, slug: parentCategory.slug }
          ];
        } else {
            this.parent = null;
            this.ancestors = [];
        }
      } catch (error) {
          console.error("Error fetching parent category:", error);
          this.parent = null;
          this.ancestors = [];
      }
    } else {
      this.ancestors = [];
    }
  }
  next();
});

export default models.Category || model<ICategory>('Category', CategorySchema);
