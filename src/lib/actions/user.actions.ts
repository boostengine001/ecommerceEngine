

'use server';

import dbConnect from '../db';
import User, { type IUser } from '@/models/User';
import Role from '@/models/Role';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { sign, verify } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

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

const profileUpdateSchema = z.object({
    id: z.string(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
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

export async function findOrCreateUserFromGoogle(profile: { email: string, firstName: string, lastName: string, googleId: string }) {
    await dbConnect();
    
    let user = await User.findOne({ email: profile.email });

    if (user) {
        // User exists, log them in by creating a session
        await createSession(user._id);
    } else {
        // User does not exist, create a new one
        // We generate a secure random password as it's a required field, 
        // but it won't be used for login.
        const randomPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
        user = new User({
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            password: randomPassword, // Satisfy schema, but won't be used
            // You could also add a field like 'authProvider: "google"'
        });
        await user.save();
        await createSession(user._id);
    }

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

export async function getUser(id: string): Promise<IUser | null> {
    await dbConnect();
    const user = await User.findById(id).populate('role').lean();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
}

export async function getRoles(): Promise<IRole[]> {
  await dbConnect();
  const roles = await Role.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(roles));
}

export async function updateUser(formData: FormData) {
  await dbConnect();

  const id = formData.get('id') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const roleId = formData.get('role') as string;

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  user.firstName = firstName;
  user.lastName = lastName;
  
  if (roleId && roleId !== 'none') {
    user.role = roleId;
  } else {
    user.role = undefined;
  }

  await user.save();

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}/edit`);
}

export async function updateUserProfile(data: unknown) {
    const result = profileUpdateSchema.safeParse(data);
    if (!result.success) {
        throw new Error('Invalid data provided.');
    }
    
    const { id, firstName, lastName, currentPassword, newPassword } = result.data;

    await dbConnect();
    const user = await User.findById(id).select('+password');

    if (!user) {
        throw new Error('User not found.');
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect current password.');
        }
        user.password = await bcrypt.hash(newPassword, 10);
    }
    
    await user.save();
    revalidatePath('/profile');
}
