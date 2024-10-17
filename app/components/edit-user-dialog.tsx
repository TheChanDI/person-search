"use client";

import { editUser } from "@/app/actions/actions";
import { userFormSchema, User, UserFormData } from "@/app/actions/schemas";
import { UserForm } from "./user-form";
import MutableDialog, { ActionState } from "@/components/mutable-dialog";

interface EditUserDialogProps {
  user: User;
}

export function EditUserDialog({ user }: EditUserDialogProps) {
  const handleEditUser = async (
    data: UserFormData
  ): Promise<ActionState<User>> => {
    try {
      const updatedUser = await editUser(user.id, data);
      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully`,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Error editing user:", error);
      return {
        success: false,
        message: "Failed to update user",
      };
    }
  };

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleEditUser}
      triggerButtonLabel="Edit User"
      addDialogTitle="Edit User"
      editDialogTitle="Edit User"
      dialogDescription="Make changes to the user details below."
      submitButtonLabel="Save Changes"
      defaultValues={{
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }}
    />
  );
}
