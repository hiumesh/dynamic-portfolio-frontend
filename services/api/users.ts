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

export async function getFollowers() {
  const response = await fetchWithAuth(`${REST_URL}/users/followers`, {
    cache: "no-store",
  });

  return processFetchResponse<ListUsers>(response);
}

export async function getFollowing() {
  const response = await fetchWithAuth(`${REST_URL}/users/following`, {
    cache: "no-store",
  });

  return processFetchResponse<ListUsers>(response);
}

export async function follow(slug: string) {
  const response = await fetchWithAuth(`${REST_URL}/users/${slug}/follow`, {
    cache: "no-store",
    method: "POST",
  });

  return processFetchResponse(response);
}

export async function unfollow(slug: string) {
  const response = await fetchWithAuth(`${REST_URL}/users/${slug}/follow`, {
    cache: "no-store",
    method: "DELETE",
  });

  return processFetchResponse(response);
}

export async function getFollowStatus(slug: string) {
  const response = await fetchWithAuth(
    `${REST_URL}/users/${slug}/follow-status`,
    {
      cache: "no-store",
    }
  );

  return processFetchResponse<{ is_following: boolean }>(response);
}
