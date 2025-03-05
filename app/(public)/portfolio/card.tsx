"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Avatar,
  Chip,
  Skeleton,
} from "@nextui-org/react";
import { Quote } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PortfolioCard({ data }: { data: PortfolioListItem }) {
  const router = useRouter();
  return (
    <Card
      className="max-w-[400px]"
      isHoverable
      isPressable
      onPress={() => {
        router.push(`/portfolio/${data.slug}/default`);
      }}
    >
      <CardHeader className="flex gap-3">
        <Avatar isBordered radius="sm" src={data.avatar} name={data.name} />
        <div className="flex flex-col text-left">
          <p className="text-md">{data.name}</p>
          <p className="text-small text-default-500">
            {data?.college || "Graduation Not Mentioned"}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {data.work_domains?.map((w) => (
            <Chip key={w} variant="faded" color="primary">
              {w}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2 items-start">
          <div>
            <Quote size={14} className="relative top-1" />
          </div>
          <p>{data.tagline}</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm text-gray-600">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill) => (
              <Chip key={skill} variant="solid" color="primary">
                {skill}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex flex-wrap gap-2 text-xs">
          {data.social_profiles?.map((item) => (
            <Link
              key={item.url}
              isExternal
              href={item.url}
              showAnchorIcon
              className="text-sm"
            >
              {item.platform}
            </Link>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export function PortfolioCardSkeleton() {
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
