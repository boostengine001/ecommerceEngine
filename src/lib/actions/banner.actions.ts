
'use server';

import dbConnect from '../db';
import Banner, { type IBanner } from '@/models/Banner';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `banner-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  try {
    const url = await uploadFile(buffer, fileName);
    return url;
  } catch (error) {
    throw new Error("Failed to upload banner image.");
  }
}

export async function addBanner(formData: FormData) {
  await dbConnect();

  const title = formData.get('title') as string;
  const link = formData.get('link') as string;
  const imageFile = formData.get('image') as File | null;
  const isActive = formData.get('isActive') === 'on';

  if (!title || !imageFile || imageFile.size === 0) {
      throw new Error('Title and image are required.');
  }
  
  const imageUrl = await uploadImage(imageFile);
  if (!imageUrl) {
    throw new Error('Image upload failed.');
  }

  const newBanner = new Banner({
    title,
    link,
    image: imageUrl,
    isActive,
  });

  await newBanner.save();

  revalidatePath('/admin/marketing');
  revalidatePath('/');
}

export async function getAllBanners(includeDeleted = false): Promise<IBanner[]> {
  await dbConnect();
  const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
  const banners = await Banner.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(banners));
}

export async function getActiveBanners(): Promise<IBanner[]> {
  await dbConnect();
  const banners = await Banner.find({ isActive: true, isDeleted: { $ne: true } }).lean();
  return JSON.parse(JSON.stringify(banners));
}

export async function getBanner(id: string): Promise<IBanner | null> {
  await dbConnect();
  const banner = await Banner.findById(id).lean();
  if (!banner) return null;
  return JSON.parse(JSON.stringify(banner));
}

export async function updateBanner(id: string, formData: FormData) {
  await dbConnect();

  const title = formData.get('title') as string;
  const link = formData.get('link') as string;
  const imageFile = formData.get('image') as File | null;
  const isActive = formData.get('isActive') === 'on';
  let imageUrlFromForm = formData.get('currentImage') as string;

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new Error('Banner not found');
  }

  let finalImageUrl = banner.image;

  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadImage(imageFile);
    if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
    }
  } else if (imageUrlFromForm) {
      finalImageUrl = imageUrlFromForm;
  }

  banner.title = title;
  banner.link = link;
  banner.image = finalImageUrl;
  banner.isActive = isActive;

  await banner.save();

  revalidatePath('/admin/marketing');
  revalidatePath(`/admin/marketing/${id}/edit`);
  revalidatePath('/');
}

export async function deleteBanner(id: string) {
  await dbConnect();
  await Banner.findByIdAndUpdate(id, { isDeleted: true });
  revalidatePath('/admin/marketing');
  revalidatePath('/');
}

export async function recoverBanner(id: string) {
  await dbConnect();
  await Banner.findByIdAndUpdate(id, { isDeleted: false });
  revalidatePath('/admin/marketing');
  revalidatePath('/');
}

export async function deleteBannerPermanently(id: string) {
  await dbConnect();
  await Banner.findByIdAndDelete(id);
  revalidatePath('/admin/marketing');
  revalidatePath('/');
}
