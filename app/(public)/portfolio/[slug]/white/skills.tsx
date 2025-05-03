import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { Skills } from "@/types/api/metadata";
import { Chip } from "@heroui/react";
import _ from "lodash";
import Image from "next/image";

export default function SkillsSection({ skills }: { skills: Skills }) {
  return (
    <section id="skills">
      <div className="max-w-screen-lg mx-auto ">
        <div className="p-8 text-center border">
          <TextShimmer className="font-mono text-xl uppercase" duration={3}>
            Skills
          </TextShimmer>
        </div>

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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-t border-l"
        >
          {skills
            ?.filter((s) => s.image)
            ?.map((skill, id) => (
              <div
                key={skill.name}
                className="flex flex-col gap-4 items-center justify-center border-r border-b p-5 text-center h-[190px]"
              >
                <div className="relative h-[60px] w-[60px]">
                  <Image
                    src={skill.image as string}
                    alt={skill.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="mt-2">{skill.name}</p>
              </div>
            ))}
        </AnimatedGroup>

        <div className="border-x border-b p-5 space-y-3">
          <h1 className="font-mono text-xl uppercase">Remaining Skills</h1>
          <div className="flex items-center flex-wrap gap-3">
            {skills
              ?.filter((s) => !s.image)
              ?.map((skill, id) => (
                <Chip
                  key={skill.name}
                  variant="solid"
                  color="primary"
                  size="lg"
                >
                  {skill.name}
                </Chip>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
