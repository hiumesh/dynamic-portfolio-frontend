"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error?.message || "There was a problem with your request.",
      });
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
