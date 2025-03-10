import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ForgotPasswordUI from "./ui";

export default async function ForgotPassword() {
  return <ForgotPasswordUI />;
}
