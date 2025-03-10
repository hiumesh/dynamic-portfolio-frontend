import { createClient } from "@/lib/supabase/server";

import SignUpUI from "./ui";
import { redirect } from "next/navigation";

export default async function SignIn() {
  return <SignUpUI />;
}
