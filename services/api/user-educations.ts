"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getUserEducations() {
  const response = await fetchWithAuth(`${REST_URL}/users/educations`, {
    cache: "no-store",
  });

  return processFetchResponse<UserEducations>(response);
}
export async function createUserEducation(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/educations`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
  });

  return processFetchResponse<UserEducation>(response);
}

export async function updateUserEducation(id: number | string, body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/educations/${id}`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });

  return processFetchResponse<UserEducation>(response);
}

export async function deleteUserEducation(id: number | string) {
  const response = await fetchWithAuth(`${REST_URL}/users/educations/${id}`, {
    cache: "no-store",
    method: "DELETE",
  });

  return processFetchResponse(response);
}

export async function reorderUserEducations(
  id: number | string,
  newIndex: number
) {
  const response = await fetchWithAuth(
    `${REST_URL}/users/educations/${id}/reorder`,
    {
      cache: "no-store",
      method: "PATCH",
      body: JSON.stringify({ new_index: newIndex }),
    }
  );

  return processFetchResponse(response);
}

export async function updateMetadata(data: any) {
  const response = await fetchWithAuth(
    `${REST_URL}/users/educations/metadata`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  return processFetchResponse(response);
}
