"use client";

import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getProfile } from "@/services/api/users";
import { useToast } from "@/hooks/use-toast";

type Context = {
  profile: undefined | null | UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile | null | undefined>>;
  refreshProfile: () => Promise<void>;
};

const AppContext = createContext<Context>({
  profile: undefined,
  setProfile: () => {},
  refreshProfile: () => new Promise((resolve, reject) => {}),
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { toast } = useToast();
  const [profile, setProfile] = useState<undefined | null | UserProfile>(
    undefined
  );

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      if (profile.error) {
        throw new Error(
          profile.error?.message || "Failed to refresh the profile data."
        );
      }
      setProfile(profile.data?.data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error?.message || "Failed to refresh the profile data.",
      });
    }
  }, []);

  useEffect(() => {
    async function getUserProfile() {
      try {
        const session = await supabase.auth.getSession();

        if (!session.data.session || session.error) {
          setProfile(null);
          return;
        }

        const profile = await getProfile();
        if (profile.error) {
          setProfile(null);
          toast({
            variant: "destructive",
            title: "Something went wrong!",
            description:
              profile.error?.message ||
              "There was a problem with your request.",
          });
          return;
        }

        setProfile(profile.data?.data);
      } catch (error: any) {
        setProfile(null);
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description:
            error?.message || "There was a problem with your request.",
        });
      }
    }

    getUserProfile();
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        refreshProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
