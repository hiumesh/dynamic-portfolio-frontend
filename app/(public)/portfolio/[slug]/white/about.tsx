// import { TextScramble } from "@/components/motion-primitives/text-scramble";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import RenderMarkdown from "@/components/parse-markdown";
import Image from "next/image";
// import { useState } from "react";

export default function AboutSection({ portfolio }: { portfolio: Portfolio }) {
  // const [isTrigger, setIsTrigger] = useState(false);
  const { basic_details } = portfolio;
  return (
    <section className="pb-10">
      <div className="max-w-screen-lg mx-auto border">
        <div className="p-8 text-center border-b">
          <TextShimmer className="font-mono text-xl uppercase" duration={3}>
            Know About Me
          </TextShimmer>
        </div>
        <div className="grid grid-cols-1 p-10 md:p-0 md:grid-cols-2 min-h-[500px]">
          <div className="relative min-h-[300px]">
            <Image
              src={basic_details.about_image || "/about.jpg"}
              alt="about"
              fill
              className="object-contain md:object-cover"
            />
          </div>
          {/* <div className="flex flex-col items-start justify-center pl-10 gap-4">
            <TextScramble
              className="font-bold text-6xl uppercase whitespace-nowrap"
              duration={6}
              trigger={isTrigger}
              onViewportEnter={() => setIsTrigger(true)}
              onViewportLeave={() => setIsTrigger(false)}
              // onScrambleComplete={() => setIsTrigger(false)}
            >
              Let&apos;s bring
            </TextScramble>
            <TextScramble
              className="font-bold text-6xl uppercase  whitespace-nowrap"
              duration={6}
            >
              your
            </TextScramble>
            <TextScramble
              className="font-bold text-6xl uppercase  whitespace-nowrap"
              duration={6}
            >
              software
            </TextScramble>
            <TextScramble
              className="font-bold text-6xl uppercase whitespace-nowrap"
              duration={6}
            >
              to life.
            </TextScramble>
          </div> */}
          <div className="px-4">
            <RenderMarkdown markdown={basic_details.about || "# Hello World"} />
          </div>
        </div>
      </div>
    </section>
  );
}
