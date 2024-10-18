"use client";

import { useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { deleteUser, searchUsers } from "@/app/actions/actions";
import { UserCard } from "./user-card";
import { User } from "@/app/actions/schemas";
import { SelectInstance } from "react-select";

// Option type remains the same
interface Option {
  value: string;
  label: string;
  user: User;
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const selectRef = useRef<SelectInstance<Option, false>>(null);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const users = await searchUsers(inputValue);
    return users.map((user) => ({ value: user.id, label: user.name, user }));
  };

  const handleChange = (option: Option | null) => {
    setSelectedUser(option ? option.user : null);
  };

  const handleDeleteUser = async (id: string) => {
    if (selectRef.current) {
      selectRef.current.clearValue(); // Access clearValue method
    }
    try {
      const deletedUser = await deleteUser(id);
      console.log("deletedUser", deleteUser);
      return {
        success: true,
        message: `User ${deletedUser.name} deleted successfully`,
        data: deletedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete user",
      };
    }
  };

  return (
    <div className="space-y-6">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder="Search for a user..."
        className="w-full max-w-md mx-auto"
        ref={selectRef}
      />
      {selectedUser && (
        <UserCard onDelete={(id) => handleDeleteUser(id)} user={selectedUser} />
      )}
    </div>
  );
}
