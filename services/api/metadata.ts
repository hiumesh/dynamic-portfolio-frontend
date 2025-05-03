"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";
import { Skills } from "@/types/api/metadata";

export async function getSkills({
  cursor,
  query,
}: {
  cursor?: string | number;
  query?: string;
}) {
  const queryParams = [];
  if (cursor) queryParams.push(`cursor=${cursor}`);
  if (query) queryParams.push(`query=${query}`);
  const response = await fetchWithAuth(
    `${REST_URL}/metadata/skills?${queryParams.join("&")}`,
    {
      cache: "no-store",
    },
    { continueIfNotAuthenticated: true }
  );

  return processFetchResponse<{ list: Skills; cursor: number }>(response);
}
