import MaxWidthWrapper from "@/components/max-width-wrapper";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

interface PropTypes {
  user?: User | null;
}

const items = [
  {
    title: "Portfolio",
    url: "/portfolio",
  },
  {
    title: "Work Gallery",
    url: "/work-gallery",
  },
  {
    title: "Blogs",
    url: "/blogs",
  },
];

export default function TopNavbar({ user }: PropTypes) {
  return (
    <nav className="sticky top-0 z-30 shadow-md p-2 bg-black">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center gap-5">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-8 h-8"
            />
          </Link>
          <div className="flex gap-4 items-center">
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="tracking-wide text-xs text-white"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div>
            {user ? (
              <Link
                href={"/dashboard"}
                className="text-xs bg-gray-800 hover:bg-opacity-55 p-2 px-3 rounded-full text-white"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex gap-2 items-center">
                <Link
                  href={"/signin"}
                  className="text-xs bg-gray-800 hover:bg-opacity-55 p-2 px-3 rounded-full text-white"
                >
                  Log In
                </Link>
                <Link
                  href={"/signup"}
                  className="text-xs bg-gray-800 hover:bg-opacity-55 p-2 px-3 rounded-full text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
