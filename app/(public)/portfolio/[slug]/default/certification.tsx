"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getSubDomainBySlug } from "@/services/api/portfolio";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useDateFormatter } from "@react-aria/i18n";
import { Chip } from "@heroui/react";
import Link from "next/link";
import { LinkIcon } from "lucide-react";

export default function CertificationSection() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "portfolio_certification_metadata",
      "certifications",
      params.slug,
    ],
    queryFn: async () => {
      const response = await getSubDomainBySlug(params.slug, "certifications");
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data as UserCertifications;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) return null;

  return (
    <section className="border-t border-dashed py-10">
      <MaxWidthWrapper className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Certifications</h2>
          {error && <p className="text-sm text-red-500">{error?.message}</p>}
        </div>
        <div className="space-y-3">
          {data?.map((certification, id) => (
            <CertificationCard key={id} data={certification} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

function CertificationCard({ data }: { data: UserCertification }) {
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
          <p className="text-sm">
            Completion Date:
            <span className="font-medium">
              {formatter.format(new Date(data.completion_date))}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills_used?.map((skill, id) => (
            <Chip key={skill} variant="solid" color="primary" size="sm">
              {skill}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
