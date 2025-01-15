"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getProfile() {
  const response = await fetchWithAuth(`${REST_URL}/users/profile`, {
    cache: "no-store",
  });

  return processFetchResponse<UserProfile>(response);
}

export async function profileSetup(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/profile/setup`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });

  return processFetchResponse(response);
}

export async function updateProfile(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/profile`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });

  return processFetchResponse(response);
}
