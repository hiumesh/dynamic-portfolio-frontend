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

export default function ProjectSection() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["portfolio_work_metadata", "works", params.slug],
    queryFn: async () => {
      const response = await getSubDomainBySlug(params.slug, "works");
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data as WorkGalleryItems;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) return null;

  return (
    <section className="border-t border-dashed py-10">
      <MaxWidthWrapper className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Projects</h2>
          {error && <p className="text-sm text-red-500">{error?.message}</p>}
        </div>
        <div className="space-y-3">
          {data?.map((project, id) => (
            <ProjectCard key={id} data={project} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

const PLATFORM_TO_ICON = {
  Github: <GitHubLogoIcon />,
  Website: <Globe size={15} />,
  Social: <Globe size={15} />,
};

function ProjectCard({ data }: { data: WorkGalleryItem }) {
  let formatter = useDateFormatter({ dateStyle: "medium" });

  return (
    <div className="p-4 border border-dashed rounded-lg flex justify-between items-center">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            {data.title}
          </h3>
          <p className="text-xs max-w-md">{data.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.skills_used?.map((skill, id) => (
            <Chip key={skill} variant="solid" color="primary" size="sm">
              {skill}
            </Chip>
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
        <div className="flex flex-wrap gap-2">
          {data.attributes?.links?.map((link, id) => (
            <Link href={link.url} key={link.url}>
              <Chip
                startContent={
                  <span className="text-white pr-0.5">
                    {
                      PLATFORM_TO_ICON[
                        link.platform as keyof typeof PLATFORM_TO_ICON
                      ]
                    }
                  </span>
                }
                variant="solid"
                color="primary"
                title={link.platform}
                classNames={{
                  base: "pl-2",
                }}
                // radius="sm"
                size="sm"
              >
                {link.platform}
              </Chip>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
