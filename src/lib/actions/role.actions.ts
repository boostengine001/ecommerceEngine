
'use server';

import dbConnect from '../db';
import Role, { type IRole } from '@/models/Role';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { PREDEFINED_ROLES } from '../predefined-roles';

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

export async function getRoles(includeDeleted = false): Promise<IRole[]> {
  await dbConnect();
  const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
  const roles = await Role.find(query).sort({ name: 1 }).lean();
  
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
  await Role.findByIdAndUpdate(id, { isDeleted: true });
  revalidatePath('/admin/roles');
}

export async function recoverRole(id: string) {
  await dbConnect();
  await Role.findByIdAndUpdate(id, { isDeleted: false });
  revalidatePath('/admin/roles');
}

export async function deleteRolePermanently(id: string) {
  await dbConnect();
  // Unassign this role from all users before deleting
  await User.updateMany({ role: id }, { $unset: { role: 1 } });
  await Role.findByIdAndDelete(id);
  revalidatePath('/admin/roles');
}

export async function seedPredefinedRoles(): Promise<{ created: number, existing: number }> {
    await dbConnect();

    let createdCount = 0;
    let existingCount = 0;

    for (const roleData of PREDEFINED_ROLES) {
        const existingRole = await Role.findOne({ name: roleData.name });
        if (existingRole) {
            existingCount++;
        } else {
            const newRole = new Role(roleData);
            await newRole.save();
            createdCount++;
        }
    }
    
    if (createdCount > 0) {
        revalidatePath('/admin/roles');
    }

    return { created: createdCount, existing: existingCount };
}
