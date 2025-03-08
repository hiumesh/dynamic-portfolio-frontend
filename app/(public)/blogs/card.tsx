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
import { useDateFormatter } from "@react-aria/i18n";
import { useRouter } from "next/navigation";

export default function BlogCard({ data }: { data: BlogPost }) {
  let formatter = useDateFormatter({ dateStyle: "medium" });
  const router = useRouter();
  return (
    <Card
      className="max-w-[400px]"
      isHoverable
      isPressable
      onPress={() => {
        router.push(`/blogs/${data.slug}`);
      }}
    >
      <CardHeader className="flex gap-3">
        <Avatar
          isBordered
          radius="sm"
          src={data.publisher_avatar}
          name={data.publisher_name}
        />
        <div className="flex flex-col text-left">
          <p className="text-md">{data.publisher_name}</p>
          <p className="text-small text-default-500">
            <span>Published On - </span>{" "}
            {formatter.format(new Date(data.published_at)) || "Unknown"}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-3">
        <h3 className="text-2xl font-bold">{data.title}</h3>
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            {data.tags?.map((tag) => (
              <Chip
                key={tag}
                variant="bordered"
                color="primary"
                className="border-1 border-gray-300 text-gray-600"
                startContent={<span className="inline-block pl-2">#</span>}
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
      <Divider />
    </Card>
  );
}

export function BlogCardSkeleton() {
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
