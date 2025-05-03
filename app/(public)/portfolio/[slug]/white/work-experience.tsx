"use client";

import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import RenderMarkdown from "@/components/parse-markdown";
import { cn } from "@/lib/utils";
import { useDateFormatter } from "@react-aria/i18n";
import { Link2, LocateFixed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const JOB_TYPE_MAP = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  SEMI_FULL_TIME: "Semi Full Time",
  INTERN: "Intern",
};

export default function WorkExperienceSection({
  data,
}: {
  data: UserWorkExperiences;
}) {
  let formatter = useDateFormatter({ dateStyle: "medium" });
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  return (
    <section className="py-10" id="experience">
      <div className="max-w-screen-lg mx-auto border">
        <div className="p-8 text-center border-b">
          <TextShimmer className="font-mono text-xl uppercase" duration={3}>
            Work Experience
          </TextShimmer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[500px] md:max-h-[500px]">
          <AnimatedGroup
            whileInView="visible"
            animate={undefined}
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              },

              item: {
                hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 1.2,
                    type: "spring",
                    bounce: 0.3,
                  },
                },
              },
            }}
            className="border-r"
          >
            {data?.map((work_experience, idx) => (
              <div
                key={work_experience.id}
                className={cn(
                  "border-b last:border-b-0",
                  selectedJobIndex == idx && "md:bg-gray-100"
                )}
                onMouseEnter={() => setSelectedJobIndex(idx)}
              >
                <div className="p-4 border-b md:border-b-0 bg-gray-100 md:bg-transparent">
                  <div className="flex justify-between items-center">
                    <h2 className="text-orange-500">
                      {work_experience.company_name}
                    </h2>
                    <Link href={work_experience.company_url}>
                      <Link2 strokeWidth={1.3} />
                    </Link>
                  </div>
                  <p className="">
                    {work_experience.job_title}&nbsp;
                    <span className="text-gray-800 text-sm">
                      ({JOB_TYPE_MAP[work_experience.job_type] || "Unknown"})
                    </span>
                  </p>
                  <p className="text-sm">
                    <span>
                      {formatter.format(new Date(work_experience.start_date))}
                    </span>
                    <span className="mx-2">-</span>
                    <span>
                      {work_experience.end_date
                        ? formatter.format(new Date(work_experience.end_date))
                        : "Present"}
                    </span>
                  </p>
                </div>

                <div className="p-4 flex-col flex md:hidden  overflow-auto">
                  <div className="flex-1">
                    <RenderMarkdown
                      markdown={work_experience?.description || "# Hello World"}
                    />
                  </div>

                  <div className="bg-gray-100 p-2 flex items-center gap-2 text-sm">
                    <LocateFixed strokeWidth={1.3} size={17} />{" "}
                    {work_experience?.location}
                  </div>
                </div>
              </div>
            ))}
          </AnimatedGroup>
          <div className="hidden md:flex flex-col md:min-h-[500px] md:max-h-[500px] overflow-auto">
            <div className="p-2 flex-1 overflow-auto">
              <RenderMarkdown
                markdown={
                  data?.at(selectedJobIndex)?.description || "# Hello World"
                }
              />
            </div>

            <div className="p-2 bg-gray-100 flex items-center gap-2 text-sm">
              <LocateFixed strokeWidth={1.3} size={17} />{" "}
              {data?.at(selectedJobIndex)?.location}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
