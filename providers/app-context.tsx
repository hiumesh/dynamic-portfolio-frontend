"use client";

import { createClient } from "@/lib/supabase/client";
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
import { showErrorToast } from "@/lib/client-utils";

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
  const [profile, setProfile] = useState<undefined | null | UserProfile>(
    undefined
  );

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setProfile(profile);
    } catch (error: any) {
      showErrorToast(error, "Failed to refresh the profile data.");
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

        setProfile(profile);
      } catch (error: any) {
        setProfile(null);
        showErrorToast(error, "There was a problem with your request.");
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
