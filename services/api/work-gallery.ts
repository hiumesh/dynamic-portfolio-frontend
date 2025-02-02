"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function findAll() {
  const response = await fetchWithAuth(`${REST_URL}/work-gallery`, {
    cache: "no-store",
  });

  return processFetchResponse<WorkGalleryItems>(response);
}
export async function create(body: any) {
  const response = await fetchWithAuth(`${REST_URL}/work-gallery`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(body),
  });

  return processFetchResponse<WorkGalleryItem>(response);
}

export async function update(id: number | string, body: any) {
  const response = await fetchWithAuth(`${REST_URL}/work-gallery/${id}`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(body),
  });

  return processFetchResponse<WorkGalleryItem>(response);
}

export async function remove(id: number | string) {
  const response = await fetchWithAuth(`${REST_URL}/work-gallery/${id}`, {
    cache: "no-store",
    method: "DELETE",
  });

  return processFetchResponse(response);
}

export async function reorder(id: number | string, newIndex: number) {
  const response = await fetchWithAuth(
    `${REST_URL}/work-gallery/${id}/reorder`,
    {
      cache: "no-store",
      method: "PATCH",
      body: JSON.stringify({ new_index: newIndex }),
    }
  );

  return processFetchResponse(response);
}

export async function getMetadata() {
  const response = await fetchWithAuth(`${REST_URL}/work-gallery/metadata`, {
    cache: "no-store",
  });

  return processFetchResponse<
    Portfolio["additional_details"]["work_gallery_metadata"]
  >(response);
}

export async function updateMetadata(data: any) {
  const response = await fetchWithAuth(`${REST_URL}/work-gallery/metadata`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(data),
  });

  return processFetchResponse(response);
}
