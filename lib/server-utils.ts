"use server";

import { createClient } from "./supabase/server";
import { APIError, ValidationError } from "./errors";

export async function fetchWithAuth(
  url: string | URL | globalThis.Request,
  init: RequestInit
) {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("No session found!");

  const options: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${data.session.access_token}`,
    },
  };

  return fetch(url, options);
}

export async function processFetchResponse<T = any>(
  response: Response
): Promise<T> {
  let data = null;
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }
  if (response.ok) return data;
  else if (!response.ok && data) {
    if (data["error_code"] == "validation_failed")
      throw new ValidationError(
        data?.message || "Server Error, Try Again Later",
        data?.error
      );
    throw new APIError(data?.message || "Server Error, Try Again Later");
  } else {
    throw new Error(
      `HTTP error! Status: ${response.status}, ${response.statusText}`
    );
  }
}
