import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ForgotPasswordUI from "./ui";

export default async function ForgotPassword() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (data.session) redirect("/");
  return <ForgotPasswordUI />;
}
