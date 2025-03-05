"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getSubDomainBySlug } from "@/services/api/portfolio";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useDateFormatter } from "@react-aria/i18n";
import Link from "next/link";
import { LinkIcon } from "lucide-react";
import { Chip } from "@nextui-org/react";

export default function WorkExperienceSection() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["portfolio_education_metadata", "work_experiences", params.slug],
    queryFn: async () => {
      const response = await getSubDomainBySlug(
        params.slug,
        "work_experiences"
      );
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data as UserWorkExperiences;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) return null;

  return (
    <section className="border-t border-dashed py-10">
      <MaxWidthWrapper className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Work Experience</h2>
          {error && <p className="text-sm text-red-500">{error?.message}</p>}
        </div>
        <div className="space-y-3">
          {data?.map((work_experience, id) => (
            <WorkExperienceCard key={id} data={work_experience} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

const JOB_TYPE_MAP = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  SEMI_FULL_TIME: "Semi Full Time",
  INTERN: "Intern",
};

function WorkExperienceCard({ data }: { data: UserWorkExperience }) {
  let formatter = useDateFormatter({ dateStyle: "medium" });

  return (
    <div className="p-4 border border-dashed rounded-lg flex justify-between items-center">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            {data.company_name}
            {data.company_url ? (
              <Link href={data.company_url}>
                <LinkIcon size={15} />
              </Link>
            ) : null}
          </h3>
          <p className="text-sm">
            {data.job_title}
            <span className="text-gray-500">
              ({JOB_TYPE_MAP[data.job_type] || "Unknown"})
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
