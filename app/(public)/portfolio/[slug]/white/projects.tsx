"use client";

import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { cn } from "@/lib/utils";
import { Button, Chip, Image } from "@heroui/react";
import { ChevronLeft, ChevronRight, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProjectsSection({ data }: { data: WorkGalleryItems }) {
  return (
    <section id="projects">
      <div className="max-w-screen-lg mx-auto border-t border-l">
        <div className="p-8 text-center border-b">
          <TextShimmer className="font-mono text-xl uppercase" duration={3}>
            Projects
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          {data.map((project, idx) => (
            <div
              key={project.id}
              className={cn("border-r border-b group h-full")}
            >
              {project.attachments.length > 0 ? (
                <Carousel attachments={project.attachments} />
              ) : (
                <div className="h-56 p-4 bg-gray-100">
                  <div className="relative h-full overflow-hidden">
                    <Image src="/no-image.jpg" alt="no image" radius="none" />
                  </div>
                </div>
              )}

              <div className="p-4 space-y-4">
                <h2 className="text-orange-500 text-lg font-medium">
                  {project.title}
                </h2>
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_used?.map((tag) => (
                      <Chip
                        key={tag}
                        variant="bordered"
                        color="primary"
                        size="sm"
                        className="border-1 border-gray-300 text-gray-600"
                        startContent={
                          <span className="inline-block pl-2">#</span>
                        }
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
                <p className="line-clamp-3 text-sm">{project.description}</p>
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-2">
                    {project.links?.map((link) => (
                      <Link key={link.url} href={link.url}>
                        <Chip
                          key={link.url}
                          // variant="bordered"
                          color="primary"
                          // size="sm"
                          // className="border-1 border-gray-300 text-gray-600"
                          startContent={
                            <span className="inline-block pl-2">
                              <LinkIcon size={15} />
                            </span>
                          }
                        >
                          {link.label}
                        </Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}

function Carousel({
  attachments = [],
}: {
  attachments: TechProject["attachments"];
}) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? attachments.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === attachments.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };
  return (
    <div className="p-4 bg-gray-100 h-56 w-full">
      <div className="relative h-full overflow-hidden">
        <ul
          className="absolute w-full h-full top-0 left-0 flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {attachments.map((attachment, index) => (
            <li key={attachment.id} className="min-w-full">
              <div className={cn("bg-gray-100 h-full relative")}>
                {["image/png", "image/jpeg"].includes(attachment.file_type) && (
                  <Image
                    radius="none"
                    isZoomed
                    src={attachment.file_url}
                    alt={attachment.file_name}
                    // className="object-cover w-full h-full object-center"
                  />
                )}
                {["video/mp4"].includes(attachment.file_type) && (
                  <video
                    controls
                    className="object-cover w-full h-full object-center"
                  >
                    <source
                      src={attachment.file_url}
                      type={attachment.file_type}
                    />
                  </video>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Button
          isIconOnly
          size="sm"
          radius="full"
          disabled={current === 0}
          onPress={handlePreviousClick}
          // hidden={attachments.length < 2}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:inline-flex bg-gray-100/80",
            attachments.length < 2 && "hidden group-hover:hidden"
          )}
        >
          <ChevronLeft />
        </Button>

        <Button
          isIconOnly
          size="sm"
          radius="full"
          disabled={current >= attachments.length - 1}
          // hidden={attachments.length < 2}
          onPress={handleNextClick}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:inline-flex bg-gray-100/80",
            attachments.length < 2 && "hidden group-hover:hidden"
          )}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
