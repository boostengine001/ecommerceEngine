
'use server';

import dbConnect from '../db';
import Coupon, { type ICoupon } from '@/models/Coupon';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const couponSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(3, "Code must be at least 3 characters long.").toUpperCase(),
    type: z.enum(['percentage', 'fixed']),
    value: z.coerce.number().min(0, "Value must be positive."),
    expiryDate: z.coerce.date(),
    minSpend: z.coerce.number().min(0).optional(),
    isActive: z.boolean(),
});


export async function addCoupon(formData: FormData) {
  await dbConnect();
  
  const rawData = {
      code: formData.get('code'),
      type: formData.get('type'),
      value: formData.get('value'),
      expiryDate: formData.get('expiryDate'),
      minSpend: formData.get('minSpend') || undefined,
      isActive: formData.get('isActive') === 'on',
  };

  const validatedFields = couponSchema.safeParse(rawData);

  if (!validatedFields.success) {
      throw new Error(validatedFields.error.flatten().fieldErrors.toString());
  }

  const { code, type, value, expiryDate, minSpend, isActive } = validatedFields.data;

  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
      throw new Error('A coupon with this code already exists.');
  }

  const newCoupon = new Coupon({
    code,
    type,
    value,
    expiryDate,
    minSpend,
    isActive,
  });

  await newCoupon.save();
  revalidatePath('/admin/discounts');
}

export async function updateCoupon(formData: FormData) {
    await dbConnect();

    const rawData = {
      id: formData.get('id'),
      code: formData.get('code'),
      type: formData.get('type'),
      value: formData.get('value'),
      expiryDate: formData.get('expiryDate'),
      minSpend: formData.get('minSpend') || undefined,
      isActive: formData.get('isActive') === 'on',
  };
  
    const validatedFields = couponSchema.safeParse(rawData);

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.flatten().fieldErrors.toString());
    }
    
    const { id, code, type, value, expiryDate, minSpend, isActive } = validatedFields.data;
    
    if (!id) throw new Error("Coupon ID is missing.");

    const existingCouponWithCode = await Coupon.findOne({ code, _id: { $ne: id } });
    if (existingCouponWithCode) {
        throw new Error('Another coupon with this code already exists.');
    }

    await Coupon.findByIdAndUpdate(id, {
        code,
        type,
        value,
        expiryDate,
        minSpend,
        isActive,
    });
    
    revalidatePath('/admin/discounts');
    revalidatePath(`/admin/discounts/${id}/edit`);
}


export async function getAllCoupons(includeDeleted = false): Promise<ICoupon[]> {
  await dbConnect();
  const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
  const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(coupons));
}

export async function getCoupon(id: string): Promise<ICoupon | null> {
  await dbConnect();
  const coupon = await Coupon.findById(id).lean();
  if (!coupon) return null;
  return JSON.parse(JSON.stringify(coupon));
}

export async function deleteCoupon(id: string) {
  await dbConnect();
  await Coupon.findByIdAndUpdate(id, { isDeleted: true });
  revalidatePath('/admin/discounts');
}

export async function recoverCoupon(id: string) {
  await dbConnect();
  await Coupon.findByIdAndUpdate(id, { isDeleted: false });
  revalidatePath('/admin/discounts');
}

export async function deleteCouponPermanently(id: string) {
  await dbConnect();
  await Coupon.findByIdAndDelete(id);
  revalidatePath('/admin/discounts');
}


export async function applyCoupon(code: string, total: number): Promise<{ success: boolean; coupon?: ICoupon; discount?: number; error?: string; }> {
    await dbConnect();
    const coupon = await Coupon.findOne({ code, isActive: true, isDeleted: { $ne: true } }).lean();

    if (!coupon) {
        return { success: false, error: 'Coupon not found or is inactive.' };
    }
    
    if (coupon.expiryDate < new Date()) {
        return { success: false, error: 'Coupon has expired.' };
    }

    if (coupon.minSpend && total < coupon.minSpend) {
        return { success: false, error: `Minimum spend of ${coupon.minSpend} required.` };
    }
    
    let discount = 0;
    if (coupon.type === 'fixed') {
        discount = coupon.value;
    } else if (coupon.type === 'percentage') {
        discount = (total * coupon.value) / 100;
    }
    
    // Ensure discount doesn't exceed total
    discount = Math.min(discount, total);

    return { success: true, coupon: JSON.parse(JSON.stringify(coupon)), discount: discount };
}
