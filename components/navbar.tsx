"use client";

import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

import logo from "@/assets/svgs/Logo2.svg";
import UserNav from "./user-nav";
import { User } from "@supabase/supabase-js";
import { useAppContext } from "@/providers/app-context";

export default function Navbar() {
  const { profile } = useAppContext();

  return (
    <nav className="border-b h-12">
      <div className="flex justify-between items-center px-2.5 max-w-screen-lg mx-auto">
        <div className="">
          <Image
            src={logo}
            alt="logo"
            height={50}
            className="[clip-path:polygon(0%_30%,100%_30%,100%_70%,0%_70%)]"
          />
        </div>

        {profile ? <UserNav profile={profile} /> : null}
      </div>
    </nav>
  );
}
