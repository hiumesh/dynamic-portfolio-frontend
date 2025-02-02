"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getUserCertifications() {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/certifications`, {
    cache: "no-store",
  });

  return processFetchResponse<UserCertifications>(response);
}
export async function createUserCertification(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/certifications`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
  });

  return processFetchResponse<UserCertification>(response);
}

export async function updateUserCertification(id: number | string, body: any) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/certifications/${id}`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(body),
    }
  );

  return processFetchResponse<UserCertification>(response);
}

export async function deleteUserCertification(id: number | string) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/certifications/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    }
  );

  return processFetchResponse(response);
}

export async function reorderUserCertification(
  id: number | string,
  newIndex: number
) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/certifications/${id}/reorder`,
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
    `${REST_URL}/portfolio/certifications/metadata`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  return processFetchResponse(response);
}
