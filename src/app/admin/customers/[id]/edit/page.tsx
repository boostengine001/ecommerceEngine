
import { getUser, getRoles } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";
import UserForm from "@/components/admin/customers/user-form";
import { updateUser } from "@/lib/actions/user.actions";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const roles = await getRoles();

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit User: {user.firstName} {user.lastName}</h2>
          <p className="text-muted-foreground">Update the user's details and assign a role.</p>
        </div>
      <UserForm
        action={updateUser}
        initialData={user}
        roles={roles}
        buttonLabel="Update User"
        loadingButtonLabel="Updating..."
      />
    </div>
  );
}
