
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code is required"),
  phone: z.string().refine(value => isValidPhoneNumber(value || ''), { message: "Invalid phone number" }),
  isDefault: z.boolean().optional(),
});
