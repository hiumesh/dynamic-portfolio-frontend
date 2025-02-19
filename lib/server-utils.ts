"use server";

import { createClient } from "./supabase/server";

export async function fetchWithAuth(
  url: string | URL | globalThis.Request,
  init: RequestInit,
  options: { continueIfNotAuthenticated?: boolean } = {
    continueIfNotAuthenticated: false,
  }
) {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session && !options?.continueIfNotAuthenticated)
    throw new Error("No session found!");

  let fetchOptions: RequestInit;

  if (data.session) {
    fetchOptions = {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${data.session.access_token}`,
      },
    };
  } else {
    fetchOptions = {
      ...init,
    };
  }

  return fetch(url, fetchOptions);
}

export async function processFetchResponse<T = any>(
  response: Response
): Promise<ServerActionResponse<T>> {
  let data = null;
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }
  if (response.ok)
    return {
      data,
    };
  else if (!response.ok && data) {
    if (data["error_code"] == "validation_failed") {
      return {
        error: {
          message: data?.message || "Server Error, Try Again Later",
          data: data?.error,
        },
      };
    }
    return {
      error: {
        message: data?.message || "Server Error, Try Again Later",
      },
    };
  } else {
    return {
      error: {
        message: `HTTP error! Status: ${response.status}, ${response.statusText}`,
      },
    };
  }
}
