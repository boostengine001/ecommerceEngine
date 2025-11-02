
'use server';

import dbConnect from '../db';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';
import { redirect } from 'next/navigation';

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

  if (!name || !description || !imageFile) {
      throw new Error('Missing required fields');
  }

  const slug = createSlug(name);
  
  const imageUrl = await uploadImage(imageFile);

  const newCategory = new Category({
    name,
    slug,
    image: imageUrl,
    description,
    subcategories: [],
  });

  await newCategory.save();

  revalidatePath('/admin/categories');
}

export async function getAllCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 });
  return JSON.parse(JSON.stringify(categories));
}

export async function getCategory(id: string) {
  await dbConnect();
  const category = await Category.findById(id);
  if (!category) {
      throw new Error('Category not found');
  }
  return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as (File | null);
  let imageUrl = formData.get('currentImage') as string;
  const subcategoriesJSON = formData.get('subcategories') as string;
  const subcategories = JSON.parse(subcategoriesJSON);

  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  const slug = createSlug(name);

  await Category.findByIdAndUpdate(id, {
    name,
    slug,
    image: imageUrl,
    description,
    subcategories,
  });

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}/edit`);
}

export async function deleteCategory(id: string) {
  await dbConnect();
  await Category.findByIdAndDelete(id);
  revalidatePath('/admin/categories');
}
