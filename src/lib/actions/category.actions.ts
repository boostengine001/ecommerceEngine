
'use server';

import dbConnect from '../db';
import Category, { type ICategory } from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';

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
    throw new Error("Failed to upload image.");
  }
}

async function createUniqueSlug(name: string, categoryIdToExclude: string | null = null): Promise<string> {
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    let slug = baseSlug;
    let count = 1;
    
    let query: any = { slug };
    if (categoryIdToExclude) {
        query._id = { $ne: categoryIdToExclude };
    }

    while (await Category.findOne(query)) {
        slug = `${baseSlug}-${count}`;
        query.slug = slug;
        count++;
    }
    return slug;
}


export async function addCategory(formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File | null;
  const parentId = formData.get('parent') === 'null' ? null : formData.get('parent') as string;

  if (!name || !description || !imageFile || imageFile.size === 0) {
      throw new Error('Missing required fields: name, description, and image are required.');
  }
  
  const imageUrl = await uploadImage(imageFile);
  if (!imageUrl) {
    throw new Error('Image upload failed.');
  }

  const slug = await createUniqueSlug(name);
  
  const newCategory = new Category({
    name,
    slug,
    description,
    image: imageUrl,
    parent: parentId,
  });

  await newCategory.save();

  revalidatePath('/admin/categories');
}

export async function getAllCategories(): Promise<ICategory[]> {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 }).populate('parent');
  return JSON.parse(JSON.stringify(categories));
}

export async function getCategory(id: string): Promise<ICategory | null> {
  await dbConnect();
  const category = await Category.findById(id).populate('parent');
  if (!category) {
      return null;
  }
  return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as (File | null);
  let imageUrlFromForm = formData.get('currentImage') as string;
  const parentId = formData.get('parent') === 'null' ? null : formData.get('parent') as string;


  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  let finalImageUrl = category.image;

  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadImage(imageFile);
    if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
    }
  } else if (imageUrlFromForm) {
      finalImageUrl = imageUrlFromForm;
  }


  category.name = name;
  category.description = description;
  category.image = finalImageUrl;
  // @ts-ignore
  category.parent = parentId;

  if (name !== category.name || !category.slug) {
      category.slug = await createUniqueSlug(name, id);
  }

  await category.save();

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}/edit`);
}

export async function deleteCategory(id: string) {
  await dbConnect();
  
  const descendants = await Category.find({ 'ancestors._id': id });
  const descendantIds = descendants.map(d => d._id);

  const idsToDelete = [id, ...descendantIds];

  await Category.deleteMany({ _id: { $in: idsToDelete } });

  revalidatePath('/admin/categories');
}
