"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getPostPresignedUrl(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/users/presigned-urls`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
  });

  return processFetchResponse<PostPresignedUrls>(response);
}
