"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Avatar,
  Chip,
  Skeleton,
  Button,
  Image,
} from "@heroui/react";
import { useDateFormatter } from "@react-aria/i18n";
import { ChevronLeft, ChevronRight, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkGalleryCard({ data }: { data: WorkGalleryItem }) {
  let formatter = useDateFormatter({ dateStyle: "medium" });
  const router = useRouter();
  return (
    <Card className="max-w-[400px] group" isHoverable>
      <CardHeader className="flex gap-3">
        {data.attachments.length > 0 ? (
          <Carousel attachments={data.attachments} />
        ) : (
          <div className="relative h-48 w-full rounded-lg bg-gray-100 overflow-hidden">
            <Image src="/no-image.jpg" alt="no image" />
          </div>
        )}
        {/* <div className="h-48 w-full rounded-lg bg-gray-100"></div> */}
      </CardHeader>
      {/* <Divider /> */}
      <CardBody className="space-y-3">
        <h3 className="text-lg font-medium">{data.title}</h3>
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            {data.tech_used?.map((tag) => (
              <Chip
                key={tag}
                variant="bordered"
                color="primary"
                size="sm"
                className="border-1 border-gray-300 text-gray-600"
                startContent={<span className="inline-block pl-2">#</span>}
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>
        <p className="line-clamp-3 text-sm">{data.description}</p>

        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            {data.links?.map((link) => (
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
      </CardBody>
      <Divider />
    </Card>
  );
}

export function WorkGalleryCardSkeleton() {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div>
          <Skeleton className="flex rounded-xl w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-6 min-h-64">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="flex gap-2 items-start">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </CardFooter>
    </Card>
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
    <div className="relative h-48 w-full rounded-lg bg-gray-100 overflow-hidden">
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
  );
}
