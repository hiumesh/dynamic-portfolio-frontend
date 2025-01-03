"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getUserWorkExperiences() {
  const response = await fetchWithAuth(`${REST_URL}/users/experiences`, {
    cache: "no-store",
  });

  return processFetchResponse<UserWorkExperiences>(response);
}
export async function createUserWorkExperience(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/experiences`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
  });

  return processFetchResponse<UserWorkExperience>(response);
}

export async function updateUserWorkExperience(id: number | string, body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/experiences/${id}`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });

  return processFetchResponse<UserWorkExperience>(response);
}

export async function deleteUserWorkExperience(id: number | string) {
  const response = await fetchWithAuth(`${REST_URL}/users/experiences/${id}`, {
    cache: "no-store",
    method: "DELETE",
  });

  return processFetchResponse(response);
}

export async function reorderUserWorkExperiences(
  id: number | string,
  newIndex: number
) {
  const response = await fetchWithAuth(
    `${REST_URL}/users/experiences/${id}/reorder`,
    {
      cache: "no-store",
      method: "PATCH",
      body: JSON.stringify({ new_index: newIndex }),
    }
  );

  return processFetchResponse(response);
}
