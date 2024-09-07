import { createClient } from "@/utils/supabase/server";

import SignUpUI from "./ui";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (data.session) redirect("/");
  return <SignUpUI />;
}
