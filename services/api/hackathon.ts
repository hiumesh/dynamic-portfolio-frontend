"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getUserHackathons() {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/hackathons`, {
    cache: "no-store",
  });

  return processFetchResponse<UserHackathons>(response);
}
export async function createUserHackathon(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/hackathons`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
  });

  return processFetchResponse<UserHackathon>(response);
}

export async function updateUserHackathon(id: number | string, body: any) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/hackathons/${id}`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(body),
    }
  );

  return processFetchResponse<UserHackathon>(response);
}

export async function deleteUserHackathon(id: number | string) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/hackathons/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    }
  );

  return processFetchResponse(response);
}

export async function reorderUserHackathons(
  id: number | string,
  newIndex: number
) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/hackathons/${id}/reorder`,
    {
      cache: "no-store",
      method: "PATCH",
      body: JSON.stringify({ new_index: newIndex }),
    }
  );

  return processFetchResponse(response);
}

export async function getMetadata() {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/hackathons/metadata`,
    {
      cache: "no-store",
    }
  );

  return processFetchResponse<
    Portfolio["additional_details"]["hackathon_metadata"]
  >(response);
}

export async function updateMetadata(data: any) {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/hackathons/metadata`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  return processFetchResponse(response);
}
