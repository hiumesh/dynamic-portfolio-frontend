"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function get() {
  const response = await fetchWithAuth(`${REST_URL}/blogs`, {
    cache: "no-store",
  });

  return processFetchResponse<BlogPosts>(response);
}

export async function getDetail(id: string | number) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/${id}`, {
    cache: "no-store",
  });

  return processFetchResponse<Blog>(response);
}

export async function create(body: any, publish: boolean = false) {
  const response = await fetchWithAuth(
    `${REST_URL}/blogs${publish ? "?status=publish" : ""}`,
    {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  return processFetchResponse(response);
}

export async function update(
  id: string | number,
  body: any,
  publish: boolean = false
) {
  const response = await fetchWithAuth(
    `${REST_URL}/blogs/${id}${publish ? "?status=publish" : ""}`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(body),
    }
  );

  return processFetchResponse(response);
}

export async function takedown(id: string | number) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/${id}/unpublish`, {
    cache: "no-store",
  });

  return processFetchResponse(response);
}

export async function remove(id: number | string) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/${id}`, {
    cache: "no-store",
    method: "DELETE",
  });

  return processFetchResponse(response);
}

export async function getMetadata() {
  const response = await fetchWithAuth(`${REST_URL}/blogs/metadata`, {
    cache: "no-store",
  });

  return processFetchResponse<Portfolio["additional_details"]["blog_metadata"]>(
    response
  );
}

export async function updateMetadata(data: any) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/metadata`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(data),
  });

  return processFetchResponse(response);
}
