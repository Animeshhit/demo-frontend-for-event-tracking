"use server";
import { cookies } from "next/headers";

export type User = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();



    return data.user ?? null;
  } catch (error) {
    console.error(
      "getCurrentUser error:",
      error
    );

    return null;
  }
}