"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/client-utils";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      showErrorToast(error, "There was a problem with your request.");
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleSignOut} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Log Out
    </Button>
  );
}
