"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getSubDomainBySlug } from "@/services/api/portfolio";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function EducationSection() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["portfolio_education_metadata", "educations", params.slug],
    queryFn: async () => {
      const response = await getSubDomainBySlug(params.slug, "educations");
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data as UserEducations;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) return null;

  return (
    <section className="border-t border-dashed py-10">
      <MaxWidthWrapper className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Education</h2>
          {error && <p className="text-sm text-red-500">{error?.message}</p>}
        </div>
        <div className="space-y-3">
          {data?.map((education, id) => (
            <EducationCard key={id} data={education} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

function EducationCard({ data }: { data: UserEducation }) {
  if (data.type == "COLLEGE")
    return (
      <div className="p-4 border border-dashed rounded-lg flex justify-between items-center">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              {data.institute_name}
            </h3>
            <p className="text-sm">
              {data.attributes?.degree}
              <span className="text-gray-500">
                ({data.attributes?.field_of_study})
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm max-w-xs">
            CGPA: <span className="font-medium">{data.grade}</span>
          </p>

          <p className="text-sm text-gray-500">
            <span>{data.attributes?.start_year}</span>
            <span className="mx-2">-</span>
            <span>{data.attributes?.end_year || "Present"}</span>
          </p>
        </div>
      </div>
    );
  if (data.type == "SCHOOL")
    return (
      <div className="p-4 border border-dashed rounded-lg flex justify-between items-center">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              {data.institute_name}
            </h3>
            <p className="text-sm">
              Class:{" "}
              <span className="font-medium">{data.attributes?.class}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm max-w-xs">
            CGPA: <span className="font-medium">{data.grade}</span>
          </p>

          <p className="text-sm text-gray-500">
            Passing Year:
            <span className="font-medium">{data.attributes?.passing_year}</span>
          </p>
        </div>
      </div>
    );
  else return null;
}
