"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getAll({
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
    `${REST_URL}/blogs?${queryParams.join("&")}`,
    {
      cache: "no-store",
    },
    { continueIfNotAuthenticated: true }
  );

  return processFetchResponse<{ list: BlogPost[]; cursor: number }>(response);
}

export async function get({
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
    `${REST_URL}/blogs/user?${queryParams.join("&")}`,
    {
      cache: "no-store",
    }
  );

  return processFetchResponse<{ list: BlogPost[]; cursor: number }>(response);
}

export async function getDetail(id: string | number) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/user/${id}`, {
    cache: "no-store",
  });

  return processFetchResponse<Blog>(response);
}

export async function getDetailBySlug(slug: string) {
  const response = await fetchWithAuth(
    `${REST_URL}/blogs/${slug}`,
    {
      cache: "no-store",
    },
    { continueIfNotAuthenticated: true }
  );

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
    method: "PUT",
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

export async function blogReaction({
  blogId,
  reaction,
  action,
}: {
  blogId: string | number;
  reaction: string;
  action: string;
}) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/${blogId}/reaction`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify({ reaction, action }),
  });

  return processFetchResponse(response);
}

export async function bookmark(blogId: string | number) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/${blogId}/bookmark`, {
    cache: "no-store",
    method: "PUT",
  });

  return processFetchResponse(response);
}

export async function removeBookmark(blogId: string | number) {
  const response = await fetchWithAuth(`${REST_URL}/blogs/${blogId}/bookmark`, {
    cache: "no-store",
    method: "DELETE",
  });

  return processFetchResponse(response);
}
