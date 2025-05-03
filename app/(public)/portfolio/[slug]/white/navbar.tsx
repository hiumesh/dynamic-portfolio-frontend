"use client";

import { getBySlug } from "@/services/api/portfolio";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const links = [
  {
    label: "Skills",
    href: "#skills",
  },
  {
    label: "Work Experience",
    href: "#experience",
  },
  {
    label: "Projects",
    href: "#projects",
  },
];

export default function Navbar() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["portfolio_metadata", params.slug],
    queryFn: async () => {
      const response = await getBySlug(params.slug);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const { basic_details } = data || {};

  return (
    <header className="sticky top-0 border-b bg-white z-20">
      <div className="max-w-screen-lg py-1.5 px-3 xl:px-0 mx-auto flex items-center justify-between gap-3">
        <Terminal className="text-orange-500" />
        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href={`mailto:${basic_details?.email}`}
          className="px-2.5 py-2 text-xs font-normal tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Hire Me!
        </Link>
      </div>
    </header>
  );
}
