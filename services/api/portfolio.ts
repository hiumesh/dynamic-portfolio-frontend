"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function get() {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/user`, {
    cache: "no-store",
  });

  return processFetchResponse<Portfolio>(response);
}

export async function publish() {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/status/publish`, {
    cache: "no-store",
  });

  return processFetchResponse(response);
}

export async function takedown() {
  const response = await fetchWithAuth(
    `${REST_URL}/portfolio/status/takedown`,
    {
      cache: "no-store",
    }
  );

  return processFetchResponse(response);
}

export async function updateSkills(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/portfolio/skills`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });
  return processFetchResponse(response);
}
