"use client";

import { getBySlug } from "@/services/api/portfolio";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Link as LL } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

function platformToIconMap(platform: string) {
  switch (platform) {
    case "Github":
      return <GitHubLogoIcon className="w-7 h-7" />;
    case "LinkedIn":
      return <LinkedInLogoIcon className="w-7 h-7" />;
    default:
      return <LL />;
  }
}

export default function FooterSection() {
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

  if (isLoading || !data || error) return null;

  console.log(data);

  return (
    <footer className="pt-10 pb-32">
      <div className="max-w-screen-lg mx-auto px-5 xl:px-0 flex">
        <div className="space-y-2">
          <h3>Social Profiles</h3>
          <div className="flex gap-3 items-center">
            {data.basic_details.social_profiles?.map((s) => (
              <Link href={s.url} key={s.url}>
                {platformToIconMap(s.platform)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
