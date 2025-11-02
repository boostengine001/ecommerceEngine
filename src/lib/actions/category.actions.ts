
'use server';

import dbConnect from '../db';
import Category, { type ICategory } from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';

async function uploadImage(file: File): Promise<string> {
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

function createSlug(name: string) {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function addCategory(formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File;
  const parentId = formData.get('parent') === 'null' ? null : formData.get('parent') as string;

  if (!name || !description || !imageFile) {
      throw new Error('Missing required fields');
  }
  
  const imageUrl = await uploadImage(imageFile);
  
  const newCategory = new Category({
    name,
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
  let imageUrl = formData.get('currentImage') as string;
  const parentId = formData.get('parent') === 'null' ? null : formData.get('parent') as string;


  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  category.name = name;
  category.description = description;
  category.image = imageUrl;
  // @ts-ignore
  category.parent = parentId;

  await category.save();

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}/edit`);
}

export async function deleteCategory(id: string) {
  await dbConnect();
  
  // Find all descendants of the category to be deleted
  const descendants = await Category.find({ 'ancestors._id': id });
  const descendantIds = descendants.map(d => d._id);

  // Combine the ID of the category itself with its descendants
  const idsToDelete = [id, ...descendantIds];

  // Delete the category and all its descendants
  await Category.deleteMany({ _id: { $in: idsToDelete } });

  revalidatePath('/admin/categories');
}
