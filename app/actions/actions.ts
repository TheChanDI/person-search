"use server";

import { PrismaClient } from "@prisma/client";
import { userFormSchema } from "./schemas";
import type { User, UserFormData } from "./schemas";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

/**
 * Search for users whose names start with the given query (case-insensitive).
 */
export async function searchUsers(query: string): Promise<User[]> {
  console.log("Searching users with query:", query);
  const users = await prisma.user.findMany({
    where: {
      name: {
        startsWith: query,
        mode: "insensitive",
      },
    },
  });
  return users;
}

/**
 * Add a new user to the database after validating the input data.
 */
export async function addUser(data: UserFormData): Promise<User> {
  const validatedUser = userFormSchema.parse(data);
  const newUser = await prisma.user.create({
    data: validatedUser,
  });
  return newUser;
}

/**
 * Edit an existing user in the database after validating the input data.
 * @param id - The ID of the user to edit.
 * @param data - The new data for the user.
 */
export async function editUser(id: string, data: UserFormData): Promise<User> {
  // Validate the input data
  const validatedData = userFormSchema.parse(data);

  // Update the user in the database
  const updatedUser = await prisma.user.update({
    where: { id },
    data: validatedData,
  });

  revalidatePath("/");

  return updatedUser;
}
