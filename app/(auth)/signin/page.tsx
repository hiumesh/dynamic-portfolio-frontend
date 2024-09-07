import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import SignInUI from "./ui";

export default async function SignIn() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (data.session) redirect("/");
  return <SignInUI />;
}
