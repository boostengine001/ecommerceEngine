
'use server';

import dbConnect from '../db';
import User, { type IUser } from '@/models/User';
import Role from '@/models/Role';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const COOKIE_NAME = 'session_token';

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

async function createSession(userId: string) {
  const token = sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getUserFromSession(): Promise<IUser | null> {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        const decoded = verify(token, JWT_SECRET) as { userId: string };
        await dbConnect();
        const user = await User.findById(decoded.userId).populate('role').lean();
        if (!user) return null;
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

export async function clearUserSession() {
    cookies().delete(COOKIE_NAME);
}


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
  
  await createSession(newUser._id);
  
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

    await createSession(user._id);

    const userObject = user.toObject();
    delete userObject.password;
    return JSON.parse(JSON.stringify(userObject));
}

export async function getUsers(): Promise<IUser[]> {
    await dbConnect();
    // Eagerly import Role model to prevent MissingSchemaError
    await Role.find({});
    const users = await User.find({}).populate('role').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(users));
}
