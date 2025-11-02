
'use server';

import dbConnect from '../db';
import User, { type IUser } from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

export async function signup(data: unknown) {
  const result = signupSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map(e => e.message).join(', '));
  }
  const { firstName, lastName, email, password } = result.data;

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  
  const userObject = newUser.toObject();
  delete userObject.password;
  return JSON.parse(JSON.stringify(userObject));
}


export async function login(data: unknown) {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
        throw new Error(result.error.errors.map(e => e.message).join(', '));
    }
    const { email, password } = result.data;

    await dbConnect();

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }

    const userObject = user.toObject();
    delete userObject.password;
    return JSON.parse(JSON.stringify(userObject));
}

export async function getUsers(): Promise<IUser[]> {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
}
