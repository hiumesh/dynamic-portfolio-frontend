"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function signIn(
  formData: any
): Promise<ServerActionResponse<undefined>> {
  const supabase = createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // redirect("/error");
    // throw new Error(error.message);
    return { error: { message: error.message } };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function initUpdatePassword(
  email: string
): Promise<ServerActionResponse<any>> {
  const supabase = createClient();
  // const origin = headers().get("origin");
  // for code exchange at callback
  // const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  //   redirectTo: `${origin}/auth/callback?next=/update-password`,
  // });

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) return { error: { message: error.message } };
  return { data: { ...data } };
}

export async function signUp(
  formData: any
): Promise<ServerActionResponse<User>> {
  const supabase = createClient();
  // const origin = headers().get("origin");
  const body = {
    email: formData.email,
    password: formData.password,
  };

  // for code exchange at callback
  // const { data, error } = await supabase.auth.signUp({
  //   ...body,
  //   options: {
  //     emailRedirectTo: `${origin}/auth/callback`,
  //   },
  // });

  const { data, error } = await supabase.auth.signUp(body);

  if (error) {
    // redirect("/error");
    // throw new Error(error.message);
    return { error };
  }

  return { data: data.user as User };
}

export async function handleGoogleSignIn(): Promise<
  ServerActionResponse<undefined>
> {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) return { error };

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
  return {};
}

export async function updatePassword(
  password: string
): Promise<ServerActionResponse<User>> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) return { error };

  return { data: data.user as User };
}

export async function exchangeCodeForSession(
  code: string
): Promise<ServerActionResponse<undefined>> {
  const supabase = createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return { error };
  }

  return {};
}
