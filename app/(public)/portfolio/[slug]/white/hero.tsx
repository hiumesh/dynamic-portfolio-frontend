import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { TextEffect } from "@/components/ui/text-effect";
import { TextLoop } from "@/components/ui/text-loop";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero({ portfolio }: { portfolio: Portfolio }) {
  const { basic_details } = portfolio;
  return (
    <section>
      <div className="max-w-screen-lg mx-auto border-x grid grid-cols-1 md:grid-cols-2 ">
        <div className="px-10 py-20 space-y-5 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
            <TextShimmer className="font-mono text-sm" duration={3}>
              Available for work
            </TextShimmer>
            <ArrowRight strokeWidth={1.2} size={19} />
          </div>
          <div className="space-y-3">
            <TextEffect
              per="char"
              preset="fade"
              as="h1"
              className="text-6xl font-extrabold"
            >
              Hi,
            </TextEffect>
            <TextEffect
              per="word"
              as="h1"
              preset="blur"
              className="text-6xl font-extrabold"
            >
              {basic_details?.name
                ? `I'm ${basic_details.name.split(" ")[0]}`
                : "Anonymous"}
            </TextEffect>
          </div>
          <h2 className="inline-flex whitespace-pre-wrap text-3xl font-medium">
            I&apos;m&nbsp;
            <TextLoop
              className="overflow-y-clip"
              transition={{
                type: "spring",
                stiffness: 900,
                damping: 80,
                mass: 10,
              }}
              variants={{
                initial: {
                  y: 20,
                  rotateX: 90,
                  opacity: 0,
                  filter: "blur(4px)",
                },
                animate: {
                  y: 0,
                  rotateX: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                },
                exit: {
                  y: -20,
                  rotateX: -90,
                  opacity: 0,
                  filter: "blur(4px)",
                },
              }}
            >
              {basic_details?.work_domains?.map((domain, index) => (
                <span key={index}>{domain}</span>
              ))}
              {!basic_details?.work_domains && (
                <>
                  <span>Unemployed</span>
                  <span>Not found</span>
                </>
              )}
            </TextLoop>
          </h2>
          <TextEffect
            per="line"
            as="p"
            segmentWrapperClassName="overflow-hidden block"
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  y: 40,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                  },
                },
              },
            }}
            className="text-lg md:max-w-md text-gray-800"
          >
            {basic_details?.tagline || "Op's, not found"}
          </TextEffect>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Link
              href={`mailto:${basic_details?.email}`}
              className="px-3 py-2 text-sm font-light tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Contact Me
            </Link>
            {basic_details.resume && (
              <Link
                href={basic_details.resume}
                target="_blank"
                className="flex items-center text-sm justify-center gap-2 px-3 py-2 font-light tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download size={18} strokeWidth={1.5} /> Resume
              </Link>
            )}
          </div>
        </div>
        <div className="relative flex items-center justify-center min-h-[300px]">
          <Image
            src={basic_details?.hero_image || ""}
            fill
            alt="profile"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
