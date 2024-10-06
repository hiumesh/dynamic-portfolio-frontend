"use server";

import { createClient } from "./supabase/server";

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
