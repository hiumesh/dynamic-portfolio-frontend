"use client";

import { getDetailBySlug } from "@/services/api/blog";
import { Avatar, Chip } from "@heroui/react";
import { useDateFormatter } from "@react-aria/i18n";
import { useQuery } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import { useParams } from "next/navigation";

export default function Header() {
  let formatter = useDateFormatter({ dateStyle: "medium" });
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["blog", params.slug],
    queryFn: async () => {
      const response = await getDetailBySlug(params.slug);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  if (error || isLoading || !data) return null;

  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold">{data?.title}</h1>
      <div className="flex gap-2 items-center flex-wrap">
        {data?.tags?.map((tag) => (
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
      {data?.updated_at ? (
        <div className="flex items-center gap-0.5 text-sm">
          Last Updated <Dot />
          {formatter.format(new Date(data?.updated_at)) || "Unknown"}
        </div>
      ) : null}
      <div className="flex gap-3 py-10">
        <Avatar
          isBordered
          radius="sm"
          src={data.publisher_avatar}
          name={data.publisher_name}
        />
        <div className="flex flex-col text-left">
          <p className="text-md">{data?.publisher_name}</p>

          <p className="text-small text-default-500">
            <span>Published On - </span>{" "}
            {formatter.format(new Date(data?.published_at)) || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
