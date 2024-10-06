"use server";

import { APIServiceHandler } from "@/types/api";
import { fetchWithAuth } from "@/utils/server-helpers";

const BASE_URL = process.env.NEXT_PUBLIC_REST_URL;

export async function getProfile(): Promise<APIServiceHandler> {
  const response = await fetchWithAuth(`${BASE_URL}/users/profile`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok && data) return { data: null, error: data };
  if (!response.ok)
    throw new Error(
      `HTTP error! Status: ${response.status}, ${response.statusText}`
    );

  return { data, error: null };
}

export async function profileSetup(body: any): Promise<APIServiceHandler> {
  const response = await fetchWithAuth(`${BASE_URL}/users/profile-setup`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok && data) return { data: null, error: data };
  if (!response.ok)
    throw new Error(
      `HTTP error! Status: ${response.status}, ${response.statusText}`
    );

  return { data, error: null };
}
