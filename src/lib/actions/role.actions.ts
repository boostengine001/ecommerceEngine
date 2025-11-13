
'use server';

import dbConnect from '../db';
import Role, { type IRole } from '@/models/Role';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function createRole(formData: FormData) {
  await dbConnect();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const permissions = formData.getAll('permissions') as string[];

  const newRole = new Role({
    name,
    description,
    permissions,
  });

  await newRole.save();

  revalidatePath('/admin/roles');
}

export async function getRoles(): Promise<IRole[]> {
  await dbConnect();
  const roles = await Role.find({}).sort({ name: 1 }).lean();
  
  const rolesWithUserCount = await Promise.all(
    roles.map(async (role) => {
        const userCount = await User.countDocuments({ role: role._id });
        return { ...role, userCount };
    })
  );

  return JSON.parse(JSON.stringify(rolesWithUserCount));
}

export async function getRole(id: string): Promise<IRole | null> {
    await dbConnect();
    const role = await Role.findById(id).lean();
    if (!role) return null;
    return JSON.parse(JSON.stringify(role));
}


export async function updateRole(formData: FormData) {
  await dbConnect();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const permissions = formData.getAll('permissions') as string[];

  await Role.findByIdAndUpdate(id, {
    name,
    description,
    permissions,
  });

  revalidatePath('/admin/roles');
  revalidatePath(`/admin/roles/${id}/edit`);
}

export async function deleteRole(id: string) {
  await dbConnect();

  // Optionally, unassign this role from all users
  await User.updateMany({ role: id }, { $unset: { role: 1 } });
  
  await Role.findByIdAndDelete(id);

  revalidatePath('/admin/roles');
}
