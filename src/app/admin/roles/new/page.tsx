
import { createRole } from "@/lib/actions/role.actions";
import RoleForm from "../role-form";

export default function NewRolePage() {

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Role</h2>
          <p className="text-muted-foreground">Define a new role and assign permissions to it.</p>
        </div>
      <RoleForm 
        action={createRole} 
        buttonLabel="Create Role"
        loadingButtonLabel="Creating..."
      />
    </div>
  );
}
