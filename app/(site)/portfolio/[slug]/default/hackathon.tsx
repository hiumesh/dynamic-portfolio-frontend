"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getSubDomainBySlug } from "@/services/api/portfolio";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useDateFormatter } from "@react-aria/i18n";
import Link from "next/link";
import { Globe, LinkIcon } from "lucide-react";
import { Chip } from "@nextui-org/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function HackathonSection() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["portfolio_hackathon_metadata", "hackathons", params.slug],
    queryFn: async () => {
      const response = await getSubDomainBySlug(params.slug, "hackathons");
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data as UserHackathons;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) return null;

  return (
    <section className="border-t border-dashed py-10">
      <MaxWidthWrapper className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Hackathons</h2>
          {error && <p className="text-sm text-red-500">{error?.message}</p>}
        </div>
        <div className="space-y-3">
          {data?.map((hackathon, id) => (
            <HackathonCard key={id} data={hackathon} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

const PLATFORM_TO_ICON = {
  Github: <GitHubLogoIcon />,
  Website: <Globe />,
  Social: <Globe />,
};

function HackathonCard({ data }: { data: UserHackathon }) {
  let formatter = useDateFormatter({ dateStyle: "medium" });

  return (
    <div className="p-4 border border-dashed rounded-lg flex justify-between items-center">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            {data.title}
            {data.certificate_link ? (
              <Link href={data.certificate_link}>
                <LinkIcon size={15} />
              </Link>
            ) : null}
          </h3>
          <p className="text-xs max-w-md">{data.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.attributes?.links?.map((link, id) => (
            <Link href={link.url} key={link.url}>
              <Chip
                startContent={
                  <span className="text-white">
                    {
                      PLATFORM_TO_ICON[
                        link.platform as keyof typeof PLATFORM_TO_ICON
                      ]
                    }
                  </span>
                }
                title={link.platform}
                classNames={{
                  base: "bg-black",
                  content: "text-white",
                }}
                radius="sm"
              >
                {link.platform}
              </Chip>
            </Link>
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">
          <span>{formatter.format(new Date(data.start_date))}</span>
          <span className="mx-2">-</span>
          <span>
            {data.end_date
              ? formatter.format(new Date(data.end_date))
              : "Present"}
          </span>
        </p>
        <p className="text-sm max-w-xs">{data.location}</p>
      </div>
    </div>
  );
}
