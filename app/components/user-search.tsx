"use client";

import { useState } from "react";
import AsyncSelect from "react-select/async";
import { searchUsers } from "@/app/actions/actions";
import { UserCard } from "./user-card";
import { User, UserFormData, userFormSchema } from "@/app/actions/schemas";
import MutableDialog from "@/components/mutable-dialog";
import { UserForm } from "./user-form";

// Option type remains the same
interface Option {
  value: string;
  label: string;
  user: User;
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const users = await searchUsers(inputValue);
    return users.map((user) => ({ value: user.id, label: user.name, user }));
  };

  const handleChange = (option: Option | null) => {
    setSelectedUser(option ? option.user : null);
  };

  return (
    <div className="space-y-6">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder="Search for a user..."
        className="w-full max-w-md mx-auto"
      />
      {selectedUser && <UserCard user={selectedUser} />}

      {/* <MutableDialog<UserFormData
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={() => {}}
      triggerButtonLabel="Add User"
      addDialogTitle="Add New User"
      dialogDescription="Fill out the form below to add a new user."
      submitButtonLabel="Add User"
    /> */}
    </div>
  );
}
