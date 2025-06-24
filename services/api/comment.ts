"use server";

import { REST_URL } from "@/lib/constants";
import { fetchWithAuth, processFetchResponse } from "@/lib/server-utils";

export async function getComments({
  slug,
  module,
  parentId,
  cursor,
}: {
  slug?: string;
  module?: string;
  parentId?: string | number;
  cursor?: string | number;
}) {
  const queryParams = [`slug=${slug}`, `module=${module}`];
  if (parentId) queryParams.push(`parent_id=${parentId}`);
  if (cursor) queryParams.push(`cursor=${cursor}`);
  const response = await fetchWithAuth(
    `${REST_URL}/comments?${queryParams.join("&")}`,
    {
      cache: "no-store",
    },
    {
      continueIfNotAuthenticated: true,
    }
  );

  return processFetchResponse<{ list: BlogComment[]; cursor: number | null }>(
    response
  );
}

export async function createComment({
  module,
  slug,
  body,
}: {
  module?: string;
  slug?: string;
  body?: string;
}) {
  const response = await fetchWithAuth(`${REST_URL}/comments`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ body, module, slug }),
  });

  return processFetchResponse(response);
}

export async function commentReply({
  module,
  commentId,
  body,
}: {
  module?: string;
  commentId?: string | number;
  body?: string;
}) {
  const response = await fetchWithAuth(
    `${REST_URL}/comments/${commentId}/reply`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify({ body, module }),
    }
  );

  return processFetchResponse(response);
}

export async function commentReaction({
  commentId,
  reaction,
  action,
}: {
  commentId?: string | number;
  reaction?: string;
  action?: string;
}) {
  const response = await fetchWithAuth(
    `${REST_URL}/comments/${commentId}/reaction`,
    {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify({ reaction, action }),
    }
  );

  return processFetchResponse(response);
}
