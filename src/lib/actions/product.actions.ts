
'use server';

import dbConnect from '../db';
import Product, { type IProduct, type IVariant } from '@/models/Product';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';
import { Types } from 'mongoose';

async function uploadImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    // Ensure file has content before processing
    if (file.size === 0) return null;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    try {
      const url = await uploadFile(buffer, fileName);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(`Failed to upload image: ${file.name}`);
    }
  });
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}

async function createUniqueSlug(name: string, productIdToExclude: string | null = null): Promise<string> {
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    let slug = baseSlug;
    let count = 1;
    
    let query: any = { slug };
    if (productIdToExclude) {
        query._id = { $ne: productIdToExclude };
    }

    while (await Product.findOne(query)) {
        slug = `${baseSlug}-${count}`;
        query.slug = slug;
        count++;
    }
    return slug;
}

function processVariants(variants: Partial<IVariant>[]): IVariant[] {
    return variants
        .filter(v => v.sku)
        .map(v => {
            if (!v.name) {
                v.name = v.options?.map(opt => opt.value).join(' / ');
            }
            return v as IVariant;
        });
}


export async function addProduct(formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : undefined;
  const categoryId = formData.get('category') as string;
  const images = formData.getAll('images') as File[];
  
  const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined;
  const length = formData.get('length') ? parseFloat(formData.get('length') as string) : undefined;
  const width = formData.get('width') ? parseFloat(formData.get('width') as string) : undefined;
  const height = formData.get('height') ? parseFloat(formData.get('height') as string) : undefined;

  const variantsData = formData.get('variants') as string;
  const parsedVariants = variantsData ? JSON.parse(variantsData) : [];
  const variants = processVariants(parsedVariants);


  if (!name || !description || !price || !categoryId || images.length === 0) {
    throw new Error('Missing required fields');
  }

  const imageUrls = await uploadImages(images);
  const slug = await createUniqueSlug(name);
  
  const newProductData: Partial<IProduct> = {
    name,
    slug,
    description,
    price,
    salePrice,
    category: new Types.ObjectId(categoryId),
    media: imageUrls.map(url => ({ type: 'image', url })),
    variants,
    weight,
  };

  if(length && width && height) {
    newProductData.dimensions = { length, width, height };
  }

  const newProduct = new Product(newProductData);

  await newProduct.save();

  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function getProducts(): Promise<IProduct[]> {
    await dbConnect();
    const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
}


export async function getProduct(id: string): Promise<IProduct | null> {
    await dbConnect();
    const product = await Product.findById(id).populate('category');
    return JSON.parse(JSON.stringify(product));
}

export async function updateProduct(id: string, formData: FormData) {
  await dbConnect();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : undefined;
  const categoryId = formData.get('category') as string;
  const newImages = formData.getAll('images') as File[];
  const existingImageUrls = formData.getAll('existingImages') as string[];

  const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined;
  const length = formData.get('length') ? parseFloat(formData.get('length') as string) : undefined;
  const width = formData.get('width') ? parseFloat(formData.get('width') as string) : undefined;
  const height = formData.get('height') ? parseFloat(formData.get('height') as string) : undefined;
  
  const variantsData = formData.get('variants') as string;
  const parsedVariants = variantsData ? JSON.parse(variantsData) : [];
  const variants = processVariants(parsedVariants);

  const product = await Product.findById(id);
  if (!product) {
      throw new Error('Product not found');
  }

  let uploadedImageUrls: string[] = [];
  if (newImages.length > 0 && newImages.some(file => file.size > 0)) {
      uploadedImageUrls = await uploadImages(newImages);
  }
  
  const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];

  product.name = name;
  
  if (name !== product.name || !product.slug) {
      product.slug = await createUniqueSlug(name, id);
  }

  product.description = description;
  product.price = price;
  product.salePrice = salePrice;
  product.category = new Types.ObjectId(categoryId);
  product.media = allImageUrls.map(url => ({ type: 'image', url }));
  product.variants = variants;
  product.weight = weight;
  
  if (length && width && height) {
      product.dimensions = { length, width, height };
  } else {
      product.dimensions = undefined;
  }


  await product.save();

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${product.slug}`);
}


export async function deleteProduct(id: string) {
  await dbConnect();
  
  await Product.findByIdAndDelete(id);

  revalidatePath('/admin/products');
}
