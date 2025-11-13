
import { getRole, updateRole } from "@/lib/actions/role.actions";
import RoleForm from "../../role-form";
import { notFound } from "next/navigation";

export default async function EditRolePage({ params }: { params: { id: string } }) {
  const role = await getRole(params.id);

  if (!role) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Role: {role.name}</h2>
          <p className="text-muted-foreground">Update the role's details and permissions.</p>
        </div>
      <RoleForm 
        action={updateRole} 
        initialData={role}
        buttonLabel="Update Role"
        loadingButtonLabel="Updating..."
      />
    </div>
  );
}
