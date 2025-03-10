import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import SignInUI from "./ui";

export default async function SignIn() {
  return <SignInUI />;
}
